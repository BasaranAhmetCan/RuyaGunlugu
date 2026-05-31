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
    def generate_free_image_url(keywords: List[str], dream_text: str = "") -> str:
        """Rüyanın içeriğine göre Gemini ile İngilizce görsel promptu hazırlar ve Pollinations AI üzerinden gerçek bir yapay zeka görseli üretir."""
        import hashlib
        import urllib.parse
        import random

        # 1. Gemini'den etkileyici bir İngilizce görsel promptu isteyelim
        system_instruction = (
            "You are a professional prompt engineer for AI image generators (like Midjourney or DALL-E 3). "
            "Translate the user's dream description into a highly detailed, cinematic, and surreal English prompt. "
            "Focus on dreamlike fantasy, magical realism, glowing lights, vivid colors, and high-quality artistic styles. "
            "Keep the prompt under 35 words. Do NOT include any introduction, explanations, or quotes. Output ONLY the raw prompt."
        )
        
        use_fallback = False
        try:
            english_prompt = DreamAI.call_gemini(
                prompt=f"Dream description: {dream_text}",
                system_instruction=system_instruction
            )
            # Temizleme
            english_prompt = english_prompt.strip().replace('"', '').replace("'", "")
            if not english_prompt or "analiz motoru" in english_prompt.lower():
                use_fallback = True
        except Exception:
            use_fallback = True

        if use_fallback:
            # Fallback (Gemini hata verirse veya anahtar yoksa)
            # Türkçe → İngilizce anahtar kelime haritası
            tr_to_en = {
                "kabus": "nightmare dark horror", "huzurlu": "peaceful serene calm",
                "uçmak": "flying sky clouds", "uçuş": "flying sky clouds",
                "su": "water ocean river", "deniz": "ocean sea waves",
                "dağ": "mountain landscape nature", "orman": "forest woods trees",
                "ev": "house home interior", "şehir": "city urban night",
                "karanlık": "dark shadow mystery", "ışık": "light glowing ethereal",
                "ölüm": "surreal abstract dark", "hayalet": "ghost surreal fog",
                "çocuk": "childhood memory nostalgic", "aile": "family warm light",
                "yılan": "serpent snake nature", "hayvan": "animal wildlife nature",
                "ateş": "fire flame warm", "buz": "ice frozen winter",
                "uzay": "space galaxy stars cosmos", "yıldız": "stars night galaxy",
                "koşmak": "running motion blur", "kaçmak": "escape running motion",
                "araba": "car road journey", "tren": "train railway journey",
                "müzik": "music concert sound waves", "dans": "dance motion artistic",
                "aşk": "love romantic sunset", "korku": "fear dark surreal",
                "bilinçli": "lucid dream surreal abstract", "lucid": "lucid dream surreal",
                "tekrarlayan": "loop cycle spiral abstract", "nostaljik": "nostalgic vintage memory",
                "gerçeküstü": "surreal dream abstract art", "gizemli": "mysterious fog ethereal",
            }
            search_terms = []
            combined = (dream_text + " " + " ".join(keywords)).lower()
            for tr_word, en_phrase in tr_to_en.items():
                if tr_word in combined:
                    search_terms.extend(en_phrase.split())
            if not search_terms:
                defaults = [
                    "surreal dream", "mystical ethereal", "cosmic abstract",
                    "dreamlike fantasy", "nebula galaxy", "misty forest"
                ]
                text_hash = int(hashlib.md5(dream_text.encode()).hexdigest(), 16)
                search_terms = defaults[text_hash % len(defaults)].split()
            
            unique_terms = list(dict.fromkeys(search_terms))[:3]
            english_prompt = " ".join(unique_terms)

        # 2. Pollinations AI için URL oluştur
        enhanced_prompt = f"{english_prompt}, beautiful digital art, dreamlike, surrealism, highly detailed, cinematic lighting, masterpiece"
        
        # Deterministik ama her rüyaya özgü bir seed üret
        seed = int(hashlib.md5(dream_text.encode()).hexdigest(), 16) % 100000
        encoded_prompt = urllib.parse.quote(enhanced_prompt)
        
        return f"/pollinations/prompt/{encoded_prompt}?width=1024&height=768&nologo=true&seed={seed}"

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
        keywords = [word.strip() for word in cleaned_text.split() if len(word.strip()) > 3][:5]
        if not keywords:
            keywords = ["dream", "surreal", "mystical"]
        img_url = DreamAI.generate_free_image_url(keywords, dream_text=cleaned_text)

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

class ImageRequest(BaseModel):
    dream_text: str

class ImageResponse(BaseModel):
    image_url: str

@app.post("/api/generate-image", response_model=ImageResponse)
async def generate_image_endpoint(request: ImageRequest):
    """Rüya metnine göre arka planda görseli indirip base64 formatında döndürür."""
    import urllib.request
    import base64
    try:
        cleaned_text = DreamAI.pre_process_text(request.dream_text)
        keywords = [word.strip() for word in cleaned_text.split() if len(word.strip()) > 3][:5]
        if not keywords:
            keywords = ["dream", "surreal", "mystical"]
        
        img_url = DreamAI.generate_free_image_url(keywords, dream_text=cleaned_text)
        
        # Tarayıcıyı tamamen atlamak için arka planda resmi indir
        req = urllib.request.Request(
            img_url, 
            headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
        )
        with urllib.request.urlopen(req) as response:
            image_data = response.read()
            
        base64_encoded = base64.b64encode(image_data).decode('utf-8')
        data_uri = f"data:image/jpeg;base64,{base64_encoded}"
        
        return ImageResponse(image_url=data_uri)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Görsel üretim hatası: {str(e)}")