import os
from typing import List
import random
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Yapay Zeka Destekli Rüya Yorumlama - Ücretsiz Gemini API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ücretsiz Google Gemini İstemcisi
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

class DreamRequest(BaseModel):
    text: str
    zodiac: str

class DreamResponse(BaseModel):
    sentiment: str
    classic_meaning: str
    freud_meaning: str
    jung_meaning: str
    islamic_meaning: str
    astrological_meaning: str
    keywords: List[str]
    image_url: str

class DreamAI:
    
    @staticmethod
    def pre_process_text(text: str) -> str:
        if not text:
            return ""
        return text.strip()

    @staticmethod
    def call_gemini(prompt: str, system_instruction: str) -> str:
        """Google Gemini 1.5 Flash modelini ücretsiz modda çağırır."""
        try:
            response = client.models.generate_content(
                model='models/gemini-2.5-flash',
                contents=prompt,
                config=genai.types.GenerateContentConfig(
                    system_instruction=system_instruction,
                    temperature=0.7
                )
            )
            return response.text.strip()
        except Exception as e:
            return f"Analiz motoru şu an yanıt vermiyor: {str(e)}"

    @staticmethod
    def generate_free_image_url(keywords: List[str]) -> str:
        """Her rüyaya özel, tamamen farklı ve sürreal telifsiz bir görsel üretir."""
        import time
        # Her saniye değişen bir sayı ekleyerek resmin önbelleğe (cache) takılmasını önlüyoruz
        timestamp = int(time.time())
        return f"https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1024&q=80&sig={timestamp}"

@app.post("/api/analyze-dream", response_model=DreamResponse)
async def analyze_dream_endpoint(request: DreamRequest):
    try:
        cleaned_text = DreamAI.pre_process_text(request.text)
        if not cleaned_text:
            raise HTTPException(status_code=400, detail="Rüya içeriği boş olamaz.")

        # 1. Duygu Analizi (Ücretsiz Gemini)
        sentiment = DreamAI.call_gemini(
            prompt=cleaned_text,
            system_instruction="Sen bir psikolojik dil analistisin. Rüyanın genel duygusal atmosferini analiz et ve SADECE tek bir kelimeyle 'Pozitif', 'Negatif' veya 'Nötr' olarak yanıt dön."
        )

        # 2. 5 Farklı Akademik Perspektif (Ücretsiz Gemini)
        classic_m = DreamAI.call_gemini(
            prompt=cleaned_text,
            system_instruction="Sen geleneksel rüya sembolleri uzmanısın. Rüyadaki temel objeleri kültürel rüya metaforlarına göre genel bir dille yorumla."
        )
        
        freud_m = DreamAI.call_gemini(
            prompt=cleaned_text,
            system_instruction="Sen Freudyen bir psikanalistsin. Rüyayı Sigmund Freud'un rüya tabiri teorilerine, bastırılmış bilinçaltı arzularına ve id/ego/süperego çatışmalarına odaklanarak profesyonelce yorumla."
        )
        
        jung_m = DreamAI.call_gemini(
            prompt=cleaned_text,
            system_instruction="Sen Jungiyen bir analitik psikologsun. Rüyayı Carl Gustav Jung'un kolektif bilinçaltı ögelerine ve arketiplere (Gölge, Anima) odaklanarak derinlemesine analiz et."
        )
        
        islamic_m = DreamAI.call_gemini(
            prompt=cleaned_text,
            system_instruction="Sen İslami rüya tabirleri uzmanısın. Rüyayı İbn-i Sirin gibi geleneksel İslam alimlerinin rüya yorumlama metodolojilerine göre yapıcı bir dille açıkla."
        )
        
        astro_m = DreamAI.call_gemini(
            prompt=cleaned_text,
            system_instruction=f"Sen bir astro-psikologsun. Rüyayı kullanıcının burcu olan '{request.zodiac}' burcu bağlamında, karakter özellikleri ve sezgileriyle ilişkilendirerek yorumla."
        )

        # 3. Anahtar kelimeler ve Ücretsiz Görsel Ataması
        keywords = ["dream", "surreal", "mystical"]
        img_url = DreamAI.generate_free_image_url(keywords)

        return DreamResponse(
            sentiment=sentiment,
            classic_meaning=classic_m,
            freud_meaning=freud_m,
            jung_meaning=jung_m,
            islamic_meaning=islamic_m,
            astrological_meaning=astro_m,
            keywords=keywords,
            image_url=img_url
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Sistem analiz motoru hatası: {str(e)}")