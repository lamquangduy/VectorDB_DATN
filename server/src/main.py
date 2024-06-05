from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.utils.dto import StatusResponseDTO
from src.service.controller import router
# from utils.dto import StatusResponseDTO
# from service.controller import router
import os
app = FastAPI(on_startup=[])

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


app.include_router(router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def health_check() -> StatusResponseDTO:
    return StatusResponseDTO()





# uvicorn main:app --reload
# npm run dev
# cd VectorDB_DATN\server\src
# cd VectorDB_DATN\frontend
