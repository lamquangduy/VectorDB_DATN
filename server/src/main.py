from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Request
import os
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from fastapi.responses import HTMLResponse
from functions import chatbot_with_fc
from haystack.dataclasses import ChatMessage

# from src.utils.dto import StatusResponseDTO

from src.utils.dto import StatusResponseDTO
from fastapi.middleware.cors import CORSMiddleware

from utils.dto import StatusResponseDTO

from service.controller import router

app = FastAPI(on_startup=[])
origins = [
    "http://localhost",
    "http://localhost:1416",
    "http://localhost:3000",
    "http://localhost:8000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
html = """
<!DOCTYPE html>
<html>
    <head>
        <title>Chat</title>
    </head>
    <body>
        <h1>WebSocket Chat</h1>
        <form action="" onsubmit="sendMessage(event)">
            <input type="text" id="messageText" autocomplete="off"/>
            <button>Send</button>
        </form>
        <ul id='messages'>
        </ul>
        <script>
            var ws = new WebSocket("ws://localhost:8000/ws");
            ws.onmessage = function(event) {
                var messages = document.getElementById('messages')
                var message = document.createElement('li')
                var content = document.createTextNode(event.data)
                message.appendChild(content)
                messages.appendChild(message)
            };
            function sendMessage(event) {
                var input = document.getElementById("messageText")
                ws.send(input.value)
                input.value = ''
                event.preventDefault()
            }
        </script>
    </body>
</html>
"""


class ConnectionManager:

    def __init__(self) -> None:
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)


manager = ConnectionManager()

app.include_router(router)

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://learnway.kurokid.info",
    "https://api-learnway.kurokid.info",
    "https://learnway.me",
    "http://learnway.me",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def health_check() -> StatusResponseDTO:
    # return StatusResponseDTO()
    return HTMLResponse(html)


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    messages = [
        ChatMessage.from_system(
            "Don't make assumptions about what values to plug into functions. Ask for clarification if a user request is ambiguous."
        )
    ]
    while True:
        data = await websocket.receive_text()
        result = chatbot_with_fc(message=data, messages=messages)
        await websocket.send_text(f"Message text was: {result}")


# uvicorn main:app --reload
# npm run dev
# cd BACKEND\DOANTOTNGHIEP\VectorDB_DATN\server\src
# cd VectorDB_DATN\frontend
