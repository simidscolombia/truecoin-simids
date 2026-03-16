'use client';

import { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { X, Send, User, Minimize2 } from 'lucide-react';
import { aiService, Message as AIMessage } from '../services/aiService';

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'ai';
    time: string;
}

const now = () => new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });

export default function AIChatSupport() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: '¡Hola! Soy Shopy, tu Coach Maestro de ShopyBrands. Estoy aquí para acelerar tu crecimiento y optimizar tu red. ¿Qué deseas consultar hoy?', sender: 'ai', time: now() },
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [supportMode, setSupportMode] = useState<'ai' | 'human'>('ai');

    // ── 3D Parallax Logic ──────────────────────────────────
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 20, stiffness: 100 };
    const rotateX = useSpring(useTransform(mouseY, [-200, 200], [15, -15]), springConfig);
    const rotateY = useSpring(useTransform(mouseX, [-200, 200], [-15, 15]), springConfig);

    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - (rect.left + rect.width / 2);
        const y = e.clientY - (rect.top + rect.height / 2);
        mouseX.set(x);
        mouseY.set(y);
    };

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
    };
    // ────────────────────────────────────────────────────────

    const handleSend = async () => {
        const text = input.trim();
        if (!text) return;

        const userMsg: Message = { id: Date.now(), text, sender: 'user', time: now() };
        setMessages((prev: Message[]) => [...prev, userMsg]);
        setInput('');

        if (supportMode === 'human') {
            // En modo humano, la IA no responde, solo se notificaría al admin (simulado)
            setTimeout(() => {
                const aiMsg: Message = { id: Date.now() + 1, text: "💬 Mensaje enviado a soporte humano. Un agente te responderá pronto.", sender: 'ai', time: now() };
                setMessages((prev: Message[]) => [...prev, aiMsg]);
            }, 500);
            return;
        }

        setIsTyping(true);

        try {
            const history: AIMessage[] = messages.map((m: Message) => ({
                role: m.sender === 'user' ? 'user' : 'assistant',
                content: m.text
            }));

            // Detectar si el usuario pide ayuda humana
            if (text.toLowerCase().includes('soporte') || text.toLowerCase().includes('humano') || text.toLowerCase().includes('persona')) {
                setTimeout(() => {
                    const aiMsg: Message = { id: Date.now() + 1, text: "Entiendo que necesitas atención personalizada. ¿Quieres que transfiera esta conversación a un agente humano?", sender: 'ai', time: now() };
                    setMessages((prev: Message[]) => [...prev, aiMsg]);
                    setIsTyping(false);
                }, 800);
                return;
            }

            const response = await aiService.getResponse(text, history);

            setTimeout(() => {
                const aiMsg: Message = { id: Date.now() + 1, text: response, sender: 'ai', time: now() };
                setMessages((prev: Message[]) => [...prev, aiMsg]);
                setIsTyping(false);
            }, 800);
        } catch (error) {
            console.error('Error en Shopy:', error);
            setIsTyping(false);
        }
    };

    const requestHuman = () => {
        setSupportMode('human');
        const msg: Message = { id: Date.now(), text: "🔄 Transferido a Soporte Humano. Shopy IA se ha silenciado.", sender: 'ai', time: now() };
        setMessages(prev => [...prev, msg]);
    };

    return (
        <>
            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                        style={{
                            position: 'fixed', bottom: 90, right: 24, zIndex: 150,
                            width: 380, background: 'var(--color-surface)',
                            borderRadius: 24, boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                            border: '1px solid var(--color-border)',
                            overflow: 'hidden', display: 'flex', flexDirection: 'column',
                            maxHeight: isMinimized ? 64 : 560,
                            transition: 'max-height 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1)',
                            perspective: '1000px',
                        }}
                    >
                        {/* Header */}
                        <div style={{
                            padding: '16px 20px', background: 'var(--color-navy)',
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            flexShrink: 0, position: 'relative', overflow: 'hidden'
                        }}>
                            <motion.div
                                animate={{ opacity: [0.3, 0.5, 0.3] }}
                                transition={{ duration: 3, repeat: Infinity }}
                                style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 20% 50%, rgba(212,175,55,0.2), transparent)' }}
                            />

                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, position: 'relative', zIndex: 1 }}>
                                {/* 3D Mascot Container */}
                                <motion.div
                                    style={{
                                        width: 50, height: 50, borderRadius: '16px',
                                        background: 'rgba(255,255,255,0.1)', overflow: 'hidden',
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        rotateX, rotateY,
                                        transformStyle: 'preserve-3d'
                                    }}
                                >
                                    <motion.img
                                        src="/assets/cerebro-mascot.png"
                                        alt="Cerebro"
                                        style={{
                                            width: '100%', height: '100%', objectFit: 'cover',
                                            translateZ: '20px'
                                        }}
                                    />
                                </motion.div>
                                <div>
                                    <p style={{ fontSize: 16, fontWeight: 800, color: 'white', margin: 0, letterSpacing: -0.5 }}>
                                        {supportMode === 'ai' ? 'Shopy Master IA' : 'Soporte Vital'}
                                    </p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <motion.span
                                            animate={{ opacity: [1, 0.5, 1], scale: [1, 1.2, 1] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                            style={{ width: 8, height: 8, borderRadius: '50%', background: supportMode === 'ai' ? '#4ADE80' : '#3B82F6', display: 'inline-block' }}
                                        />
                                        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>
                                            {supportMode === 'ai' ? 'Ecosistema Inteligente' : 'Agente Humano en línea'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: 8, position: 'relative', zIndex: 1 }}>
                                <button
                                    onClick={() => setIsMinimized(!isMinimized)}
                                    style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}
                                >
                                    <Minimize2 size={16} />
                                </button>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </div>

                        {!isMinimized && (
                            <>
                                {/* Messages Area */}
                                <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 10px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                                    {messages.map((msg: Message) => (
                                        <div key={msg.id} style={{ display: 'flex', gap: 10, flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row', alignItems: 'flex-start' }}>
                                            <div style={{
                                                width: 36, height: 36, borderRadius: '12px', flexShrink: 0,
                                                background: msg.sender === 'ai' ? 'var(--color-navy)' : 'var(--color-surface-2)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                overflow: 'hidden', border: '1px solid var(--color-border)',
                                                marginTop: 4,
                                                perspective: '100px'
                                            }}>
                                                {msg.sender === 'ai' ? (
                                                    <motion.img
                                                        src="/assets/cerebro-mascot.png"
                                                        alt="AI"
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                        animate={{ rotateY: msg.sender === 'ai' ? rotateY.get() : 0 }}
                                                    />
                                                ) : (
                                                    <User size={18} color="var(--color-navy)" />
                                                )}
                                            </div>
                                            <div style={{ maxWidth: '80%' }}>
                                                <div style={{
                                                    padding: '12px 16px',
                                                    borderRadius: msg.sender === 'ai' ? '0 18px 18px 18px' : '18px 0 18px 18px',
                                                    background: msg.sender === 'ai' ? 'var(--color-surface-2)' : 'var(--color-navy)',
                                                    color: msg.sender === 'ai' ? 'var(--color-text)' : 'white',
                                                    fontSize: 14, lineHeight: 1.5,
                                                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                                                }}>
                                                    {msg.text}
                                                </div>
                                                <p style={{ fontSize: 10, color: 'var(--color-text-muted)', marginTop: 4, textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
                                                    {msg.time}
                                                </p>
                                            </div>
                                        </div>
                                    ))}

                                    {isTyping && (
                                        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                                            <motion.div style={{ width: 36, height: 36, borderRadius: '12px', background: 'var(--color-navy)', overflow: 'hidden', rotateY }}>
                                                <img src="/assets/cerebro-mascot.png" alt="AI" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            </motion.div>
                                            <div style={{ padding: '12px 16px', background: 'var(--color-surface-2)', borderRadius: '0 18px 18px 18px', display: 'flex', gap: 4 }}>
                                                {[0, 0.2, 0.4].map((delay, i) => (
                                                    <motion.span
                                                        key={i}
                                                        animate={{ y: [0, -4, 0] }}
                                                        transition={{ repeat: Infinity, duration: 0.8, delay }}
                                                        style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-text-muted)', display: 'block' }}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Floating Suggestions */}
                                <div style={{ padding: '0 18px 14px', display: 'flex', gap: 8, overflowX: 'auto', flexShrink: 0, scrollbarWidth: 'none' }}>
                                    {supportMode === 'ai' && [
                                        { l: '¿Cómo subo de nivel?', v: 'nivel' },
                                        { l: 'Hablar con humano 👤', v: 'human', action: requestHuman },
                                        { l: 'Precios VIP', v: 'vip' }
                                    ].map(s => (
                                        <motion.button
                                            key={s.v}
                                            whileHover={{ y: -2 }}
                                            onClick={() => s.action ? s.action() : setInput(s.l)}
                                            style={{
                                                padding: '6px 14px', borderRadius: 12, border: '1px solid var(--color-border)',
                                                background: 'var(--color-surface)', fontSize: 12, fontWeight: 600,
                                                color: 'var(--color-text-muted)', cursor: 'pointer', whiteSpace: 'nowrap',
                                                boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                                            }}
                                        >
                                            {s.l}
                                        </motion.button>
                                    ))}
                                    {supportMode === 'human' && (
                                        <button
                                            onClick={() => setSupportMode('ai')}
                                            style={{ padding: '6px 14px', borderRadius: 12, background: 'var(--color-navy)', color: 'white', border: 'none', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
                                        >
                                            ✨ Volver a Shopy IA
                                        </button>
                                    )}
                                </div>

                                {/* Modern Input Container */}
                                <div style={{ padding: '14px 18px 20px', borderTop: '1px solid var(--color-border)', display: 'flex', gap: 10, flexShrink: 0 }}>
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={e => setInput(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && handleSend()}
                                        placeholder="Optimizar mi ecosistema..."
                                        style={{
                                            flex: 1,
                                            padding: '12px 16px',
                                            borderRadius: 14,
                                            border: '1px solid var(--color-border)',
                                            background: 'var(--color-bg)',
                                            fontSize: 14,
                                            outline: 'none'
                                        }}
                                    />
                                    <motion.button
                                        whileHover={{ scale: 1.05, rotate: 5 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleSend}
                                        style={{
                                            width: 48, height: 48, borderRadius: 14, background: 'var(--color-navy)', border: 'none',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                                        }}
                                    >
                                        <Send size={20} color="white" />
                                    </motion.button>
                                </div>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Pulsing FAB Button */}
            <motion.button
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => { setIsOpen(!isOpen); setIsMinimized(false); }}
                style={{
                    position: 'fixed', bottom: 24, right: 24, zIndex: 150,
                    width: 68, height: 68, borderRadius: '24px',
                    background: 'var(--color-navy)', boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                    border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: 0, overflow: 'hidden'
                }}
            >
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                            <X size={32} color="white" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="open"
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.5, opacity: 0 }}
                            style={{ width: '100%', height: '100%', position: 'relative' }}
                        >
                            <img src="/assets/cerebro-mascot.png" alt="Cerebro" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </motion.div>
                    )}
                </AnimatePresence>
                {!isOpen && (
                    <motion.span
                        animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        style={{ position: 'absolute', top: 8, right: 8, width: 14, height: 14, background: '#4ADE80', borderRadius: '50%', border: '2px solid var(--color-navy)' }}
                    />
                )}
            </motion.button>
        </>
    );
}
