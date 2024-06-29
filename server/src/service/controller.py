from typing import Optional
import uuid
from fastapi import APIRouter, UploadFile, Request
from . import repository
from pathlib import Path

router = APIRouter()
import os
from pydantic import BaseModel


UPLOAD_DIR = Path().resolve() / "upload"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)


class ChatInput(BaseModel):
    chat_id: str
    text: str
    history: Optional[list]


@router.get("/chat/{email}", response_model=list[dict])
async def chat(email: str):
    messages = repository.get_chat_history(email)
    return messages


@router.get("/collection/list")
async def list_collection():
    list_collection = repository.get_list_collection()
    return list_collection


@router.get("/collection/current")
async def current_collection():
    cur_collection = repository.get_current_collection()
    return cur_collection


@router.post("/collection/change_current")
async def current_collection(index_name: str):
    cur_collection = repository.change_current_collection(index_name)
    return cur_collection


@router.post("/collection/create-new")
async def create_new_collection(index_name: str):
    return repository.create_new_collection(index_name)


@router.delete("/collection/delete")
async def list_collection(index_name: str):
    return repository.delete_collection(index_name)


@router.get("/chat-role/{email}", response_model=list[dict])
async def chat(email: str):
    role = repository.get_role(email)
    return role


from fastapi.encoders import jsonable_encoder


@router.post("/chat/{email}")
async def chat(email: str, data: ChatInput):
    if data.chat_id == "":
        data.chat_id = str(uuid.uuid4())

    messages = repository.get_chat_history(email, data.chat_id)
    history = repository.dict_2_messages(data.history)
    result = repository.get_chat_result(data.text, history)
    data_to_save = jsonable_encoder(result["response"]["history"])
    name_chat_to_save = jsonable_encoder(result["response"]["name_chat"])
    repository.save_chat_history(email, data_to_save, name_chat_to_save, data.chat_id)
    result["chatID"] = data.chat_id
    return result


@router.delete("/chat/{email}/{chat_id}")
async def chat(email: str, chat_id: str):
    repository.delete_chat_history(email, chat_id)

    return {"message": "Chat history deleted"}


@router.post("/chat")
async def chat(data: ChatInput):
    for i in data.history:
        print(i)
    messages = repository.dict_2_messages(data.history)
    result = repository.get_chat_result(data.text, messages)

    return result


@router.post("/upload-file")
async def create_upload_file(file_upload: UploadFile, index_name: str):
    data = await file_upload.read()
    save_to = UPLOAD_DIR / file_upload.filename
    with open(os.path.join(save_to), "wb") as f:
        f.write(data)
    repository.embedding(
        repository.get_format(save_to)["split_name"][1], save_to, index_name
    )
    print(repository.get_format(save_to)["split_name"][1])
    return {"filenames": file_upload.filename}


@router.post("/upload-url")
async def upload_url(request: Request, index_name: str):
    data = await request.json()
    url = data.get("url")
    repository.embedding_URL(url, index_name)
    return {"url": url}
