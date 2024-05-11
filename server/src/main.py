from fastapi import FastAPI

from src.utils.dto import StatusResponseDTO

from src.service.controller import router

app = FastAPI(on_startup=[])

app.include_router(router)


@app.get("/")
def health_check() -> StatusResponseDTO:
    return StatusResponseDTO()
