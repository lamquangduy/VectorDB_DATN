from fastapi import APIRouter, UploadFile
from . import repository
from pathlib import Path
router = APIRouter()
import os
from pydantic import BaseModel

UPLOAD_DIR = Path().resolve() / 'upload'
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


@router.post("/uploadfile/")
async def create_upload_file(file_upload: UploadFile):
    data = await file_upload.read()
    save_to = UPLOAD_DIR / file_upload.filename
    with open(os.path.join(save_to), 'wb') as f:
        f.write(data)
    return {"filenames": file_upload.filename}

#