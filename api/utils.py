import re
import pickle
import os
from typing import Any

# Common English stopwords (hardcoded to avoid NLTK downloads)
STOPWORDS = {
    'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from',
    'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'or', 'that',
    'the', 'to', 'was', 'will', 'with', 'would', 'you', 'your',
    'i', 'me', 'my', 'we', 'us', 'our', 'they', 'them', 'this', 'but',
    'not', 'no', 'so', 'do', 'does', 'did', 'have', 'had', 'if', 'how',
    'what', 'when', 'where', 'who', 'which', 'why', 'all', 'each', 'every'
}

def preprocess_text(text: str) -> str:
    """
    Preprocess text for ML models (lightweight, no NLTK)
    - Remove special characters
    - Convert to lowercase
    - Remove stopwords
    """
    if not isinstance(text, str):
        return ""
    
    # Remove special characters and convert to lowercase
    text = re.sub(r"[^a-zA-Z\s]", "", text).lower()
    
    # Tokenize and remove stopwords
    tokens = [token for token in text.split() if token and token not in STOPWORDS]
    
    return " ".join(tokens)

def load_pickle_file(path: str) -> Any:
    """Load a pickle file safely"""
    if not os.path.exists(path):
        raise FileNotFoundError(f"File not found: {path}")
    
    try:
        with open(path, "rb") as f:
            return pickle.load(f)
    except Exception as e:
        raise Exception(f"Error loading {path}: {str(e)}")
