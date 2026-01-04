from fastapi import APIRouter, HTTPException
from models.chatbot import ChatRequest, ChatResponse
from services.chatbot_service import chat_with_bot

router = APIRouter(prefix="/api/chat", tags=["AI Chatbot"])

@router.post("/message", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    try:
        # Llamamos al servicio pasando el mensaje y el ID de sesión (usuario)
        ai_response = chat_with_bot(request.message, request.session_id)
        
        return ChatResponse(response=ai_response)
    
    except Exception as e:
        print(f"Error en chat: {e}")
        raise HTTPException(status_code=500, detail=str(e))