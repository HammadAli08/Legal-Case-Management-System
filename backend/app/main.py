""" Legal AI FastAPI Backend
Production-ready API for legal case management
"""

import warnings
warnings.simplefilter(action='ignore', category=FutureWarning)

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import logging

# LangChain imports
from langchain_qdrant import QdrantVectorStore
from qdrant_client import QdrantClient
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_groq import ChatGroq
from langchain.chains import create_retrieval_chain, create_history_aware_retriever
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import HumanMessage, AIMessage

# Local imports
from app.config import get_settings
from app.models import (
    HealthResponse, CaseClassificationRequest, CaseClassificationResponse,
    CasePrioritizationRequest, CasePrioritizationResponse,
    ChatRequest, ChatResponse, SourceDocument
)
from app.utils import preprocess_text, load_pickle_file

# Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Settings
settings = get_settings()

# Global models
classification_pipeline = None
classification_label_encoder = None
prioritization_pipeline = None
prioritization_label_encoder = None
rag_chain = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    global classification_pipeline, classification_label_encoder
    global prioritization_pipeline, prioritization_label_encoder
    global rag_chain

    logger.info("🚀 Starting Legal AI API...")

    try:
        # Load classification models
        classification_pipeline = load_pickle_file(settings.CLASSIFICATION_PIPELINE)
        classification_label_encoder = load_pickle_file(settings.CLASSIFICATION_ENCODER)

        # Load prioritization models
        prioritization_pipeline = load_pickle_file(settings.PRIORITIZATION_PIPELINE)
        prioritization_label_encoder = load_pickle_file(settings.PRIORITIZATION_ENCODER)

        # Initialize RAG chain
        embeddings = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2",
            huggingface_api_key=settings.HUGGINGFACE_API_KEY
        )

        client = QdrantClient(
            url=settings.QDRANT_URL,
            api_key=settings.QDRANT_API_KEY
        )

        vector_store = QdrantVectorStore(
            client=client,
            collection_name=settings.QDRANT_COLLECTION,
            embedding=embeddings
        )

        base_retriever = vector_store.as_retriever(search_kwargs={"k": 5})

        llm = ChatGroq(
            model_name=settings.GROQ_MODEL,
            api_key=settings.GROQ_API_KEY,
            temperature=0.1
        )

        contextualize_q_system_prompt = (
            "Given a chat history and the latest user question, formulate a standalone "
            "question which can be understood without chat history. Do NOT answer it."
        )
        contextualize_q_prompt = ChatPromptTemplate.from_messages([
            ("system", contextualize_q_system_prompt),
            MessagesPlaceholder("chat_history"),
            ("human", "{input}")
        ])

        history_aware_retriever = create_history_aware_retriever(
            llm, base_retriever, contextualize_q_prompt
        )

        qa_system_prompt = """
        You are a Senior Legal Research Assistant with forensic precision.

        CRITICAL INSTRUCTIONS:
        1. Zero External Knowledge: Answer ONLY based on provided Context
        2. No Hallucination: If not in context, state clearly
        3. Evidence-Based: Support every claim with references
        4. Formal Tone: Professional and objective

        OUTPUT FORMAT:

        Executive Summary:
        [2-3 sentence direct answer]

        Relevant Precedents & Analysis:
        • [Case/Section]: [Key holding]

        Conclusion:
        [Summary based on context]

        CONTEXT:
        {context}
        """
        qa_prompt = ChatPromptTemplate.from_messages([
            ("system", qa_system_prompt),
            MessagesPlaceholder("chat_history"),
            ("human", "{input}")
        ])

        question_answer_chain = create_stuff_documents_chain(llm, qa_prompt)

        rag_chain = create_retrieval_chain(history_aware_retriever, question_answer_chain)

        logger.info("✅ All models loaded successfully!")

    except Exception as e:
        logger.error(f"❌ Error loading models: {str(e)}")
        raise

    yield
    logger.info("🔄 Shutting down...")


# Initialize FastAPI
app = FastAPI(
    title=settings.API_TITLE,
    version=settings.API_VERSION,
    description=settings.API_DESCRIPTION,
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.error(f"Global exception: {str(exc)}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "Internal server error occurred"}
    )


# Routes
@app.get("/", response_model=HealthResponse)
async def health_check():
    return HealthResponse(status="online", message="Legal AI API running", version=settings.API_VERSION)

@app.get("/health", response_model=HealthResponse)
async def health():
    return HealthResponse(status="healthy", message="All systems operational", version=settings.API_VERSION)

@app.post("/api/classify", response_model=CaseClassificationResponse)
async def classify_case(request: CaseClassificationRequest):
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Case text cannot be empty")
    cleaned_text = preprocess_text(request.text)
    prediction_encoded = classification_pipeline.predict([cleaned_text])
    prediction_label = classification_label_encoder.inverse_transform(prediction_encoded)[0]
    return CaseClassificationResponse(category=prediction_label)

@app.post("/api/prioritize", response_model=CasePrioritizationResponse)
async def prioritize_case(request: CasePrioritizationRequest):
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Case text cannot be empty")
    cleaned_text = preprocess_text(request.text)
    prediction_encoded = prioritization_pipeline.predict([cleaned_text])
    prediction_label = prioritization_label_encoder.inverse_transform(prediction_encoded)[0]
    return CasePrioritizationResponse(priority=prediction_label)

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    chat_history = [
        HumanMessage(content=m.content) if m.role == "user" else AIMessage(content=m.content)
        for m in request.chat_history
    ]

    response = rag_chain.invoke({"input": request.message, "chat_history": chat_history})

    sources = [
        SourceDocument(
            index=i + 1,
            content=(getattr(doc, "page_content", "No content")[:300] + "..." if len(getattr(doc, "page_content", "")) > 300 else getattr(doc, "page_content", "")),
            metadata=getattr(doc, "metadata", {})
        )
        for i, doc in enumerate(response.get("context", []))
    ]

    return ChatResponse(answer=response["answer"], sources=sources)


if __name__ == "__main__":
    import os
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port, log_level="info")
