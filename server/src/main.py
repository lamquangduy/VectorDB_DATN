from fastapi import FastAPI

from src.utils.dto import StatusResponseDTO
from fastapi.middleware.cors import CORSMiddleware

from src.service.controller import router

app = FastAPI(on_startup=[])

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
def health_check() -> StatusResponseDTO:
    return StatusResponseDTO()
