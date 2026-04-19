# chat.py

import os
import json
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import google.generativeai as genai

from utils.data_loader import build_summary, get_filtered_context

router = APIRouter()

SYSTEM_INSTRUCTION = """You are an expert AI agronomist assistant for NurseryPulse Smart Observatory, \
a precision agriculture monitoring platform in Bangladesh. Your role is to help farm managers, \
agronomists, and operators understand their crop sensor data and make informed decisions.

You have access to a dataset of 10,000 IoT sensor readings from 6 regions \
(Mymensingh, Rajshahi, Chattogram, Dhaka, Khulna, Sylhet) monitoring 5 crop types \
(Rice, Wheat, Tomato, Jute, Potato) throughout 2024.

Guidelines:
- Be concise, professional, and data-driven
- Always reference specific numbers from the data context provided
- Provide actionable recommendations where relevant
- Format numbers to 2 decimal places
- Keep responses under 250 words unless a detailed breakdown is explicitly requested
- If a question is outside the dataset scope, clearly say so"""


class Message(BaseModel):
    role: str      # "user" or "assistant"
    content: str


class ChatRequest(BaseModel):
    message: str
    history: list[Message] = []


@router.post("")
async def chat(req: ChatRequest):
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY not set in .env")

    genai.configure(api_key=api_key)

    try:
        # Build data context for this query
        summary = build_summary()
        ctx     = get_filtered_context(req.message)
        stats   = ctx["stats"]
        sample  = ctx["sample"]

        context_block = f"""
=== DATASET SUMMARY ===
{summary}

=== QUERY-RELEVANT STATS ===
Filtered records matching query: {stats['total']}
- Avg Temperature:    {stats['avg_temp']}°C
- Avg Humidity:       {stats['avg_humidity']}%
- Avg Soil Moisture:  {stats['avg_soil_moisture']}%
- Avg Yield Estimate: {stats['avg_yield']}
- Avg Soil pH:        {stats['avg_ph']}
- Health Breakdown:   {stats['health_breakdown']}

=== SAMPLE RECORDS (up to 50 rows) ===
{json.dumps(sample, indent=None)}
""".strip()

        # Convert history to Gemini format
        gemini_history = [
            {
                "role": "model" if m.role == "assistant" else "user",
                "parts": [m.content],
            }
            for m in req.history
        ]

        model = genai.GenerativeModel(
            model_name="gemini-2.0-flash",
            system_instruction=SYSTEM_INSTRUCTION,
        )

        chat_session = model.start_chat(history=gemini_history)
        prompt = f"Data Context:\n{context_block}\n\nUser Question: {req.message}"
        response = chat_session.send_message(prompt)

        return {"reply": response.text}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
