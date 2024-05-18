from fastapi import APIRouter
from . import repository

router = APIRouter()

from pydantic import BaseModel


class ChatInput(BaseModel):
    text: str
    # history: list[dict] = []


@router.post("/chat")
async def chat(data: ChatInput):
    result = repository.get_chat_result(data.text)

    return result


#