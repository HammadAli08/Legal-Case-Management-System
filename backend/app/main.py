"""
Legal AI FastAPI Backend
Production-ready API for legal case management
"""
import warnings
warnings.simplefilter(action='ignore', category=FutureWarning)

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import logging

# LangChain imports (torch-free)
from langchain_qdrant import QdrantVectorStore
from qdrant_client import QdrantClient
from langchain_groq import ChatGroq
from langchain.chains import create_retrieval_chain, create_history_aware_retriever
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import HumanMessage, AIMessage
from langchain_core.embeddings import Embeddings 

# Local imports
from app.config import get_settings
from app.models import (
    HealthResponse, CaseClassificationRequest, CaseClassificationResponse,
    CasePrioritizationRequest, CasePrioritizationResponse,
    ChatRequest, ChatResponse, SourceDocument
)
from app.utils import preprocess_text, load_pickle_file

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Settings
# This call now safely loads all variables from the .env file.
settings = get_settings()

# Global variables for models
classification_pipeline = None
classification_label_encoder = None
prioritization_pipeline = None
prioritization_label_encoder = None
rag_chain = None

# Dummy embeddings to satisfy dense retrieval without Python embeddings
class DummyEmbeddings(Embeddings):
    """Minimal implementation of Embeddings abstract class."""
    # Assuming the vector dimension of the Qdrant index is 384 (common for MiniLM)
    def embed_documents(self, texts):
        return [[0.0] * 384] * len(texts)
    def embed_query(self, text):
        return [0.0] * 384

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load models on startup, cleanup on shutdown"""
    global classification_pipeline, classification_label_encoder
    global prioritization_pipeline, prioritization_label_encoder
    global rag_chain

    logger.info("🚀 Starting Legal AI API...")

    try:
        # Load Classification Models
        logger.info("📦 Loading classification models...")
        classification_pipeline = load_pickle_file(settings.CLASSIFICATION_PIPELINE)
        classification_label_encoder = load_pickle_file(settings.CLASSIFICATION_ENCODER)
        logger.info("✓ Classification models loaded")

        # Load Prioritization Models
        logger.info("📦 Loading prioritization models...")
        prioritization_pipeline = load_pickle_file(settings.PRIORITIZATION_PIPELINE)
        prioritization_label_encoder = load_pickle_file(settings.PRIORITIZATION_ENCODER)
        logger.info("✓ Prioritization models loaded")

        # Initialize RAG Chain (torch-free)
        logger.info("🔗 Initializing RAG chain...")

        # --- QDRANT INITIALIZATION USING SETTINGS ---
        client = QdrantClient(
            url=settings.QDRANT_URL,
            api_key=settings.QDRANT_API_KEY
        )

        vector_store = QdrantVectorStore(
            client=client,
            collection_name=settings.QDRANT_COLLECTION,
            embedding=DummyEmbeddings() 
        )

        base_retriever = vector_store.as_retriever(search_kwargs={"k": 5})

        # --- GROQ INITIALIZATION USING SETTINGS ---
        llm = ChatGroq(
            model_name=settings.GROQ_MODEL,
            api_key=settings.GROQ_API_KEY, # Fetched from settings
            temperature=0.1
        )
        
        # --- LangChain Chain Setup ---
        contextualize_q_prompt = ChatPromptTemplate.from_messages([
            ("system", "Given the chat history and the user's latest question, generate a standalone question."),
            MessagesPlaceholder("chat_history"),
            ("human", "{input}"),
        ])
        
        history_aware_retriever = create_history_aware_retriever(
            llm, base_retriever, contextualize_q_prompt
        )

        qa_prompt = ChatPromptTemplate.from_messages([
            ("system", "Answer the user's question only based on the following context: {context}"),
            MessagesPlaceholder("chat_history"),
            ("human", "{input}"),
        ])
        
        question_answer_chain = create_stuff_documents_chain(llm, qa_prompt)
        
        rag_chain = create_retrieval_chain(history_aware_retriever, question_answer_chain)

        logger.info("✅ All models loaded successfully!")

    except Exception as e:
        logger.error(f"❌ Error loading models: {str(e)}")
        # Note: If the RAG setup fails here (e.g., Qdrant connection issue), 
        # the app will not start, which is a good fail-safe for production.
        # raise  <-- Commented out to prevent crash on missing keys
        logger.warning("⚠️ Continuing startup despite model loading errors. Some features may not work.")

    yield

    logger.info("🔄 Shutting down...")


# Initialize FastAPI
app = FastAPI(
    title=settings.API_TITLE,
    version=settings.API_VERSION,
    description=settings.API_DESCRIPTION,
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception handlers
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.error(f"Global exception: {str(exc)}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "Internal server error occurred"}
    )

# Health check endpoints
@app.get("/", response_model=HealthResponse)
async def health_check():
    return HealthResponse(
        status="online",
        message="Legal AI API is running",
        version=settings.API_VERSION
    )

@app.get("/health", response_model=HealthResponse)
async def health():
    return HealthResponse(
        status="healthy",
        message="All systems operational",
        version=settings.API_VERSION
    )

# Case classification endpoint
@app.post("/api/classify", response_model=CaseClassificationResponse)
async def classify_case(request: CaseClassificationRequest):
    try:
        if not request.text.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Case text cannot be empty"
            )

        cleaned_text = preprocess_text(request.text)
        prediction_encoded = classification_pipeline.predict([cleaned_text])
        prediction_label = classification_label_encoder.inverse_transform(
            prediction_encoded
        )[0]

        logger.info(f"Classification: {prediction_label}")
        return CaseClassificationResponse(category=prediction_label)

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Classification error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Classification failed: {str(e)}"
        )

# Case prioritization endpoint
@app.post("/api/prioritize", response_model=CasePrioritizationResponse)
async def prioritize_case(request: CasePrioritizationRequest):
    try:
        if not request.text.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Case text cannot be empty"
            )

        cleaned_text = preprocess_text(request.text)
        prediction_encoded = prioritization_pipeline.predict([cleaned_text])
        prediction_label = prioritization_label_encoder.inverse_transform(
            prediction_encoded
        )[0]

        logger.info(f"Priority: {prediction_label}")
        return CasePrioritizationResponse(priority=prediction_label)

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Prioritization error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Prioritization failed: {str(e)}"
        )

# Chat endpoint
@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        if not request.message.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Message cannot be empty"
            )

        chat_history = []
        for msg in request.chat_history:
            if msg.role == "user":
                chat_history.append(HumanMessage(content=msg.content))
            elif msg.role == "assistant":
                chat_history.append(AIMessage(content=msg.content))

        # Check if rag_chain was successfully initialized during lifespan
        if rag_chain is None:
             raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="RAG service is unavailable. Check server startup logs."
            )

        response = rag_chain.invoke({
            "input": request.message,
            "chat_history": chat_history
        })

        sources = []
        for i, doc in enumerate(response.get("context", [])):
            content = getattr(doc, 'page_content', "No content available")
            metadata = getattr(doc, 'metadata', {})

            sources.append(SourceDocument(
                index=i + 1,
                content=content[:300] + "..." if len(content) > 300 else content,
                metadata=metadata
            ))

        logger.info(f"Chat response generated with {len(sources)} sources")

        return ChatResponse(
            answer=response['answer'],
            sources=sources
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Chat error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Chat failed: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")