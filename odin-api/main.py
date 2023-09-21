from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import sar_image, lighthouses

app = FastAPI()

origins = ["http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(sar_image.router, prefix="/api", tags=["SAR Images"])
app.include_router(lighthouses.router, prefix="/api", tags=["Lighthouses"])
