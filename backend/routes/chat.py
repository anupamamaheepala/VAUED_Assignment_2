import os
import json
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from openai import OpenAI

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
    role: str
    content: str


class ChatRequest(BaseModel):
    message: str
    history: list[Message] = []


@router.post("")
async def chat(req: ChatRequest):
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="OPENAI_API_KEY not set in .env")

    try:
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
{json.dumps(sample)}
""".strip()

        prompt = f"Data Context:\n{context_block}\n\nUser Question: {req.message}"

        # Build messages list for OpenAI
        messages = [{"role": "system", "content": SYSTEM_INSTRUCTION}]

        # Add conversation history
        for m in req.history:
            messages.append({"role": m.role, "content": m.content})

        # Add current message with data context
        messages.append({"role": "user", "content": prompt})

        client = OpenAI(api_key=api_key)
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages,
            max_tokens=1024,
            temperature=0.3,
        )

        reply = response.choices[0].message.content
        return {"reply": reply}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))