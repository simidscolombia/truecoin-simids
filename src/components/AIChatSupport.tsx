'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
        { id: 1, text: '¡Hola! Soy el Cerebro de TrueCoin Simids. Estoy aquí para optimizar tu experiencia en el ecosistema. ¿Qué deseas consultar hoy?', sender: 'ai', time: now() },
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const handleSend = async () => {
        const text = input.trim();
        if (!text) return;

        const userMsg: Message = { id: Date.now(), text, sender: 'user', time: now() };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        try {
            const history: AIMessage[] = messages.map(m => ({
                role: m.sender === 'user' ? 'user' : 'assistant',
                content: m.text
            }));

            const response = await aiService.getResponse(text, history);

            setTimeout(() => {
                const aiMsg: Message = { id: Date.now() + 1, text: response, sender: 'ai', time: now() };
                setMessages(prev => [...prev, aiMsg]);
                setIsTyping(false);
            }, 800);
        } catch (error) {
            console.error('Error en el Cerebro:', error);
            setIsTyping(false);
        }
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
                        style={{
                            position: 'fixed', bottom: 90, right: 24, zIndex: 150,
                            width: 360, background: 'var(--color-surface)',
                            borderRadius: 24, boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                            border: '1px solid var(--color-border)',
                            overflow: 'hidden', display: 'flex', flexDirection: 'column',
                            maxHeight: isMinimized ? 64 : 520,
                            transition: 'max-height 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1)',
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
                                <motion.div
                                    animate={{ y: [0, -4, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    style={{ width: 42, height: 42, borderRadius: '14px', background: 'rgba(255,255,255,0.1)', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.2)' }}
                                >
                                    <img src="/assets/cerebro-mascot.png" alt="Cerebro" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </motion.div>
                                <div>
                                    <p style={{ fontSize: 15, fontWeight: 700, color: 'white', margin: 0 }}>Cerebro Intelligence</p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <motion.span
                                            animate={{ opacity: [1, 0.5, 1], scale: [1, 1.2, 1] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                            style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ADE80', display: 'inline-block' }}
                                        />
                                        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>Ecosistema Activo</span>
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: 8, position: 'relative', zIndex: 1 }}>
                                <button
                                    onClick={() => setIsMinimized(!isMinimized)}
                                    style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', transition: 'background 0.2s' }}
                                >
                                    <Minimize2 size={16} />
                                </button>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', transition: 'background 0.2s' }}
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </div>

                        {!isMinimized && (
                            <>
                                <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px 10px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                                    {messages.map(msg => (
                                        <div key={msg.id} style={{ display: 'flex', gap: 10, flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row', alignItems: 'flex-start' }}>
                                            <div style={{
                                                width: 32, height: 32, borderRadius: '10px', flexShrink: 0,
                                                background: msg.sender === 'ai' ? 'var(--color-navy)' : 'var(--color-surface-2)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                overflow: 'hidden', border: '1px solid var(--color-border)',
                                                marginTop: 4
                                            }}>
                                                {msg.sender === 'ai' ? (
                                                    <img src="/assets/cerebro-mascot.png" alt="AI" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                ) : (
                                                    <User size={16} color="var(--color-navy)" />
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
                                                <p style={{ fontSize: 10, color: 'var(--color-text-muted)', marginTop: 4, textAlign: msg.sender === 'user' ? 'right' : 'left', fontWeight: 500 }}>
                                                    {msg.time}
                                                </p>
                                            </div>
                                        </div>
                                    ))}

                                    {isTyping && (
                                        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                                            <div style={{ width: 32, height: 32, borderRadius: '10px', background: 'var(--color-navy)', overflow: 'hidden' }}>
                                                <img src="/assets/cerebro-mascot.png" alt="AI" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            </div>
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

                                <div style={{ padding: '0 18px 12px', display: 'flex', gap: 8, overflowX: 'auto', flexShrink: 0, scrollbarWidth: 'none' }}>
                                    {[
                                        { l: '¿Cómo subo de nivel?', v: 'nivel' },
                                        { l: 'Saldo actual', v: 'saldo' },
                                        { l: 'Precios VIP', v: 'vip' }
                                    ].map(s => (
                                        <button
                                            key={s.v}
                                            onClick={() => setInput(s.l)}
                                            style={{
                                                padding: '6px 14px', borderRadius: 12, border: '1px solid var(--color-border)',
                                                background: 'var(--color-surface)', fontSize: 12, fontWeight: 600,
                                                color: 'var(--color-text-muted)', cursor: 'pointer', whiteSpace: 'nowrap',
                                                flexShrink: 0, transition: 'all 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                                            }}
                                        >
                                            {s.l}
                                        </button>
                                    ))}
                                </div>

                                <div style={{ padding: '12px 18px 18px', borderTop: '1px solid var(--color-border)', display: 'flex', gap: 10, flexShrink: 0 }}>
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
                                            outline: 'none',
                                            transition: 'border-color 0.2s'
                                        }}
                                    />
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleSend}
                                        style={{
                                            width: 46, height: 46, borderRadius: 14, background: 'var(--color-navy)', border: 'none',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0,
                                            boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
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

            {/* FAB Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => { setIsOpen(!isOpen); setIsMinimized(false); }}
                style={{
                    position: 'fixed', bottom: 24, right: 24, zIndex: 150,
                    width: 64, height: 64, borderRadius: '22px',
                    background: 'var(--color-navy)', boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                    border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: 0, overflow: 'hidden'
                }}
            >
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                            <X size={28} color="white" />
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
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        style={{ position: 'absolute', top: 6, right: 6, width: 14, height: 14, background: '#4ADE80', borderRadius: '50%', border: '2px solid var(--color-navy)' }}
                    />
                )}
            </motion.button>
        </>
    );
}
