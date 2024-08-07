from typing import Optional
import uuid
from fastapi import APIRouter, UploadFile, Request, Form
from fastapi.responses import StreamingResponse
from . import repository
from pathlib import Path

router = APIRouter(
    prefix="/chat",
)
import os
from pydantic import BaseModel


UPLOAD_DIR = Path().resolve() / "upload"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)


class ChatInput(BaseModel):
    chat_id: str
    text: str
    history: Optional[list]

class UrlInput(BaseModel):
    Url: str
    index_name: str


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


@router.post("/{email}")
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


@router.delete("/{email}/{chat_id}")
async def chat(email: str, chat_id: str):
    repository.delete_chat_history(email, chat_id)

    return {"message": "Chat history deleted"}


@router.post("/chat-stream/{email}")
async def chat(email: str, data: ChatInput):
    history = repository.dict_2_messages(data.history)

    return StreamingResponse(
        repository.get_chat_result_stream(data.text, history),
        media_type="text/event-stream",
    )


@router.post("/handle-after-chat/{email}")
async def handle_after_chat(email: str, data: ChatInput):
    name_chat = ""
    if data.chat_id == "":
        data.chat_id = str(uuid.uuid4())
        name_chat = repository.get_summarize_chat(data.history)
    history = repository.dict_2_messages(data.history)
    list_suggestion = repository.get_list_suggestion(data.history)
    data_to_save = jsonable_encoder(history)
    name_chat_to_save = jsonable_encoder(name_chat)
    repository.save_chat_history(email, data_to_save, name_chat_to_save, data.chat_id)
    return {"chatID": data.chat_id, "tag": list_suggestion, "name_chat": name_chat}


@router.post("/upload-file/")
async def create_upload_file(file_upload: UploadFile, index_name : str = Form(...)):
    data = await file_upload.read()
    save_to = UPLOAD_DIR / file_upload.filename
    with open(os.path.join(save_to), "wb") as f:
        f.write(data)
    repository.embedding(
        repository.get_format(save_to)["split_name"][1], save_to, index_name
    )
    print(repository.get_format(save_to)["split_name"][1])
    return {"filenames": file_upload.filename}


@router.post("/upload-url/")
async def upload_url(data: UrlInput):
    repository.embedding_URL(data.Url, data.index_name)
    return {"url": data.Url}


@router.get("/{email}", response_model=list[dict])
async def chat(email: str):
    messages = repository.get_chat_history(email)
    return messages


@router.post("/")
async def chat(data: ChatInput):
    for i in data.history:
        print(i)
    messages = repository.dict_2_messages(data.history)
    result = repository.get_chat_result(data.text, messages)

    return result
