#  python -m uvicorn main:app --reload
import os
from fastapi import FastAPI
from pydantic import BaseModel
from openai import OpenAI
import json

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))  # <-- ici

app = FastAPI()

class PromptPayload(BaseModel):
    promptSystem: str
    promptUser: str | dict

@app.post("/chat")
def chat(payload: PromptPayload):
    user_content = json.dumps(payload.promptUser, ensure_ascii=False) if isinstance(payload.promptUser, dict) else payload.promptUser

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": payload.promptSystem},
            {"role": "user", "content": user_content},
        ]
    )

    text = response.choices[0].message.content
    return {"text": text}
