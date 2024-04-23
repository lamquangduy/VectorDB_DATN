from pydantic import BaseModel


class StatusResponseDTO(BaseModel):
    status: str = "success"
    message: str = "OK"
