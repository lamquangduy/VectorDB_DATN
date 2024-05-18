# pip uninstall -y farm-haystack haystack-ai
# pip install haystack-ai
# pip install qdrant-haystack
# pip install "sentence-transformers>=2.2.0"
#

import os
import json

# import gradio as gr
import pandas as pd

from haystack import Pipeline
from haystack.components.embedders import (
    SentenceTransformersTextEmbedder,
    SentenceTransformersDocumentEmbedder,
)
from haystack.components.builders import PromptBuilder
from haystack.components.generators import OpenAIGenerator
from haystack.dataclasses import ChatMessage
from haystack.components.generators.chat import OpenAIChatGenerator
from haystack.components.generators.utils import print_streaming_chunk
from haystack import Document

# from load_documentstore import load_store
from haystack.dataclasses import ChatMessage
from haystack.components.generators.chat import OpenAIChatGenerator
from haystack_integrations.components.retrievers.qdrant import QdrantEmbeddingRetriever
from haystack.utils import Secret
from haystack_integrations.document_stores.qdrant import QdrantDocumentStore


# Create a new column which have content is name + description + skill
def add_content_current_course(filepath: str):
    df = pd.read_csv(filepath)
    df["content"] = (
        "Course Name: "
        + df["name"]
        + ".With course description: "
        + df["description"]
        + ". And this course will help you for improving skills such as: "
        + df["skills"]
    )
    course_info = dict(
        [
            (i, [x, y, z])
            for i, x, y, z in zip(
                df["name"].str.upper(), df["description"], df["skills"], df["content"]
            )
        ]
    )

    return course_info


# Call instance qdrant cloud
def load_store(
    index_name: str, url: str, token: str, embedding_dim: int = 768
) -> QdrantDocumentStore:

    return QdrantDocumentStore(
        index=index_name,
        url=url,
        api_key=Secret.from_token(token=token),
        embedding_dim=embedding_dim,
    )


# Embed info
def embedding_csv(index_name: str, filepath: str = ".\courses.csv"):
    doc_store = load_store(
        index_name,
        "https://f15cf5fc-0771-4b8a-aad5-c4f5c6ae1f1d.us-east4-0.gcp.cloud.qdrant.io:6333",
        "U5tzMbWaGxk3wDvR9yzHCvnFVsTXosi5BR7qFcb7X_j7JOmo4L7RBA",
    )
    df = pd.read_csv(filepath)
    # Use data to initialize Document objects
    urls = list(df["url"].values)
    names = list(df["name"].values)
    instructors = list(df["instructor"].values)
    enrolls = list(df["enroll"].values)
    descriptions = list(df["description"].values)
    skills = list(df["skills"].values)
    relatives = list(df["relative"].values)
    rates = list(df["rate"].values)
    levels = list(df["level"].values)
    images = list(df["image"].values)
    df.fillna(value="", inplace=True)
    # init a document store
    docs = []
    for (
        url,
        name,
        instructor,
        enroll,
        description,
        skill,
        relative,
        rate,
        level,
        image,
    ) in zip(
        urls,
        names,
        instructors,
        enrolls,
        descriptions,
        skills,
        relatives,
        rates,
        levels,
        images,
    ):
        docs.append(
            Document(
                content=f"Course Name: {name}.With course description: {description}. And this course will help you for improving skills such as: {skill}",
                meta={
                    "name": name or "",
                    "url": url or "",
                    "instructor": instructor or "",
                    "enroll": enroll or "",
                    "skill": skill or "",
                    "relative": relative or "",
                    "rate": rate or "",
                    "level": level or "",
                    "image": image or "",
                },
            )
        )
    # init embedder
    doc_embedder = SentenceTransformersDocumentEmbedder()
    doc_embedder.warm_up()
    ## Use embedder Embedding file document for Fetch và Indexing
    docs_with_embeddings = doc_embedder.run(docs)
    doc_store.write_documents(docs_with_embeddings["documents"])
    if doc_store.count_documents() > 0:
        return "Success"
    else:
        return "Fail"


# RAG pipeline Q-A system
def rag_pipe():
    template = """
    Answer the questions based on the given context.

    Context:
    {% for document in documents %}
        {{ document.content }}
    {% endfor %}
    Question: {{ question }}
    Answer:
    """
    docstore = load_store(
        "ThongTinKhoaHoc",
        "https://f15cf5fc-0771-4b8a-aad5-c4f5c6ae1f1d.us-east4-0.gcp.cloud.qdrant.io:6333",
        "U5tzMbWaGxk3wDvR9yzHCvnFVsTXosi5BR7qFcb7X_j7JOmo4L7RBA",
    )
    rag_pipe = Pipeline()
    rag_pipe.add_component("embedder", SentenceTransformersTextEmbedder())
    rag_pipe.add_component(
        "retriever", QdrantEmbeddingRetriever(document_store=docstore)
    )
    rag_pipe.add_component("prompt_builder", PromptBuilder(template=template))
    rag_pipe.add_component("llm", OpenAIGenerator(model="gpt-3.5-turbo"))

    rag_pipe.connect("embedder.embedding", "retriever.query_embedding")
    rag_pipe.connect("retriever", "prompt_builder.documents")
    rag_pipe.connect("prompt_builder", "llm")
    return rag_pipe


# Run RAG Q-A system with query input
def rag_pipeline_func(query: str):
    result = rag_pipe().run(
        {"embedder": {"text": query}, "prompt_builder": {"question": query}}
    )
    return {"reply": result["llm"]["replies"][0]}


# Get info (name + description + skill) through course name
def get_content_course(course_name: str, filepath: str = "./courses.csv"):
    course_info = add_content_current_course(filepath)
    if course_name.upper() in course_info:
        content = course_info[course_name.upper()][2]
        list_name = rag_pipeline_func("Get top 8 similar course of " + content + "?")
        return list_name
    # fallback data
    else:
        return {"reply": "No content"}

def get_suggestions(content):
    llm = OpenAIGenerator(model="gpt-3.5-turbo")
    response = llm.run("Give me a list 4 suggestions question, which have less than 10 words, only text and don't need numberring, each line only have one question, for user to ask with previous question and its answer is:"+content)
    list_of_lines = response['replies'][0].splitlines()
    return list_of_lines

def chatbot_with_fc(message, history=[]):
    messages = []
    chat_generator = OpenAIChatGenerator(model="gpt-3.5-turbo")
    tools = [
        {
            "type": "function",
            "function": {
                "name": "rag_pipeline_func",
                "description": "Get information about course",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "query": {
                            "type": "string",
                            "description": "The query to use in the search. Infer this from the user's message. It should be a question or a statement",
                        }
                    },
                    "required": ["query"],
                },
            },
        },
        {
            "type": "function",
            "function": {
                "name": "get_content_course",
                "description": "Get similarity courses",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "course_name": {
                            "type": "string",
                            "description": "The city and state, e.g. San Francisco, CA",
                        }
                    },
                    "required": ["course_name"],
                },
            },
        },
    ]

    messages.append(ChatMessage.from_user(message))
    response = chat_generator.run(messages=messages, generation_kwargs={"tools": tools})

    while True:
        # if OpenAI response is a tool call
        if response and response["replies"][0].meta["finish_reason"] == "tool_calls":
            function_calls = json.loads(response["replies"][0].content)
            print(response["replies"][0])
            for function_call in function_calls:
                ## Parse function calling information
                function_name = function_call["function"]["name"]
                function_args = json.loads(function_call["function"]["arguments"])
                available_functions = {
                    "rag_pipeline_func": rag_pipeline_func,
                    "get_content_course": get_content_course,
                }
                ## Find the corresponding function and call it with the given arguments
                function_to_call = available_functions[function_name]
                function_response = function_to_call(**function_args)

                ## Append function response to the messages list using `ChatMessage.from_function`
                messages.append(
                    ChatMessage.from_function(
                        content=json.dumps(function_response), name=function_name
                    )
                )
                response = chat_generator.run(
                    messages=messages, generation_kwargs={"tools": tools}
                )

        # Regular Conversation
        else:
            messages.append(response["replies"][0])
            break
        # get suggestions for user to ask
        suggestions = get_suggestions(message + ". Answer: " + response["replies"][0].content)

        return {"history": messages, "answer":response["replies"][0].content, "tag" : suggestions}


# Test chatbot qua interface duoc support boi gradio
# def chatbot_interface():
#     response = None
#     messages = [
#         ChatMessage.from_system(
#             "Don't make assumptions about what values to plug into functions. Ask for clarification if a user request is ambiguous."
#         )
#     ]
#     cb = chatbot(messages, response)
#     demo = gr.ChatInterface(
#         fn=cb.chatbot_with_fc,
#         examples=[
#             "What is description of the course name IBM Applied DevOps Engineering Professional Certificate?",
#             "Which skills does the course name IBM Applied DevOps Engineering Professional Certificate have?",
#             "What are similarity courses of the course name whose is IBM Applied DevOps Engineering Professional Certificate?",
#         ],
#         title="Ask me about description or similar course!",
#     )
#     return demo


## Uncomment the line below to launch the chat app with UI
# chatbot_interface().launch()
