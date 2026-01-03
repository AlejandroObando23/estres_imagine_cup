import base64
import requests

# Lee imagen
with open("imagenes_prueba/prueba_foto_enojo.jpg", "rb") as f:
    img_base64 = base64.b64encode(f.read()).decode("utf-8")

payload = {
    "image": img_base64
}

response = requests.post(
    "http://localhost:8000/predict/image",
    json=payload
)

print(response.json())
