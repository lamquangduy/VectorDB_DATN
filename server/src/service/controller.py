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


from fastapi.encoders import jsonable_encoder


@router.post("/chat/{email}")
async def chat(email: str, data: ChatInput):
    if data.chat_id is None:
        data.chat_id = str(uuid.uuid4())
    messages = repository.get_chat_history(email, data.chat_id)
    history = repository.dict_2_messages(messages)

    result = repository.get_chat_result(data.text, history)
    data_to_save = jsonable_encoder(result["response"]["history"])
    repository.save_chat_history(email, data_to_save, data.chat_id)

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
async def create_upload_file(file_upload: UploadFile):
    data = await file_upload.read()
    save_to = UPLOAD_DIR / file_upload.filename
    with open(os.path.join(save_to), "wb") as f:
        f.write(data)
    repository.embedding(repository.get_format(save_to)["split_name"][1], save_to)
    print(repository.get_format(save_to)["split_name"][1])
    return {"filenames": file_upload.filename}


@router.post("/upload-url")
async def upload_url(request: Request):
    data = await request.json()
    url = data.get("url")
    repository.embedding_URL(url)
    return {"url": url}
