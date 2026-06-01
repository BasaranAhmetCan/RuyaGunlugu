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

  // Yeni rüya ekleme
  const addDream = (dreamData) => {
    const newDream = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' }),
      ...dreamData,
      isFavorite: false
    };
    setDreams(prev => [newDream, ...prev]);
    return newDream.id;
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
    setAlarms(prev => [...prev, newAlarm]);
    
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
