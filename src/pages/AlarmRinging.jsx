import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BellRing, Mic, Clock } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { playAlarmSound, stopAlarmSound } from '../utils/alarmSounds';

const AlarmRinging = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [snoozed, setSnoozed] = useState(false);
  
  // Alarm sesini al (route state'den veya varsayılan)
  const alarmSound = location.state?.sound || 'gentle';

  // Sayfa açıldığında sesi çal
  useEffect(() => {
    if (!snoozed) {
      playAlarmSound(alarmSound, true);
    }
    
    return () => {
      stopAlarmSound();
    };
  }, [snoozed, alarmSound]);

  const handleDismiss = () => {
    stopAlarmSound();
    if (window.snoozeTimeout) {
      clearTimeout(window.snoozeTimeout);
      window.snoozeTimeout = null;
    }
    navigate('/');
  };

  const handleRecord = () => {
    stopAlarmSound();
    if (window.snoozeTimeout) {
      clearTimeout(window.snoozeTimeout);
      window.snoozeTimeout = null;
    }
    navigate('/', { state: { recordImmediately: true } });
  };

  const handleSnooze = () => {
    stopAlarmSound();
    
    if (window.snoozeTimeout) {
      clearTimeout(window.snoozeTimeout);
    }

    setSnoozed(true);

    // 3 saniye erteleme ekranını gösterdikten sonra alarm sayfasına yönlendir ve 30 saniye sonrasına alarm kur
    setTimeout(() => {
      setSnoozed(false);
      navigate('/alarm');
      
      window.snoozeTimeout = setTimeout(() => {
        navigate('/alarm-ringing', { state: { sound: alarmSound } });
      }, 30000); // 30 saniye sonra tekrar çalsın
    }, 3000);
  };

  if (snoozed) {
    return (
      <div className="min-h-screen w-full bg-dream-dark flex flex-col items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-4 text-white/50">
          <Clock size={40} className="text-dream-accent/50 animate-pulse" />
          <p className="font-light tracking-widest text-sm uppercase">30 Saniye Ertelendi...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-dream-dark flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* Pulsing Background */}
      <motion.div 
        animate={{ opacity: [0.1, 0.4, 0.1], scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-full h-full bg-dream-accent mix-blend-screen blur-[100px]"
      />

      {/* Sound wave rings */}
      {[1, 2, 3].map((ring) => (
        <motion.div
          key={ring}
          animate={{ 
            scale: [1, 2.5], 
            opacity: [0.3, 0] 
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            delay: ring * 0.5,
            ease: "easeOut"
          }}
          className="absolute w-24 h-24 rounded-full border border-dream-accent/30"
        />
      ))}

      <div className="relative z-10 flex flex-col items-center gap-10">
        
        <motion.div
          animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="text-white relative"
        >
          <BellRing size={80} strokeWidth={1} />
          {/* Glow effect behind bell */}
          <motion.div
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute inset-0 bg-dream-accent/20 blur-xl rounded-full -z-10"
          />
        </motion.div>

        <div className="text-center">
          <h1 className="text-4xl font-light text-white mb-2 tracking-widest">Günaydın</h1>
          <p className="text-dream-accent font-light tracking-wide text-sm">Rüyanızı unutmadan kaydedin.</p>
          
          {/* Çalan ses bilgisi */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-4 flex items-center justify-center gap-2"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            >
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map((bar) => (
                  <motion.div
                    key={bar}
                    animate={{ height: [4, 12 + bar * 2, 4] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: bar * 0.1 }}
                    className="w-[3px] bg-dream-accent/60 rounded-full"
                    style={{ height: 4 }}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>

        <div className="flex flex-col items-center gap-4 mt-8 w-full px-10">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRecord}
            className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] text-pure-white shadow-[0_0_40px_rgba(139,92,246,0.6)]"
          >
            <Mic size={24} />
            <span className="font-medium tracking-wide">Hemen Kaydet</span>
          </motion.button>

          <button 
            onClick={handleSnooze}
            className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 transition-colors"
          >
            <Clock size={20} />
            <span className="font-light tracking-wider text-sm">30 Saniye Ertele</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default AlarmRinging;
