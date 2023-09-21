from fastapi import APIRouter
from fastapi.responses import FileResponse
from pathlib import Path

router = APIRouter()

@router.get("/sar_image")
async def serve_image():
    response = FileResponse(Path("SAR_image_20420212.png"))
    response.headers["Access-Control-Allow-Origin"] = "http://localhost:3000"
    return response