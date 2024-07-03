from .core.functions import chatbot_with_fc
from haystack.dataclasses import ChatMessage
from .core import embedding_func
from .core import functions
from pathlib import Path
from src.database.mongodb.repository import mongo_client

from bson import json_util
import json

def get_chat_result_stream(text, history=[]):
    return functions.chatbot_with_fc_stream(text, history)
    

def get_chat_result(text, history=[]):
    result = chatbot_with_fc(text, history)
    return {"response": result}


def get_list_collection():
    qdrant_client = functions.load_collection()
    list_collection = []
    qc = qdrant_client.get_collections().collections
    for i in qc:
        list_collection.append(i.name)
    return list_collection


def get_current_collection():
    db = mongo_client["chatbot"]
    cur_collection = db["current_collection"]
    if cur_collection.count_documents({}) == 0:
        cur_collection.find_one_and_update(
            {"current_collection": "ThongTinKhoaHoc_Cohere"},
            {"$set": {"current_collection": "ThongTinKhoaHoc_Cohere"}},
            upsert=True,
        )

    cur_collection = db["current_collection"].find()[0]["current_collection"]
    return cur_collection


def create_new_collection(index_name: str):
    qdrant_client = functions.load_collection()
    list = get_list_collection()
    if index_name in list:
        return False
    result = qdrant_client.create_collection(
        collection_name=index_name,
        vectors_config={"size": 1024, "distance": "Cosine", "on_disk": False},
    )
    if result == True:
        return index_name
    else:
        return False


def delete_collection(index_name: str):
    qdrant_client = functions.load_collection()
    result = qdrant_client.delete_collection(collection_name=index_name)
    if result == True:
        return index_name
    else:
        return False


def change_current_collection(index_name: str):
    cur_index = get_current_collection()
    db = mongo_client["chatbot"]
    cur_collection = db["current_collection"]
    result = cur_collection.find_one_and_update(
        {"current_collection": cur_index},
        {"$set": {"current_collection": index_name}},
        upsert=True,
    )
    if result != None:
        return index_name
    else:
        return False






def get_list_suggestion(history = []):
    print(history[-2]["content"] +"  "+ history[-1]["content"])
    return functions.get_suggestions(history[-2]["content"], history[-1]["content"])


def get_summarize_chat(history= []):
    return functions.get_summarize_chat(history[-2]["content"])


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


def embedding(formatFile: str, filepath: str, index_name: str):
    UPLOAD_DIR = (
        Path().resolve()
        / f"upload//{embedding_func.get_name_format_file(filepath)['file_name']}"
    )
    print(UPLOAD_DIR)
    match formatFile:
        case ".csv":
            embedding_func.embedding_csv(UPLOAD_DIR, index_name)
            return "zero"
        case ".docx":
            embedding_func.embedding_docx(UPLOAD_DIR, index_name)
            return "one"
        case ".pdf":
            embedding_func.embedding_pdf(UPLOAD_DIR, index_name)
            return "two"
        case ".txt":
            embedding_func.embedding_txt(UPLOAD_DIR, index_name)
            return "three"
        case ".xlsx":
            embedding_func.embedding_excel(UPLOAD_DIR, index_name)


def get_format(filepath: str):
    return embedding_func.get_name_format_file(filepath)


def embedding_URL(url: str, index_name: str):
    embedding_func.embedding_content_fromURL(url, index_name)
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
    if chat_name == "":
        collection.find_one_and_update(
            {"email": email, "chat_id": chat_id},
            {"$set": {"history": history}},
            upsert=True,
        )
    else:
        collection.find_one_and_update(
            {"email": email, "chat_id": chat_id, "chat_name": chat_name},
            {"$set": {"history": history}},
            upsert=True,
        )
    return "saved"


def delete_chat_history(email: str, chat_id: str):
    db = mongo_client["chatbot"]
    collection = db["chat_history"]
    collection.delete_one({"email": email, "chat_id": chat_id})
    return True
