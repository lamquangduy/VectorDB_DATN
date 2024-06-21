from .core.functions import chatbot_with_fc
from haystack.dataclasses import ChatMessage
from .core import embedding_func
from pathlib import Path
from src.database.mongodb.repository import mongo_client

from bson import json_util
import json


def get_chat_result(text, history=[]):
    result = chatbot_with_fc(text, history)
    return {"response": result}


def dict_2_messages(history=[]):
    messages = []
    for n in history:
        if n["role"] == "system":
            messages.append(ChatMessage.from_system(n["content"]))
        elif n["role"] == "user":
            messages.append(ChatMessage.from_user(n["content"]))
        elif n["role"] == "function":
            messages.append(
                ChatMessage.from_function(content=n["content"], name=n["name"])
            )
        else:
            messages.append(ChatMessage.from_assistant(n["content"]))
    return messages


def embedding(formatFile: str, filepath):
    UPLOAD_DIR = (
        Path().resolve()
        / f"upload//{embedding_func.get_name_format_file(filepath)['file_name']}"
    )
    print(UPLOAD_DIR)
    match formatFile:
        case ".csv":
            embedding_func.embedding_csv(UPLOAD_DIR)
            return "zero"
        case ".docx":
            embedding_func.embedding_docx(UPLOAD_DIR)
            return "one"
        case ".pdf":
            embedding_func.embedding_pdf(UPLOAD_DIR)
            return "two"
        case ".txt":
            embedding_func.embedding_txt(UPLOAD_DIR)
            return "three"
        case ".xlsx":
            embedding_func.embedding_excel(UPLOAD_DIR)


def get_format(filepath: str):
    return embedding_func.get_name_format_file(filepath)


def embedding_URL(url: str):
    embedding_func.embedding_content_fromURL(url)
    return "embedded"


def get_chat_history(email: str, chat_id: str = None):
    db = mongo_client["chatbot"]
    collection = db["chat_history"]
    condition = {"email": email}
    if chat_id:
        condition["chat_id"] = chat_id
    result = collection.find(condition, {"_id": 0})
    result = json.loads(json_util.dumps(result))
    return result

def get_role(email: str):
    db = mongo_client["chatbot"]
    collection = db["chat_role"]
    condition = {"email": email}
    result = collection.find(condition)
    result = json.loads(json_util.dumps(result))
    return result

def save_chat_history(email: str, history: list, chat_name: str, chat_id: str = None):
    db = mongo_client["chatbot"]
    collection = db["chat_history"]
    if(chat_name==""):
        collection.find_one_and_update(
            {"email": email, "chat_id": chat_id},
            {"$set": {"history": history}},
            upsert=True,
        )
    else: 
        collection.find_one_and_update(
            {"email": email, "chat_id": chat_id,"chat_name": chat_name},
            {"$set": {"history": history}},
            upsert=True,
        )        
    return "saved"


def delete_chat_history(email: str, chat_id: str):
    db = mongo_client["chatbot"]
    collection = db["chat_history"]
    collection.delete_one({"email": email, "chat_id": chat_id})
    return True
