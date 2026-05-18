import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useDreamContext } from '../context/DreamContext';
import { Sparkles, Quote } from 'lucide-react';

const Profile = () => {
  const { userProfile, dreams } = useDreamContext();

  const writtenAnalysis = useMemo(() => {
    if (!dreams || dreams.length === 0) {
      return "Sisteme henüz rüya kaydetmediniz. Analiz yapabilmem için rüyalarınızın derinliklerine inmem gerekiyor.";
    }

    const totalDreams = dreams.length;
    let positive = 0, negative = 0, neutral = 0;
    const keywordCounts = {};

    dreams.forEach(d => {
      if (d.sentiment === 'positive') positive++;
      else if (d.sentiment === 'negative') negative++;
      else neutral++;

      d.keywords?.forEach(k => {
        keywordCounts[k] = (keywordCounts[k] || 0) + 1;
      });
    });

    const topKeyword = Object.keys(keywordCounts).length > 0 
      ? Object.keys(keywordCounts).reduce((a, b) => keywordCounts[a] > keywordCounts[b] ? a : b)
      : null;

    let sentimentAnalysis = "";
    if (positive > negative && positive > neutral) {
      sentimentAnalysis = "Son zamanlarda rüyalarınız ağırlıklı olarak pozitif ve huzurlu bir auraya sahip. Bilinçaltınız günlük hayatın stresinden uzak, kendini yenileme evresinde.";
    } else if (negative > positive && negative > neutral) {
      sentimentAnalysis = "Kayıtlarınızda yoğun bir stres ve kabus eğilimi (negatif enerji) göze çarpıyor. Çözülmemiş bazı günlük sorunlar uyku kalitenizi etkiliyor olabilir; yatmadan önce zihninizi boşaltacak pratikler yapmanız faydalı olacaktır.";
    } else {
      sentimentAnalysis = "Ruh haliniz oldukça dengeli seyrediyor. Ne aşırı bir stres ne de uçarı bir mutluluk var; bilinçaltınız olayları nötr bir gözlemci gibi kaydediyor.";
    }

    let keywordAnalysis = "";
    if (topKeyword) {
      keywordAnalysis = ` Özellikle rüyalarınızda "${topKeyword}" sembolünün sıklıkla karşınıza çıkması tesadüf değil. Bu, şu sıralar odağınızın veya bastırdığınız duyguların tam da bu temanın etrafında şekillendiğini gösteriyor.`;
    }

    let astroAnalysis = "";
    if (userProfile?.zodiac) {
      astroAnalysis = ` ${userProfile.zodiac} burcunun karakteristik sezgiselliği, tüm bu rüya döngünüzü daha da derin ve anlamlı kılıyor. Evrenin size mesajı var.`;
    }

    return `${sentimentAnalysis}${keywordAnalysis}${astroAnalysis}`;
  }, [dreams, userProfile]);

  return (
    <div className="min-h-screen w-full bg-dream-dark text-white p-6 pt-12 pb-32">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-md mx-auto flex flex-col gap-8"
      >
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-light tracking-widest uppercase text-white/90">İçgörüler</h1>
          <Sparkles className="text-dream-accent" />
        </header>

        {/* Yazılı Analiz (Yapay Zeka İçgörüsü) */}
        <div className="bg-dream-accent/5 border border-dream-accent/20 rounded-3xl p-8 relative overflow-hidden flex-1 flex flex-col justify-center">
          <div className="absolute top-4 right-4 text-dream-accent/20">
            <Quote size={60} />
          </div>
          
          <div className="flex items-center gap-3 mb-6 relative z-10">
            <Sparkles size={24} className="text-dream-accent" />
            <h3 className="text-lg tracking-widest uppercase text-dream-accent font-medium">Bilinçaltı Raporu</h3>
          </div>
          
          <p className="text-base font-light leading-relaxed text-white/80 relative z-10">
            {writtenAnalysis}
          </p>
        </div>

      </motion.div>
    </div>
  );
};

export default Profile;
