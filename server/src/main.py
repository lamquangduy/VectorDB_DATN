from fastapi import FastAPI

from src.utils.dto import StatusResponseDTO


app = FastAPI(on_startup=[])


@app.get("/")
def health_check() -> StatusResponseDTO:
    return StatusResponseDTO()
