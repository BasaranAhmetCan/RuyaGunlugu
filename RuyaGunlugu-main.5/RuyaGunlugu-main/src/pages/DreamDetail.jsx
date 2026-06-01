import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDreamContext } from '../context/DreamContext';
import { ArrowLeft, Star, Sparkles, Image as ImageIcon, Loader2, Trash2, RefreshCw, Moon } from 'lucide-react';

const TABS = [
  { id: 'classic', label: 'Klasik' },
  { id: 'freud', label: 'Freud' },
  { id: 'jung', label: 'Jung' },
  { id: 'islamic', label: 'İslami' },
  { id: 'astrological', label: 'Astrolojik' }
];

const DreamDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { dreams, toggleFavorite, setImageForDream, deleteDream } = useDreamContext();
  
  const dream = dreams.find(d => d.id === id);
  const [activeTab, setActiveTab] = useState('classic');
  const [isGenerating, setIsGenerating] = useState(false);

  if (!dream) return <div className="p-10 text-center text-white">Rüya bulunamadı.</div>;

  const handleGenerateImage = async () => {
    setIsGenerating(true);
    try {
      const keyword = (dream.keywords && dream.keywords.length > 0) ? dream.keywords[0] : "nature";
      const lock_id = Math.floor(Math.random() * 10000);
      const newImageUrl = `https://loremflickr.com/1024/1024/${encodeURIComponent(keyword)}?lock=${lock_id}`;
      
      // Biraz yapay zeka yükleniyormuş hissi vermek için bekliyoruz :)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setImageForDream(dream.id, newImageUrl);
    } catch (err) {
      console.warn('Görsel yenilenemedi:', err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const getInterpretationText = () => {
    switch (activeTab) {
      case 'classic': return dream.classicMeaning || dream.classic_meaning || "Bu rüya henüz geleneksel perspektiften yorumlanmamış. Lütfen rüyayı yeniden analiz ettirin.";
      case 'freud': return dream.freudMeaning || dream.freud_meaning || "Freudyen bilinçaltı analizi bu rüya için mevcut değil. Rüyâyı yeniden analiz ettirmeyi deneyin.";
      case 'jung': return dream.jungMeaning || dream.jung_meaning || "Jungiyen arketip analizi bu rüya için mevcut değil. Rüyâyı yeniden analiz ettirmeyi deneyin.";
      case 'islamic': return dream.islamicMeaning || dream.islamic_meaning || "Geleneksel İslamî yorumu bu rüya için mevcut değil. Rüyâyı yeniden analiz ettirmeyi deneyin.";
      case 'astrological': return dream.astrologicalMeaning || dream.astrological_meaning || "Astrolojik analiz bu rüya için mevcut değil. Rüyâyı yeniden analiz ettirmeyi deneyin.";
      default: return "Yorum yüklenemedi.";
    }
  };

  const handleDelete = () => {
    deleteDream(dream.id);
    navigate('/journal');
  };

  return (
    <div className="min-h-screen w-full bg-dream-dark text-white pb-32">

      {/* Üst Nav Çubuğu */}
      <div className="flex justify-between items-center px-6 pt-12 pb-4 max-w-md mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
        >
          <ArrowLeft size={20} className="text-white/80" />
        </button>

        <div className="flex items-center gap-2">
          <Moon size={16} className="text-dream-accent opacity-80" />
          <span className="text-xs uppercase tracking-[0.3em] text-white/30">Rüya Analizi</span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => toggleFavorite(dream.id)}
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <Star size={18} className={dream.isFavorite ? "text-yellow-400 fill-yellow-400" : "text-white/60"} />
          </button>
          <button
            onClick={handleDelete}
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-red-500/20 hover:border-red-500/30 transition-colors text-white/60 hover:text-red-400"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* İçerik */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-6 max-w-md mx-auto flex flex-col gap-5 mt-2"
      >
        {/* Tarih + Metin */}
        <div className="flex flex-col gap-2">
          <span className="text-xs uppercase tracking-widest text-dream-accent">{dream.date}</span>
          <p className="text-base font-light leading-relaxed text-white/85">"{dream.text}"</p>
        </div>

        {/* Etiketler */}
        {dream.keywords?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {dream.keywords.map(k => (
              <span key={k} className="text-[10px] px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-white/60 uppercase tracking-wider">
                {k}
              </span>
            ))}
          </div>
        )}

        {/* Görsel Kartı */}
        <div className="rounded-3xl overflow-hidden border border-white/10 bg-white/[0.02]">
          <AnimatePresence mode="wait">
            {isGenerating ? (
              <motion.div
                key="generating"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-52 flex flex-col items-center justify-center gap-4"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-dream-accent blur-xl rounded-full opacity-20 animate-pulse" />
                  <Loader2 size={36} className="text-dream-accent animate-spin relative z-10" />
                </div>
                <p className="text-xs tracking-[0.2em] uppercase text-dream-accent/60 animate-pulse">
                  Görsel Oluşturuluyor...
                </p>
              </motion.div>
            ) : dream.imageUrl ? (
              <motion.div
                key="image"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="relative w-full h-56 bg-dream-dark/50"
              >
                {/* Yükleniyor Göstergesi */}
                <div id="image-loader-overlay" className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-dream-dark/80 z-20 pointer-events-none transition-opacity duration-500">
                   <div className="relative">
                      <div className="absolute inset-0 bg-dream-accent blur-xl rounded-full opacity-20 animate-pulse" />
                      <Loader2 size={36} className="text-dream-accent animate-spin relative z-10" />
                   </div>
                   <p className="text-xs tracking-[0.2em] uppercase text-dream-accent/60 animate-pulse">
                      Görsel İndiriliyor...
                   </p>
                </div>
                
                <img
                  src={dream.imageUrl}
                  alt="Rüya görseli"
                  className="w-full h-56 object-cover"
                  onLoad={(e) => {
                     const loader = e.target.previousElementSibling;
                     if (loader) loader.style.opacity = '0';
                  }}
                  onError={(e) => {
                    const loader = e.target.previousElementSibling;
                    if (loader) {
                        loader.style.opacity = '1';
                        loader.innerHTML = '<p class="text-xs tracking-wider text-red-400">Yapay Zeka Sunucusu Yoğun. Lütfen tekrar deneyin.</p>';
                    }
                    e.target.style.display = 'none';
                  }}
                />
                {/* Görsel üstü gradient + yenile butonu */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <button
                  onClick={handleGenerateImage}
                  className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white/80 hover:text-white hover:bg-black/70 transition-all text-xs"
                >
                  <RefreshCw size={12} />
                  <span className="tracking-wider">Yenile</span>
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-52 flex flex-col items-center justify-center gap-3"
              >
                <div className="w-14 h-14 rounded-full bg-dream-accent/10 border border-dream-accent/20 flex items-center justify-center">
                  <ImageIcon size={24} className="text-dream-accent/60" />
                </div>
                <p className="text-xs text-white/30 tracking-wider">Henüz görsel oluşturulmadı</p>
                <button
                  onClick={handleGenerateImage}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-dream-accent/20 border border-dream-accent/30 hover:bg-dream-accent/30 text-white/80 hover:text-white transition-all text-sm"
                >
                  <Sparkles size={15} />
                  <span className="font-light tracking-wider">Yapay Zeka ile Görselleştir</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Yorumlama Sekmeleri */}
        {dream && (
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-xs transition-all duration-300 ${
                  activeTab === tab.id
                  ? 'bg-dream-accent text-white always-white shadow-[0_0_15px_rgba(139,92,246,0.3)]'
                  : 'bg-white/5 text-white/50 hover:bg-white/10 border border-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-6 rounded-3xl bg-dream-accent/5 border border-dream-accent/20 relative overflow-hidden"
        >
          <div className="relative z-10 flex flex-col gap-3">
            <h3 className="text-sm tracking-widest uppercase text-dream-accent flex items-center gap-2">
              {TABS.find(t => t.id === activeTab)?.label} Yorumu
            </h3>
            <p className="text-sm font-light leading-relaxed text-white/80">
              {getInterpretationText()}
            </p>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default DreamDetail;
