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
import docx  
from haystack.document_stores.types import DuplicatePolicy


def get_name_format_file(file_path):
    file_name = os.path.basename(file_path)
    file = os.path.splitext(file_name)
    return {'file_name':file_name, 'split_name': file}

def embedding_content_fromURL(url: str):
    # request to url to get data which have html format
    http = urllib3.PoolManager()
    resp = http.request("Get", url)
    # store in file html
    save_to = ".//upload//Temp.html"
    with open(os.path.join(save_to), 'wb') as f:
        f.write(resp.data)

    #Get content from url
    pipeline = Pipeline()
    pipeline.add_component("converter", HTMLToDocument())
    pipeline.add_component("cleaner", DocumentCleaner())
    pipeline.add_component("splitter", DocumentSplitter(split_by="word", split_length=200, split_overlap = 100))
    #pipeline.add_component("writer", DocumentWriter(document_store=document_store))
    pipeline.connect("converter", "cleaner")
    pipeline.connect("cleaner", "splitter")
    #pipeline.connect("splitter", "writer")
    res = pipeline.run({"converter": {"sources": [save_to]}})

    # split content and store in list documents
    docu = res['splitter']['documents']

    #load qdrant cloud
    document_store = QdrantDocumentStore(
    index = "ThongTinKhoaHoc",
        url = "https://f15cf5fc-0771-4b8a-aad5-c4f5c6ae1f1d.us-east4-0.gcp.cloud.qdrant.io:6333",
            api_key=Secret.from_token("U5tzMbWaGxk3wDvR9yzHCvnFVsTXosi5BR7qFcb7X_j7JOmo4L7RBA"),
    )
    # init embedder
    doc_embedder = SentenceTransformersDocumentEmbedder()
    doc_embedder.warm_up()

    ## Use embedder Embedding file document for Fetch và Indexing
    docs_with_embeddings = doc_embedder.run(docu)
    document_store.write_documents(docs_with_embeddings["documents"], policy=DuplicatePolicy.SKIP)
    
    return "Success!"
  



def embedding_txt(filepath: str = "test.txt"):

    document_store = QdrantDocumentStore(
    index = "ThongTinKhoaHoc",
        url = "https://f15cf5fc-0771-4b8a-aad5-c4f5c6ae1f1d.us-east4-0.gcp.cloud.qdrant.io:6333",
            api_key=Secret.from_token("U5tzMbWaGxk3wDvR9yzHCvnFVsTXosi5BR7qFcb7X_j7JOmo4L7RBA"),
    )
    pipeline = Pipeline()
    pipeline.add_component("converter", TextFileToDocument())
    pipeline.add_component("cleaner", DocumentCleaner())
    pipeline.add_component("splitter", DocumentSplitter(split_by="word", split_length=200, split_overlap = 100))
    pipeline.connect("converter", "cleaner")
    pipeline.connect("cleaner", "splitter")

    res = pipeline.run({"converter": {"sources": [filepath]}})
    docu = res['splitter']['documents']
        # init embedder
    doc_embedder = SentenceTransformersDocumentEmbedder()
    doc_embedder.warm_up()

    ## Use embedder Embedding file document for Fetch và Indexing
    docs_with_embeddings = doc_embedder.run(docu)
    document_store.write_documents(docs_with_embeddings["documents"], policy=DuplicatePolicy.SKIP)
    return "Success!"


def embedding_docx(file_path: str): 
  doc = docx.Document(file_path) 
  file = get_name_format_file(file_path)['split_name']
  # print the list of paragraphs in the document 
  print('List of paragraph objects:->>>') 
  document_text= ""
  for n in doc.paragraphs:
    document_text = f"{document_text} \n {n.text}"

  new_file = os.path.join(os.path.dirname(file_path),f"{file[0]}.txt")
  with open(new_file, "w", encoding="utf-8") as file:
          file.write(document_text)

  embedding_txt(new_file)
  return "Success!"

    



# Embed pdf
def embedding_pdf(filepath: str = "test.txt"):
    document_store = QdrantDocumentStore(
    index = "ThongTinKhoaHoc",
        url = "https://f15cf5fc-0771-4b8a-aad5-c4f5c6ae1f1d.us-east4-0.gcp.cloud.qdrant.io:6333",
            api_key=Secret.from_token("U5tzMbWaGxk3wDvR9yzHCvnFVsTXosi5BR7qFcb7X_j7JOmo4L7RBA"),
    )
    pipeline = Pipeline()
    pipeline.add_component("converter",  PyPDFToDocument())
    pipeline.add_component("cleaner", DocumentCleaner())
    pipeline.add_component("splitter", DocumentSplitter(split_by="word", split_length=200, split_overlap=100 ))
    pipeline.add_component("embedder", SentenceTransformersDocumentEmbedder())

    pipeline.add_component("writer", DocumentWriter(document_store=document_store, policy=DuplicatePolicy.SKIP))
    pipeline.connect("converter", "cleaner")
    pipeline.connect("cleaner", "splitter")
    pipeline.connect("splitter","embedder")
    pipeline.connect("embedder", "writer")

    pipeline.run({"converter": {"sources": [filepath]}})

    return "Success!"



  
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
    # init qdrant cloud instance
    document_store = QdrantDocumentStore(
    index = "ThongTinKhoaHoc",
        url = "https://f15cf5fc-0771-4b8a-aad5-c4f5c6ae1f1d.us-east4-0.gcp.cloud.qdrant.io:6333",
            api_key=Secret.from_token("U5tzMbWaGxk3wDvR9yzHCvnFVsTXosi5BR7qFcb7X_j7JOmo4L7RBA")
    )
    ## Use embedder Embedding file document for Fetch và Indexing
    embedder = SentenceTransformersDocumentEmbedder()
    document_writer = DocumentWriter(document_store = document_store, policy=DuplicatePolicy.SKIP)
    indexing_pipeline = Pipeline()
    indexing_pipeline.add_component(instance=embedder, name="embedder")
    indexing_pipeline.add_component(instance=document_writer, name="writer")
    indexing_pipeline.connect("embedder", "writer")
    indexing_pipeline.run({"embedder": {"documents": docu}})
    return "Success!"
    