'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Minimize2 } from 'lucide-react';

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'ai';
    time: string;
}

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
            // Convert history for AI Service
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
                            width: 340, background: 'var(--color-surface)',
                            borderRadius: 20, boxShadow: 'var(--shadow-xl)',
                            border: '1px solid var(--color-border)',
                            overflow: 'hidden', display: 'flex', flexDirection: 'column',
                            maxHeight: isMinimized ? 56 : 440,
                            transition: 'max-height 0.3s ease',
                        }}
                    >
                        {/* Header */}
                        <div style={{
                            padding: '14px 18px', background: 'var(--color-navy)',
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            flexShrink: 0,
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Bot size={18} color="white" />
                                </div>
                                <div>
                                    <p style={{ fontSize: 14, fontWeight: 700, color: 'white' }}>Asistente TrueCoin</p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ADE80' }} />
                                        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>En línea</span>
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: 6 }}>
                                <button
                                    onClick={() => setIsMinimized(!isMinimized)}
                                    style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}
                                >
                                    <Minimize2 size={14} />
                                </button>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        </div>

                        {!isMinimized && (
                            <>
                                {/* Messages */}
                                <div style={{ flex: 1, overflowY: 'auto', padding: '14px 14px 8px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    {messages.map(msg => (
                                        <div key={msg.id} style={{ display: 'flex', gap: 8, flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row', alignItems: 'flex-end' }}>
                                            <div style={{
                                                width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                                                background: msg.sender === 'ai' ? 'var(--color-navy)' : 'var(--color-cloud-blue)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            }}>
                                                {msg.sender === 'ai' ? <Bot size={14} color="white" /> : <User size={14} color="white" />}
                                            </div>
                                            <div style={{ maxWidth: '75%' }}>
                                                <div style={{
                                                    padding: '9px 13px', borderRadius: msg.sender === 'ai' ? '16px 16px 16px 4px' : '16px 16px 4px 16px',
                                                    background: msg.sender === 'ai' ? 'var(--color-surface-2)' : 'var(--color-navy)',
                                                    color: msg.sender === 'ai' ? 'var(--color-text)' : 'white',
                                                    fontSize: 13, lineHeight: 1.5,
                                                }}>
                                                    {msg.text}
                                                </div>
                                                <p style={{ fontSize: 10, color: 'var(--color-text-muted)', marginTop: 3, textAlign: msg.sender === 'user' ? 'right' : 'left', paddingLeft: 4 }}>
                                                    {msg.time}
                                                </p>
                                            </div>
                                        </div>
                                    ))}

                                    {isTyping && (
                                        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
                                            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--color-navy)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Bot size={14} color="white" />
                                            </div>
                                            <div style={{ padding: '10px 14px', background: 'var(--color-surface-2)', borderRadius: '16px 16px 16px 4px', display: 'flex', gap: 4 }}>
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

                                {/* Quick Suggestions */}
                                <div style={{ padding: '0 12px 8px', display: 'flex', gap: 6, overflowX: 'auto', flexShrink: 0 }}>
                                    {['Mi saldo', 'Referidos', 'Marketplace'].map(s => (
                                        <button
                                            key={s}
                                            onClick={() => setInput(s)}
                                            style={{
                                                padding: '4px 10px', borderRadius: 999, border: '1px solid var(--color-border)',
                                                background: 'var(--color-surface)', fontSize: 11, fontWeight: 600,
                                                color: 'var(--color-text-muted)', cursor: 'pointer', whiteSpace: 'nowrap',
                                                flexShrink: 0,
                                            }}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>

                                {/* Input */}
                                <div style={{ padding: '8px 12px 12px', borderTop: '1px solid var(--color-border)', display: 'flex', gap: 8, flexShrink: 0 }}>
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={e => setInput(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && handleSend()}
                                        placeholder="Escribe tu pregunta..."
                                        className="input"
                                        style={{ flex: 1 }}
                                    />
                                    <button
                                        onClick={handleSend}
                                        style={{
                                            width: 40, height: 40, borderRadius: 10, background: 'var(--color-navy)', border: 'none',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0,
                                        }}
                                    >
                                        <Send size={16} color="white" />
                                    </button>
                                </div>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* FAB Button */}
            <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { setIsOpen(!isOpen); setIsMinimized(false); }}
                style={{
                    position: 'fixed', bottom: 24, right: 24, zIndex: 150,
                    width: 56, height: 56, borderRadius: '50%',
                    background: 'var(--color-navy)', boxShadow: 'var(--shadow-lg)',
                    border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
            >
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                            <X size={22} color="white" />
                        </motion.span>
                    ) : (
                        <motion.span key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                            <MessageCircle size={22} color="white" />
                        </motion.span>
                    )}
                </AnimatePresence>
                {!isOpen && (
                    <span style={{ position: 'absolute', top: 0, right: 0, width: 14, height: 14, background: '#4ADE80', borderRadius: '50%', border: '2px solid white' }} />
                )}
            </motion.button>
        </>
    );
}
