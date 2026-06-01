import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDreamContext } from '../context/DreamContext';

const DreamDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { dreams, deleteDream, toggleFavorite } = useDreamContext();
  const [activeTab, setActiveTab] = useState('classic');

  const dream = dreams.find(d => d.id === id);

  if (!dream) {
    return (
      <div className="p-6 text-center text-white">
        <h2 className="text-xl font-bold mb-4">Rüya bulunamadı.</h2>
        <button onClick={() => navigate('/')} className="bg-purple-600 px-4 py-2 rounded">
          Ana Sayfaya Dön
        </button>
      </div>
    );
  }

  // Hem eski deve notasyonunu hem de yeni yılan notasyonunu destekleyen akıllı yorum yakalayıcı:
  const getMeaning = () => {
    switch (activeTab) {
      case 'classic': return dream.classicMeaning || dream.classic_meaning || "Bu rüya henüz geleneksel perspektiften yorumlanmamış. Lütfen rüyayı yeniden analiz ettirin.";
      case 'freud': return dream.freudMeaning || dream.freud_meaning || "Freudyen bilinçaltı analizi bu rüya için mevcut değil. Rüyâyı yeniden analiz ettirmeyi deneyin.";
      case 'jung': return dream.jungMeaning || dream.jung_meaning || "Jungiyen arketip analizi bu rüya için mevcut değil. Rüyâyı yeniden analiz ettirmeyi deneyin.";
      case 'islamic': return dream.islamicMeaning || dream.islamic_meaning || "Geleneksel İslamî yorumu bu rüya için mevcut değil. Rüyâyı yeniden analiz ettirmeyi deneyin.";
      case 'astrological': return dream.astrologicalMeaning || dream.astrological_meaning || "Astrolojik analiz bu rüya için mevcut değil. Rüyâyı yeniden analiz ettirmeyi deneyin.";
      default: return "Yorum yüklenemedi.";
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto text-white min-h-screen bg-slate-900">
      <div className="flex justify-between items-center mb-6">
        <button onClick={() => navigate(-1)} className="text-purple-400">← Geri Dön</button>
        <div className="flex gap-4">
          <button onClick={() => toggleFavorite(dream.id)} className="text-xl">
            {dream.isFavorite ? '❤️' : '🤍'}
          </button>
          <button onClick={() => { deleteDream(dream.id); navigate('/'); }} className="text-red-500">🗑️ Sil</button>
        </div>
      </div>

      <h1 className="text-2xl font-bold mb-2">{dream.title || 'Rüya Analizi'}</h1>
      <p className="text-sm text-slate-400 mb-4">{dream.date}</p>

      <div className="bg-slate-800 p-4 rounded-xl mb-6 border border-slate-700">
        <h3 className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-2">Senin Ruyan</h3>
        <p className="text-slate-200 italic">"{dream.text}"</p>
        {dream.sentiment && (
          <span className="inline-block mt-3 bg-purple-900/50 text-purple-300 text-xs px-2.5 py-1 rounded-md border border-purple-700">
            Duygu Durumu: {dream.sentiment}
          </span>
        )}
      </div>

      {/* Rüya Görseli - her zaman bir görsel göster */}
      <div className="mb-6 rounded-xl overflow-hidden border border-slate-700">
        <img 
          src={dream.imageUrl || `https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1024&q=80&sig=${dream.id}`} 
          alt="Rüya Görseli" 
          className="w-full h-64 object-cover"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?auto=format&fit=crop&w=1024&q=80';
          }}
        />
      </div>

      {/* Akademik Perspektif Sekmeleri */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 border-b border-slate-700">
        {['classic', 'freud', 'jung', 'islamic', 'astrological'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
              activeTab === tab ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400'
            }`}
          >
            {tab === 'classic' ? 'Geleneksel' : tab === 'astrological' ? 'Astrolojik' : tab}
          </button>
        ))}
      </div>

      <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 min-h-[150px]">
        <p className="text-slate-300 leading-relaxed text-sm whitespace-pre-line">{getMeaning()}</p>
      </div>
    </div>
  );
};

export default DreamDetail;
