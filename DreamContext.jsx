import React, { createContext, useState, useEffect, useContext } from 'react';
import { mockDreams } from '../data/mockData';
import { 
  isNativePlatform, 
  scheduleNativeAlarm, 
  cancelNativeAlarm, 
  rescheduleAllAlarms 
} from '../utils/nativeAlarm';

const DreamContext = createContext();

export const useDreamContext = () => useContext(DreamContext);

export const DreamProvider = ({ children }) => {
  // --- Kullanıcı ve Onboarding ---
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('dreamAI_user');
    return saved ? JSON.parse(saved) : null;
  });

  // --- Rüyalar ---
  const [dreams, setDreams] = useState(() => {
    const saved = localStorage.getItem('dreamAI_dreams');
    return saved ? JSON.parse(saved) : mockDreams;
  });

  // --- Çoklu Alarmlar ---
  const [alarms, setAlarms] = useState(() => {
    const saved = localStorage.getItem('dreamAI_alarms');
    return saved ? JSON.parse(saved) : [];
  });

  // Veriler değiştikçe LocalStorage'a kaydet
  useEffect(() => {
    if (userProfile) localStorage.setItem('dreamAI_user', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('dreamAI_dreams', JSON.stringify(dreams));
  }, [dreams]);

  useEffect(() => {
    localStorage.setItem('dreamAI_alarms', JSON.stringify(alarms));
  }, [alarms]);

  // Native platformda uygulama başladığında alarmları yeniden zamanla
  useEffect(() => {
    if (isNativePlatform() && alarms.length > 0) {
      rescheduleAllAlarms(alarms);
    }
  }, []); // Sadece ilk mount'ta çalışır

  // Yeni rüya ekleme (İrem'in FastAPI Backend'ine Bağlı Canlı Sürüm)
  const addDream = async (dreamData) => {
    try {
      // 1. İrem'in FastAPI backend'ine rüyayı ve kullanıcının burç bilgisini fırlatıyoruz
      const response = await fetch("http://127.0.0.1:8000/api/analyze-dream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          text: dreamData.text, // Kullanıcının yazdığı rüya metni
          zodiac: userProfile?.zodiac || "Bilinmiyor" // Profildeki burç bilgisi
        })
      });

      if (!response.ok) {
        throw new Error("Backend analiz motorundan hata döndü.");
      }

      // 2. Senin Python kodundan (OpenAI + DALL-E) dönen verileri alıyoruz
      const apiResult = await response.json();

      // 3. Gelen zengin yapay zeka verilerini Ahmet Can'ın listesine ekliyoruz
      const newDream = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' }),
        text: dreamData.text,
        title: dreamData.title || "Yapay Zeka Analizi",
        sentiment: apiResult.sentiment,
        
        // 5 Farklı Akademik Perspektif Yorumları
        classicMeaning: apiResult.classic_meaning,
        freudMeaning: apiResult.freud_meaning,
        jungMeaning: apiResult.jung_meaning,
        islamicMeaning: apiResult.islamic_meaning,
        astrologicalMeaning: apiResult.astrological_meaning,
        
        // Yapay zekanın ürettiği DALL-E resim linki ve kelimeler
        imageUrl: apiResult.image_url,
        keywords: apiResult.keywords,
        isFavorite: false
      };

      setDreams(prev => [newDream, ...prev]);
      return newDream.id;

    } catch (error) {
      console.error("Rüya analizi sırasında köprü hatası oluştu:", error);
      alert("Yapay zeka analiz motoruna bağlanılamadı. Lütfen İrem'in backend projesinin açık olduğundan emin olun!");
      
      // Eğer backend açık değilse uygulama çökmesin diye eski taslak modu çalışsın:
      const fallbackDream = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' }),
        ...dreamData,
        isFavorite: false
      };
      setDreams(prev => [fallbackDream, ...prev]);
      return fallbackDream.id;
    }
  };

  const toggleFavorite = (id) => {
    setDreams(prev => prev.map(d => d.id === id ? { ...d, isFavorite: !d.isFavorite } : d));
  };
  
  const setImageForDream = (id, imageUrl) => {
    setDreams(prev => prev.map(d => d.id === id ? { ...d, imageUrl } : d));
  };

  const deleteDream = (id) => {
    setDreams(prev => prev.filter(d => d.id !== id));
  };

  // Alarm Fonksiyonları
  const addAlarm = (time, sound = 'gentle') => {
    const newAlarm = { id: Date.now().toString(), time, active: true, sound };
    const updatedAlarms = [...alarms, newAlarm];
    setAlarms(updatedAlarms);
    
    // Native platformda bildirimi zamanla
    if (isNativePlatform()) {
      scheduleNativeAlarm(newAlarm);
    }
  };

  const updateAlarmSound = (id, sound) => {
    setAlarms(prev => {
      const updated = prev.map(a => a.id === id ? { ...a, sound } : a);
      // Native platformda yeniden zamanla
      if (isNativePlatform()) {
        const alarm = updated.find(a => a.id === id);
        if (alarm && alarm.active) {
          scheduleNativeAlarm(alarm);
        }
      }
      return updated;
    });
  };

  const toggleAlarm = (id) => {
    setAlarms(prev => {
      const updated = prev.map(a => a.id === id ? { ...a, active: !a.active } : a);
      // Native platformda aktif/pasif yap
      if (isNativePlatform()) {
        const alarm = updated.find(a => a.id === id);
        if (alarm) {
          if (alarm.active) {
            scheduleNativeAlarm(alarm);
          } else {
            cancelNativeAlarm(alarm.id);
          }
        }
      }
      return updated;
    });
  };

  const removeAlarm = (id) => {
    // Native platformda bildirimi iptal et
    if (isNativePlatform()) {
      cancelNativeAlarm(id);
    }
    setAlarms(prev => prev.filter(a => a.id !== id));
  };

  return (
    <DreamContext.Provider value={{
      userProfile, setUserProfile,
      dreams, addDream, toggleFavorite, setImageForDream, deleteDream,
      alarms, addAlarm, toggleAlarm, removeAlarm, updateAlarmSound
    }}>
      {children}
    </DreamContext.Provider>
  );
};
