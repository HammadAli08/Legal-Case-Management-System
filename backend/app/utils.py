import re
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
import pickle
import os
from typing import Any

# Download NLTK data on import
nltk.download('stopwords', quiet=True)
nltk.download('wordnet', quiet=True)
nltk.download('omw-1.4', quiet=True)

def preprocess_text(text: str) -> str:
    """
    Preprocess text for ML models
    - Remove special characters
    - Convert to lowercase
    - Remove stopwords
    - Lemmatize tokens
    """
    if not isinstance(text, str):
        return ""
    
    # Remove special characters and numbers
    text = re.sub(r"[^a-zA-Z0-9]", " ", text).lower()
    
    # Tokenize
    tokens = text.split()
    
    # Remove stopwords and lemmatize
    stop_words = set(stopwords.words('english'))
    lemmatizer = WordNetLemmatizer()
    
    processed_tokens = [
        lemmatizer.lemmatize(token) 
        for token in tokens 
        if token not in stop_words
    ]
    
    return " ".join(processed_tokens)

def load_pickle_file(path: str) -> Any:
    """Load a pickle file safely"""
    if not os.path.exists(path):
        raise FileNotFoundError(f"File not found: {path}")
    
    try:
        with open(path, "rb") as f:
            return pickle.load(f)
    except Exception as e:
        raise Exception(f"Error loading {path}: {str(e)}")
