// src/app/not-found.tsx

"use client";

import Container from "@/components/Container";
import Link from "next/link";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Menu from "@/components/Menu";
import { motion, AnimatePresence } from "framer-motion";

// Компонент для анимированных частиц
const FloatingParticles = () => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; size: number; speed: number; opacity: number }>>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 6 + 2,
      speed: Math.random() * 0.5 + 0.2,
      opacity: Math.random() * 0.5 + 0.1,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-orange-400"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, 10, -10, 0],
            opacity: [p.opacity, p.opacity * 1.5, p.opacity],
          }}
          transition={{
            duration: 3 + p.speed * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: p.id * 0.1,
          }}
        />
      ))}
    </div>
  );
};

// Мини-игра "Найди корову"
const FindCowGame = () => {
  const [cowFound, setCowFound] = useState(false);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [cowPosition, setCowPosition] = useState({ x: 50, y: 50 });
  const [timeLeft, setTimeLeft] = useState(15);
  const [gameOver, setGameOver] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startGame = () => {
    setGameStarted(true);
    setCowFound(false);
    setGameOver(false);
    setScore(0);
    setTimeLeft(15);
    moveCow();
    
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameOver(true);
          setGameStarted(false);
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const moveCow = () => {
    const x = Math.random() * 80 + 10;
    const y = Math.random() * 80 + 10;
    setCowPosition({ x, y });
  };

  const handleCowClick = () => {
    if (!gameStarted || gameOver) return;
    setCowFound(true);
    setScore((prev) => prev + 1);
    setTimeout(() => {
      setCowFound(false);
      moveCow();
    }, 300);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-md bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 shadow-xl border border-orange-200"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-orange-700">🐄 Найди корову!</h3>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-600">
            ⭐ {score}
          </span>
          <span className={`text-sm font-medium ${timeLeft < 5 ? 'text-red-500' : 'text-gray-600'}`}>
            ⏱️ {timeLeft}с
          </span>
        </div>
      </div>

      {!gameStarted && !gameOver ? (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={startGame}
          className="w-full py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors"
        >
          Начать игру 🎮
        </motion.button>
      ) : gameOver ? (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <p className="text-2xl mb-2">🎯</p>
          <p className="text-lg font-bold text-gray-800">Игра окончена!</p>
          <p className="text-gray-600 mb-3">Найдено: <span className="font-bold text-orange-500">{score}</span> коров</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startGame}
            className="px-6 py-2 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors"
          >
            Играть снова 🔄
          </motion.button>
        </motion.div>
      ) : (
        <div className="relative w-full h-64 bg-gradient-to-b from-green-100 to-green-200 rounded-xl overflow-hidden cursor-pointer">
          {/* Трава */}
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-green-400/30" />
          
          {/* Облака */}
          <motion.div
            animate={{ x: [0, 20, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute top-4 left-4 text-2xl opacity-30"
          >
            ☁️
          </motion.div>
          <motion.div
            animate={{ x: [0, -15, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute top-8 right-8 text-2xl opacity-30"
          >
            ☁️
          </motion.div>

          {/* Коровка */}
          <motion.button
            onClick={handleCowClick}
            className="absolute text-4xl transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-125 transition-transform"
            style={{ left: `${cowPosition.x}%`, top: `${cowPosition.y}%` }}
            animate={{
              scale: cowFound ? [1, 1.5, 0] : 1,
              rotate: cowFound ? [0, 20, -20, 0] : 0,
            }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.2 }}
          >
            🐄
          </motion.button>

          {/* Подсказка */}
          <p className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-gray-500">
            Найди корову и кликни на неё!
          </p>
        </div>
      )}
    </motion.div>
  );
};

// Мини-игра "Собери молоко"
const CollectMilkGame = () => {
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [bottles, setBottles] = useState<Array<{ id: number; x: number; y: number; active: boolean }>>([]);
  const [timeLeft, setTimeLeft] = useState(20);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const spawnTimerRef = useRef<NodeJS.Timeout | null>(null);

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setTimeLeft(20);
    setBottles([]);
    
    if (timerRef.current) clearInterval(timerRef.current);
    if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
    
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameOver(true);
          setGameStarted(false);
          if (timerRef.current) clearInterval(timerRef.current);
          if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    spawnTimerRef.current = setInterval(() => {
      const x = Math.random() * 80 + 10;
      const y = Math.random() * 80 + 10;
      setBottles((prev) => [...prev, { id: Date.now() + Math.random(), x, y, active: true }]);
      
      // Удаляем старые бутылки
      setBottles((prev) => {
        if (prev.length > 10) {
          return prev.slice(prev.length - 10);
        }
        return prev;
      });
    }, 1000);
  };

  const collectBottle = (id: number) => {
    if (!gameStarted || gameOver) return;
    setBottles((prev) => prev.filter(b => b.id !== id));
    setScore((prev) => prev + 1);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
      className="w-full max-w-md bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 shadow-xl border border-blue-200"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-blue-700">🥛 Собери молоко!</h3>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-600">
            🏆 {score}
          </span>
          <span className={`text-sm font-medium ${timeLeft < 5 ? 'text-red-500' : 'text-gray-600'}`}>
            ⏱️ {timeLeft}с
          </span>
        </div>
      </div>

      {!gameStarted && !gameOver ? (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={startGame}
          className="w-full py-3 bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-600 transition-colors"
        >
          Начать игру 🎮
        </motion.button>
      ) : gameOver ? (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <p className="text-2xl mb-2">🏁</p>
          <p className="text-lg font-bold text-gray-800">Игра окончена!</p>
          <p className="text-gray-600 mb-3">Собрано: <span className="font-bold text-blue-500">{score}</span> бутылок</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startGame}
            className="px-6 py-2 bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-600 transition-colors"
          >
            Играть снова 🔄
          </motion.button>
        </motion.div>
      ) : (
        <div className="relative w-full h-64 bg-gradient-to-b from-blue-100 to-blue-200 rounded-xl overflow-hidden">
          {/* Небо и облака */}
          <motion.div
            animate={{ x: [0, 30, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="absolute top-2 left-4 text-3xl opacity-20"
          >
            ☁️
          </motion.div>
          <motion.div
            animate={{ x: [0, -25, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute top-6 right-8 text-2xl opacity-20"
          >
            ☁️
          </motion.div>

          {/* Бутылки молока */}
          <AnimatePresence>
            {bottles.map((bottle) => (
              <motion.button
                key={bottle.id}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                onClick={() => collectBottle(bottle.id)}
                className="absolute text-3xl transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-125 transition-transform"
                style={{ left: `${bottle.x}%`, top: `${bottle.y}%` }}
                whileHover={{ scale: 1.2 }}
              >
                🥛
              </motion.button>
            ))}
          </AnimatePresence>

          {/* Подсказка */}
          <p className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-gray-500">
            Собирай бутылки молока!
          </p>
        </div>
      )}
    </motion.div>
  );
};

const NotFoundPage = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showGame, setShowGame] = useState<'cow' | 'milk' | null>(null);

  // Устанавливаем заголовок страницы
  useEffect(() => {
    document.title = "404 - Страница не найдена";
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 20,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 20,
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50">
      <Menu />
      
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative min-h-[600px] flex flex-col items-center justify-center gap-6 bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl p-8 overflow-hidden border border-gray-100"
          onMouseMove={handleMouseMove}
        >
          {/* Фоновые частицы */}
          <FloatingParticles />

          {/* Параллакс эффект */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{
              backgroundPosition: `${mousePosition.x}px ${mousePosition.y}px`,
            }}
            transition={{ type: "spring", stiffness: 50 }}
            style={{
              backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(251, 146, 60, 0.05) 0%, transparent 50%)',
              backgroundSize: '200% 200%',
            }}
          />

          {/* Основной контент */}
          <div className="relative z-10 flex flex-col items-center gap-6 w-full max-w-4xl">
            {/* Анимированная 404 */}
            <motion.div
              initial={{ scale: 0.5, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: 0.2
              }}
              className="relative"
            >
              <motion.h1
                className="text-8xl md:text-9xl font-black bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent select-none"
                animate={{
                  scale: [1, 1.02, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                404
              </motion.h1>
              
              {/* Декоративная линия */}
              <motion.div
                className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange-400 to-transparent rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              />
            </motion.div>

            {/* Текст */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                Упс! Страница убежала 🏃
              </h2>
              <p className="text-gray-500 text-lg max-w-md mx-auto">
                Похоже, коровы съели эту страницу. 
                Но мы уже ищем новую!
              </p>
            </motion.div>

            {/* Кнопки действий */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-4 justify-center"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all"
                >
                  <span>🏠</span>
                  На главную
                </Link>
              </motion.div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-700 font-semibold rounded-xl shadow-md border border-gray-200 hover:bg-gray-50 transition-all"
              >
                <span>🔄</span>
                Обновить
              </motion.button>
            </motion.div>

            {/* Игры */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="w-full max-w-2xl"
            >
              <div className="text-center mb-4">
                <p className="text-sm text-gray-400">
                  {!showGame ? '🎮 Сыграй в мини-игру, пока мы ищем страницу!' : '👆 Играй и зарабатывай очки!'}
                </p>
              </div>

              {!showGame ? (
                <div className="flex flex-wrap gap-4 justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowGame('cow')}
                    className="flex items-center gap-3 px-6 py-4 bg-gradient-to-br from-amber-400 to-orange-400 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all"
                  >
                    <span className="text-3xl">🐄</span>
                    <div className="text-left">
                      <div className="text-sm opacity-80">Мини-игра</div>
                      <div>Найди корову</div>
                    </div>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowGame('milk')}
                    className="flex items-center gap-3 px-6 py-4 bg-gradient-to-br from-blue-400 to-cyan-400 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all"
                  >
                    <span className="text-3xl">🥛</span>
                    <div className="text-left">
                      <div className="text-sm opacity-80">Мини-игра</div>
                      <div>Собери молоко</div>
                    </div>
                  </motion.button>
                </div>
              ) : (
                <div className="relative">
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => setShowGame(null)}
                    className="absolute -top-2 -right-2 z-10 w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-gray-600 transition-colors"
                  >
                    ✕
                  </motion.button>
                  
                  <AnimatePresence mode="wait">
                    {showGame === 'cow' && <FindCowGame />}
                    {showGame === 'milk' && <CollectMilkGame />}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </Container>
    </div>
  );
};

export default NotFoundPage;