import os
from typing import List
import random
import hashlib
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
    def extract_keywords_from_dream(dream_text: str) -> List[str]:
        """Gemini ile rüya metninden Unsplash araması için görsel anahtar kelimeler çıkarır."""
        try:
            response = client.models.generate_content(
                model='models/gemini-2.5-flash',
                contents=dream_text,
                config=genai.types.GenerateContentConfig(
                    system_instruction="""Sen bir görsel arama uzmanısın.
                    Verilen Türkçe rüya metnindeki somut nesneleri, mekanları ve atmosferi belirle.
                    Bu rüyayı en iyi temsil eden Unsplash fotoğraf araması için 2-3 adet İNGİLİZCE kelime/ifade üret.
                    
                    KURALLAR:
                    - Rüyadaki SOMUT nesnelere odaklan (ev, su, orman, insan, hayvan gibi)
                    - Her ifade en fazla 2 kelime olsun
                    - Fotoğrafçılıkta kullanılan, aranabilir kelimeler seç
                    - SADECE kelimeleri virgülle ayır, başka hiçbir şey yazma
                    
                    ÖRNEK GİRDİ: "şekerlerle kaplı bir evin içindeydim"
                    ÖRNEK ÇIKTI: candy house, colorful sweets, fairytale
                    
                    ÖRNEK GİRDİ: "denizde yüzüyordum ve balıklar etrafımı sardı"
                    ÖRNEK ÇIKTI: underwater swimming, tropical fish, ocean""",
                    temperature=0.3
                )
            )
            raw = response.text.strip()
            keywords = [k.strip() for k in raw.split(',') if k.strip()]
            return keywords[:3] if keywords else ["surreal dream", "mystical night", "abstract vision"]
        except Exception:
            return ["surreal dream", "mystical night", "abstract vision"]

    @staticmethod
    def generate_dream_image_url(dream_text: str, keywords: List[str]) -> str:
        """Rüyanın anahtar kelimelerine göre Unsplash'tan gerçekten ilgili görsel URL'i üretir."""
        # Anahtar kelimeleri Unsplash search formatına dönüştür
        # Örnek: ["candy house", "sweet colors", "magical"] → "candy+house,sweet+colors,magical"
        search_query = ",".join(k.replace(" ", "+") for k in keywords if k.strip())
        
        if not search_query:
            search_query = "dream,mystical,surreal"
        
        # Rüya metninden tutarlı bir seed üret — aynı rüya her seferinde aynı görseli gösterir
        text_hash = int(hashlib.md5(dream_text.encode('utf-8')).hexdigest(), 16) % 999999
        
        # Unsplash source URL: anahtar kelimelere göre semantik arama yapar
        return f"https://source.unsplash.com/1024x576/?{search_query}&sig={text_hash}"

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

        # 3. Anahtar kelimeler ve Rüyaya Özgü Görsel Ataması
        keywords = DreamAI.extract_keywords_from_dream(cleaned_text)
        img_url = DreamAI.generate_dream_image_url(cleaned_text, keywords)

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