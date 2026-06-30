import os
import chromadb
from chromadb.utils import embedding_functions

# Use BAAI/bge-small-en-v1.5 as requested
EMBEDDING_MODEL_NAME = "BAAI/bge-small-en-v1.5"

class IncidentMemory:
    """
    Manages vector storage and retrieval for historical incidents and runbooks
    using ChromaDB and local embedding models.
    """
    def __init__(self, db_path: str = "vector_db"):
        os.makedirs(db_path, exist_ok=True)
        self.client = chromadb.PersistentClient(path=db_path)
        self.embedding_function = embedding_functions.SentenceTransformerEmbeddingFunction(
            model_name=EMBEDDING_MODEL_NAME
        )
        
        # Create or get collections
        self.incident_collection = self.client.get_or_create_collection(
            name="historical_incidents",
            embedding_function=self.embedding_function
        )
        self.runbook_collection = self.client.get_or_create_collection(
            name="runbooks",
            embedding_function=self.embedding_function
        )
        self.cache_collection = self.client.get_or_create_collection(
            name="semantic_cache",
            embedding_function=self.embedding_function
        )

    def store_incident(self, incident_id: str, description: str, metadata: dict = None):
        self.incident_collection.add(
            documents=[description],
            metadatas=[metadata or {}],
            ids=[incident_id]
        )

    def retrieve_similar_incidents(self, query: str, n_results: int = 3):
        results = self.incident_collection.query(
            query_texts=[query],
            n_results=n_results,
            include=["documents", "metadatas", "distances"]
        )
        return results

    def store_runbook(self, runbook_id: str, content: str, metadata: dict = None):
        # In a real app, intelligent chunking (e.g. Langchain text splitters) happens here
        self.runbook_collection.add(
            documents=[content],
            metadatas=[metadata or {}],
            ids=[runbook_id]
        )

    def retrieve_runbooks(self, query: str, n_results: int = 3):
        results = self.runbook_collection.query(
            query_texts=[query],
            n_results=n_results,
            include=["documents", "metadatas", "distances"]
        )
        return results

    def check_semantic_cache(self, query: str, threshold: float = 0.90):
        try:
            results = self.cache_collection.query(
                query_texts=[query],
                n_results=1,
                include=["documents", "metadatas", "distances"]
            )
            if not results["distances"] or not results["distances"][0]:
                return None
            
            distance = results["distances"][0][0]
            # Assuming distance is roughly 1 - similarity. Adjust based on embedding function.
            if distance < (1.0 - threshold): 
                return results["metadatas"][0][0].get("response_json")
            return None
        except Exception:
            return None

    def store_in_cache(self, query: str, response_json: str):
        import uuid
        try:
            cache_id = str(uuid.uuid4())
            self.cache_collection.add(
                documents=[query],
                metadatas=[{"response_json": response_json}],
                ids=[cache_id]
            )
        except Exception as e:
            pass

