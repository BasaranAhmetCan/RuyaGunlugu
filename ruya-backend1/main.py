import os
from typing import List
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import AsyncOpenAI
from dotenv import load_dotenv

# .env dosyasındaki OpenAI API anahtarını yükler
load_dotenv()

app = FastAPI(title="Yapay Zeka Destekli Rüya Yorumlama ve Görselleştirme Sistemi - Backend API")

# Frontend (Ahmet Can) bağlantı güvenliği için CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# OpenAI Asenkron İstemcisi
openai_client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# --- B.2. Sistem Gereksinimleri ve Pydantic Şemaları ---
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

# --- C.4.2.4. UML Tasarımındaki DreamAI Analiz Sınıfı ---
class DreamAI:
    
    @staticmethod
    def pre_process_text(text: str) -> str:
        """Girdi metnini temizler."""
        if not text:
            return ""
        return text.strip()

    @staticmethod
    async def analyze_sentiment(text: str) -> str:
        """Doğal Dil İşleme ile rüyanın duygu durumunu analiz eder."""
        response = await openai_client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system", 
                    "content": "Sen bir psikolojik dil analistisin. Sana anlatılan rüyanın genel duygusal atmosferini analiz et ve SADECE tek bir kelimeyle 'Pozitif', 'Negatif' veya 'Nötr' olarak yanıt dön."
                },
                {"role": "user", "content": text}
            ],
            max_tokens=10,
            temperature=0.3
        )
        return response.choices[0].message.content.strip()

    # --- Akademik Prompt Mühendisliği Şablonları ---
    @staticmethod
    async def generate_classic_meaning(text: str) -> str:
        """Geleneksel ve popüler rüya sembolizmiyle analiz üretir."""
        response = await openai_client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "Sen geleneksel rüya sembolleri uzmanısın. Rüyadaki temel objeleri ve olayları kültürel rüya metaforlarına göre anlaşılır ve genel bir dille yorumla."},
                {"role": "user", "content": text}
            ]
        )
        return response.choices[0].message.content.strip()

    @staticmethod
    async def generate_freud_meaning(text: str) -> str:
        """Sigmund Freud'un Psikanalitik ekolüne göre analiz üretir."""
        response = await openai_client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system", 
                    "content": "Sen Freudyen bir psikanalistsin. Rüyayı Sigmund Freud'un rüya tabiri teorilerine göre analiz et. Bastırılmış bilinçaltı arzularına, id/ego/süperego çatışmalarına, rüyanın gizil içeriğine ve çocukluk dönemi yansımalarına odaklanarak profesyonel bir yorum yaz."
                },
                {"role": "user", "content": text}
            ]
        )
        return response.choices[0].message.content.strip()

    @staticmethod
    async def generate_jung_meaning(text: str) -> str:
        """Carl Jung'un Analitik Psikoloji ekolüne göre analiz üretir."""
        response = await openai_client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system", 
                    "content": "Sen Jungiyen bir analitik psikologsun. Rüyayı Carl Gustav Jung'un teorilerine göre yorumla. Kolektif bilinçaltı ögelerine, rüyadaki arketiplere (Anima, Animus, Gölge, Persona), sembollerin bireyselleşme sürecindeki rolüne odaklanarak derinlemesine bir analiz sun."
                },
                {"role": "user", "content": text}
            ]
        )
        return response.choices[0].message.content.strip()

    @staticmethod
    async def generate_islamic_meaning(text: str) -> str:
        """Geleneksel İslami rüya tabiri kaynaklarına göre analiz üretir."""
        response = await openai_client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system", 
                    "content": "Sen İslami rüya tabirleri ve maneviyat uzmanısın. Rüyayı İbn-i Sirin ve Nablusi gibi geleneksel İslam alimlerinin rüya yorumlama metodolojilerine göre analiz et. Rüyadaki sembollerin manevi derecelere, ferahlığa veya uyarılara olan işaretlerini yapıcı ve dini terminolojiye uygun bir dille açıkla."
                },
                {"role": "user", "content": text}
            ]
        )
        return response.choices[0].message.content.strip()

    @staticmethod
    async def generate_astrological_meaning(text: str, zodiac: str) -> str:
        """Kullanıcının burcuna özel astrolojik bağlam analizi üretir."""
        response = await openai_client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system", 
                    "content": f"Sen bir astro-psikologsun. Rüyayı kullanıcının burcu olan '{zodiac}' burcu bağlamında analiz et. Rüyadaki elementlerin (Su, Ateş, Toprak, Hava), gezegen etkilerinin ve sembollerin bu burcun karakteristik özellikleri ve sezgileriyle olan ilişkisini kurarak yorumla."
                },
                {"role": "user", "content": text}
            ]
        )
        return response.choices[0].message.content.strip()

    @staticmethod
    async def extract_keywords(text: str) -> List[str]:
        """Rüyadan DALL-E için en atmosferik anahtar kelimeleri ayıklar."""
        response = await openai_client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system", 
                    "content": "Sana verilen rüya metninden, görsel kalitesi yüksek, rüyanın özünü yansıtan en önemli 3-4 anahtar kelimeyi veya nesneyi ayıkla. Aralarında sadece virgül olacak şekilde tek bir satırda döndür. Başka hiçbir açıklama yazma."
                },
                {"role": "user", "content": text}
            ],
            max_tokens=30
        )
        raw_output = response.choices[0].message.content
        return [k.strip() for k in raw_output.split(",") if k.strip()]

    @staticmethod
    async def generate_dream_image(keywords: List[str]) -> str:
        """DALL-E 3 motoru ile rüya atmosferini yansıtan özgün görsel üretir."""
        prompt_string = f"A surreal, atmospheric, dream-like digital art painting featuring: {', '.join(keywords)}. High psychological depth, cinematic lighting, vivid colors, mystical and abstract background elements."
        
        response = await openai_client.images.generate(
            model="dall-e-3",
            prompt=prompt_string,
            n=1,
            size="1024x1024"
        )
        return response.data[0].url

# --- API Uç Noktası (Endpoint) ---
@app.post("/api/analyze-dream", response_model=DreamResponse)
async def analyze_dream_endpoint(request: DreamRequest):
    try:
        cleaned_text = DreamAI.pre_process_text(request.text)
        if not cleaned_text:
            raise HTTPException(status_code=400, detail="Rüya içeriği boş olamaz.")

        import asyncio
        
        # Eşzamanlı dil ve anahtar kelime çıkarma
        sentiment, keywords = await asyncio.gather(
            DreamAI.analyze_sentiment(cleaned_text),
            DreamAI.extract_keywords(cleaned_text)
        )

        # 5 Farklı Perspektif ve Görsel Üretim Görevleri
        classic_task = DreamAI.generate_classic_meaning(cleaned_text)
        freud_task = DreamAI.generate_freud_meaning(cleaned_text)
        jung_task = DreamAI.generate_jung_meaning(cleaned_text)
        islamic_task = DreamAI.generate_islamic_meaning(cleaned_text)
        astrological_task = DreamAI.generate_astrological_meaning(cleaned_text, request.zodiac)
        image_task = DreamAI.generate_dream_image(keywords)

        classic_m, freud_m, jung_m, islamic_m, astro_m, img_url = await asyncio.gather(
            classic_task, freud_task, jung_task, islamic_task, astrological_task, image_task
        )

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