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
    text: str
    history: list[dict] = []


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
