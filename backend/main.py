import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import imagePrediction
from routes import chatbot
from services.chatbot_service import initialize_chatbot
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # 1. Al iniciar: Cargar modelo y procesar libros
    try:
        initialize_chatbot()
    except Exception as e:
        print(f"Error iniciando chatbot: {e}")
    
    yield
    
    # 2. Al apagar (limpieza opcional)
    print("Apagando servidor...")

app = FastAPI(title="StressGuard DeepLearning API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],        # En producción pon tu dominio
    allow_credentials=True,
    allow_methods=["*"],        # Permite OPTIONS, POST, etc.
    allow_headers=["*"],
)

print("====================================\n")
print("Iniciando servidor de FastAPI...")
print("\n====================================")

app.include_router(imagePrediction.router)
app.include_router(chatbot.router)

    