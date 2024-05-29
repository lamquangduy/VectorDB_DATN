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

import embedding_func

from spire.doc import *
from spire.doc.common import *

def get_name_format_file(file_path):
    file_name = os.path.basename(file_path)
    file = os.path.splitext(file_name)
    return {'file_name':file_name, 'split_name': file}


def embedding_docx(file_path):
    #get file name
    file = get_name_format_file(file_path)['split_name']
    # Create a Document object
    document = Document()
    # Load a Word document
    document.LoadFromFile(file_path)
    # Extract the text of the document
    document_text = document.GetText()
    new_file = os.path.join(os.path.dirname(file_path),f"{file[0]}.txt")
    # Write the extracted text into a text file
    with open(new_file, "w", encoding="utf-8") as file:
        file.write(document_text)


    embedding_func.embedding_txt(new_file)
    document.Close()

