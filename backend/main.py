from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
from typing import List

# Crear la app (ESTO ES CLAVE)
app = FastAPI(title="StressBot API")

# -----------------------------
# MODELO PARA TEXTO / ENCUESTA
# -----------------------------
class TextoEntrada(BaseModel):
    respuestas: List[int]  # Ej: [3, 4, 2, 5]

# -----------------------------
# ENDPOINT: ESTRÉS POR TEXTO
# -----------------------------
@app.post("/estres/texto")
def evaluar_estres_texto(data: TextoEntrada):
    promedio = sum(data.respuestas) / len(data.respuestas)

    if promedio <= 2:
        nivel = "Bajo"
        consejo = "Mantén hábitos saludables y descansos regulares."
    elif promedio <= 4:
        nivel = "Medio"
        consejo = "Intenta técnicas de respiración y pausas activas."
    else:
        nivel = "Alto"
        consejo = "Busca apoyo profesional y reduce la carga de actividades."

    return {
        "nivel_estres": nivel,
        "consejo": consejo
    }

# -----------------------------
# ENDPOINT: ESTRÉS POR FOTO
# -----------------------------
@app.post("/estres/foto")
async def evaluar_estres_foto(imagen: UploadFile = File(...)):
    # Aquí luego conectarás IA / visión artificial
    nivel = "Medio"
    consejo = "Realiza ejercicios de relajación y respira profundamente."

    return {
        "nivel_estres": nivel,
        "consejo": consejo
    }

# -----------------------------
# ENDPOINT DE PRUEBA
# -----------------------------
@app.get("/")
def root():
    return {"mensaje": "StressBot backend activo"}
