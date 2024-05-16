from fastapi import APIRouter
from . import repository

router = APIRouter()

from pydantic import BaseModel


class ChatInput(BaseModel):
    text: str
    # history: list[dict] = []


<<<<<<< Updated upstream
@router.post("/chat")
async def chat(data: ChatInput):
    result = repository.get_chat_result(data.text)
=======
# @router.post("/chat")
# async def chat(data: ChatInput):
#     result = repository.get_chat_result(data.text, data.history)
#     return result
    

@router.get("/chat")
async def chat(query: str):
    result = repository.get_chat_result(query)
>>>>>>> Stashed changes
    return result


#