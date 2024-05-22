from fastapi import APIRouter
from . import repository

router = APIRouter()

from pydantic import BaseModel


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


#