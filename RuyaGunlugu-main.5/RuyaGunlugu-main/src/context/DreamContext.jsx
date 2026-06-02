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
  // --- Kullanıcı Profili ---
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('dreamAI_user');
    return saved ? JSON.parse(saved) : { zodiac: "Bilinmiyor" };
  });

  // --- Rüyalar Listesi ---
  const [dreams, setDreams] = useState(() => {
    const saved = localStorage.getItem('dreamAI_dreams');
    // Eğer hafıza boşsa hata vermemesi için boş dizi ile başlatıyoruz
    return saved ? JSON.parse(saved) : [];
  });

  // --- Alarmlar ---
  const [alarms, setAlarms] = useState(() => {
    const saved = localStorage.getItem('dreamAI_alarms');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (userProfile) localStorage.setItem('dreamAI_user', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('dreamAI_dreams', JSON.stringify(dreams));
  }, [dreams]);

  useEffect(() => {
    localStorage.setItem('dreamAI_alarms', JSON.stringify(alarms));
  }, [alarms]);

  // Yeni rüya ekleme köprüsü
  const addDream = async (dreamData) => {
    // Garanti olması için saniyeye dayalı benzersiz bir ID'yi en başta üretiyoruz
    const generatedId = String(Math.floor(Math.random() * 1000000) + Date.now());
    
    try {
      const response = await fetch("http://127.0.0.1:8000/api/analyze-dream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          text: dreamData.text,
          zodiac: userProfile?.zodiac || "Bilinmiyor"
        })
      });

      if (!response.ok) {
        throw new Error("Backend api hatası");
      }

      const apiResult = await response.json();

      const newDream = {
        id: generatedId, // <--- Sayfa yönlendirmesinin aradığı kesin ID
        date: new Date().toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' }),
        text: dreamData.text,
        title: dreamData.title || "Rüya Analizi",
        sentiment: apiResult.sentiment || "Nötr",
        classicMeaning: apiResult.classic_meaning || "Yorum yüklenemedi.",
        freudMeaning: apiResult.freud_meaning || "Yorum yüklenemedi.",
        jungMeaning: apiResult.jung_meaning || "Yorum yüklenemedi.",
        islamicMeaning: apiResult.islamic_meaning || "Yorum yüklenemedi.",
        astrologicalMeaning: apiResult.astrological_meaning || "Yorum yüklenemedi.",
        imageUrl: apiResult.image_url || "https://images.unsplash.com/photo-1518709268805-4e9042af9f23",
        keywords: apiResult.keywords || ["dream"],
        isFavorite: false
      };

      setDreams(prev => [newDream, ...prev]);
      return generatedId; // <--- Ahmet'in sayfasına başarıyla ID'yi fırlatıyoruz

    } catch (error) {
      console.error("Köprü hatası, taslak moda geçiliyor:", error);
      
      // Çökme olmasın diye güvenli taslak modu
      const fallbackDream = {
        id: generatedId,
        date: new Date().toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' }),
        text: dreamData.text,
        title: dreamData.title || "Geçici Rüya Analizi",
        sentiment: "Nötr",
        classicMeaning: "Sistem şu an meşgul, daha sonra tekrar deneyin.",
        freudMeaning: "Sistem şu an meşgul, daha sonra tekrar deneyin.",
        jungMeaning: "Sistem şu an meşgul, daha sonra tekrar deneyin.",
        islamicMeaning: "Sistem şu an meşgul, daha sonra tekrar deneyin.",
        astrologicalMeaning: "Sistem şu an meşgul, daha sonra tekrar deneyin.",
        imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23",
        keywords: ["dream"],
        isFavorite: false
      };
      
      setDreams(prev => [fallbackDream, ...prev]);
      return generatedId;
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

  const addAlarm = (time, sound = 'gentle') => {
    const newAlarm = { id: Date.now().toString(), time, active: true, sound };
    setAlarms([...alarms, newAlarm]);
  };

  const updateAlarmSound = (id, sound) => {
    setAlarms(prev => prev.map(a => a.id === id ? { ...a, sound } : a));
  };

  const toggleAlarm = (id) => {
    setAlarms(prev => prev.map(a => a.id === id ? { ...a, active: !a.active } : a));
  };

  const removeAlarm = (id) => {
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
