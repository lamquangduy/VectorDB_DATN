from haystack.components.embedders import  SentenceTransformersDocumentEmbedder
import urllib3
from haystack import Pipeline
from haystack.document_stores.in_memory import InMemoryDocumentStore
from haystack.components.converters import HTMLToDocument
from haystack.components.preprocessors import DocumentCleaner
from haystack.components.preprocessors import DocumentSplitter
from haystack.components.writers import DocumentWriter
from haystack_integrations.components.retrievers.qdrant import QdrantEmbeddingRetriever
from haystack.utils import Secret
from haystack_integrations.document_stores.qdrant import QdrantDocumentStore
from pathlib import Path
import requests
from boilerpy3 import extractors
import os
import pandas as pd
from haystack.dataclasses import Document
from haystack.components.converters import PyPDFToDocument
from haystack.components.converters import TextFileToDocument


def embedding_csv(filepath: str = ".\courses.csv"):
    df = pd.read_csv(filepath)
    size_col = len(df.columns)
    docu = []
    for index, row in df.iterrows():
        data_row= ""
        for i in range(size_col):
            data_row = f"{data_row}{df.columns[i]}:  {row.to_list()[i]}. "
        docu.append(Document(content=data_row))
    # init embedder
    doc_embedder = SentenceTransformersDocumentEmbedder()
    doc_embedder.warm_up()
    # init qdrant cloud instance
    document_store = QdrantDocumentStore(
    index = "CSV",
        url = "https://f15cf5fc-0771-4b8a-aad5-c4f5c6ae1f1d.us-east4-0.gcp.cloud.qdrant.io:6333",
            api_key=Secret.from_token("U5tzMbWaGxk3wDvR9yzHCvnFVsTXosi5BR7qFcb7X_j7JOmo4L7RBA"),
    )
    ## Use embedder Embedding file document for Fetch và Indexing
    docs_with_embeddings = doc_embedder.run(docu)
    document_store.write_documents(docs_with_embeddings["documents"])
    if document_store.count_documents() > 0:
        return "Success"
    else:
        return "Fail"