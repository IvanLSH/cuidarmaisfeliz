import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  getChatMessages,
  sendChatMessage,
  getLoggedInCaregiver,
  getLoggedInIdoso,
  getLinkedCaregiver,
  getIdosoName,
  getIdososByCaregiver,
} from '../api';

function formatTime(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

function formatDate(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (d.toDateString() === today.toDateString()) return 'Hoje';
  if (d.toDateString() === yesterday.toDateString()) return 'Ontem';
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function groupMessagesByDate(messages) {
  const groups = [];
  let lastLabel = null;
  for (const msg of messages) {
    const label = formatDate(msg.created_at);
    if (label !== lastLabel) {
      groups.push({ type: 'date', label });
      lastLabel = label;
    }
    groups.push({ type: 'message', data: msg });
  }
  return groups;
}

function Avatar({ name, role }) {
  const initials = (name || '?')
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
  const bg = role === 'cuidador' ? 'bg-blue-700' : 'bg-emerald-700';
  return (
    <div className={`${bg} w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black shrink-0`}>
      {initials}
    </div>
  );
}

function IdosoListItem({ idoso, isActive, onClick, unread }) {
  const initials = (idoso.name || '?')
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all cursor-pointer rounded-xl ${
        isActive
          ? 'bg-blue-700 dark:bg-blue-800 text-white shadow-md'
          : 'text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
      }`}
    >
      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm shrink-0 ${
        isActive ? 'bg-white text-blue-700' : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
      }`}>
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-black text-sm truncate">{idoso.name}</p>
        <p className={`text-xs font-bold truncate ${isActive ? 'text-blue-200' : 'text-slate-500 dark:text-slate-400'}`}>
          {idoso.code}
        </p>
      </div>
      {unread > 0 && (
        <span className="bg-red-500 text-white text-xs font-black rounded-full w-5 h-5 flex items-center justify-center shrink-0">
          {unread}
        </span>
      )}
    </button>
  );
}

export default function ChatPage({ onNavigate, userRole }) {
  const isIdoso = userRole === 'idoso';

  const caregiver = getLoggedInCaregiver();
  const idoso = getLoggedInIdoso();
  const linkedCaregiver = getLinkedCaregiver();
  const idosoName = getIdosoName();

  const [idososList, setIdososList] = useState([]);
  const [selectedIdoso, setSelectedIdoso] = useState(null);

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const pollingRef = useRef(null);

  useEffect(() => {
    if (!isIdoso && caregiver) {
      getIdososByCaregiver(caregiver.code).then((list) => {
        setIdososList(list || []);
        if (list && list.length > 0) setSelectedIdoso(list[0]);
      });
    }
  }, [isIdoso, caregiver]);

  const activeCaregiverCode = isIdoso
    ? linkedCaregiver?.code
    : caregiver?.code;

  const activeIdosoCode = isIdoso
    ? idoso?.code
    : selectedIdoso?.code;

  const loadMessages = useCallback(async () => {
    if (!activeCaregiverCode || !activeIdosoCode) return;
    try {
      const data = await getChatMessages(activeCaregiverCode, activeIdosoCode);
      setMessages(data || []);
    } catch (err) {
      console.warn('Erro ao carregar mensagens');
    } finally {
      setLoading(false);
    }
  }, [activeCaregiverCode, activeIdosoCode]);

  useEffect(() => {
    setLoading(true);
    setMessages([]);
    loadMessages();

    if (pollingRef.current) clearInterval(pollingRef.current);
    pollingRef.current = setInterval(loadMessages, 3000);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [loadMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || sending || !activeCaregiverCode || !activeIdosoCode) return;

    setSending(true);
    const senderRole = isIdoso ? 'idoso' : 'cuidador';
    const senderName = isIdoso ? (idosoName || idoso?.name || 'Idoso') : (caregiver?.name || 'Cuidador');
    const content = inputText.trim();
    setInputText('');

    const optimistic = {
      id: `opt-${Date.now()}`,
      caregiver_code: activeCaregiverCode,
      idoso_code: activeIdosoCode,
      sender_role: senderRole,
      sender_name: senderName,
      content,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);

    try {
      await sendChatMessage(activeCaregiverCode, activeIdosoCode, senderRole, senderName, content);
      await loadMessages();
    } catch (err) {
      console.warn('Erro ao enviar mensagem');
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  const grouped = groupMessagesByDate(messages);

  return (
    <div className="bg-slate-100 dark:bg-slate-950 min-h-screen flex flex-col transition-colors">
      <div className="max-w-5xl w-full mx-auto flex flex-col flex-1 h-[calc(100vh-130px)]">

        {!isIdoso ? (
          <div className="flex flex-1 overflow-hidden rounded-2xl shadow-xl border-2 border-slate-300 dark:border-slate-800 m-4 bg-white dark:bg-slate-900">

            <aside className="w-64 shrink-0 border-r-2 border-slate-200 dark:border-slate-800 flex flex-col bg-slate-50 dark:bg-slate-900/50">
              <div className="px-4 py-4 border-b-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <h2 className="font-black text-slate-950 dark:text-white text-base">Conversas</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-bold mt-0.5">{idososList.length} idoso(s) vinculado(s)</p>
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {idososList.length === 0 ? (
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-bold text-center py-6 px-3">
                    Nenhum idoso cadastrado ainda. Use "+ Cadastrar Idoso" no menu.
                  </p>
                ) : (
                  idososList.map((i) => (
                    <IdosoListItem
                      key={i.id}
                      idoso={i}
                      isActive={selectedIdoso?.id === i.id}
                      onClick={() => { setSelectedIdoso(i); setLoading(true); }}
                    />
                  ))
                )}
              </div>
            </aside>

            <div className="flex-1 flex flex-col overflow-hidden">
              {selectedIdoso ? (
                <>
                  <div className="px-5 py-3.5 border-b-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-3 shrink-0">
                    <div className="w-9 h-9 rounded-full bg-emerald-700 text-white flex items-center justify-center font-black text-sm">
                      {(selectedIdoso.name || '?').split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()}
                    </div>
                    <div>
                      <p className="font-black text-slate-950 dark:text-white text-sm">{selectedIdoso.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">Código: {selectedIdoso.code}</p>
                    </div>
                    <div className="ml-auto flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block"></span>
                      <span className="text-xs text-emerald-700 dark:text-emerald-400 font-black">Ao Vivo</span>
                    </div>
                  </div>

                  <MessageList grouped={grouped} loading={loading} myRole="cuidador" bottomRef={bottomRef} />

                  <ChatInput
                    inputText={inputText}
                    setInputText={setInputText}
                    handleSend={handleSend}
                    sending={sending}
                    inputRef={inputRef}
                    isIdoso={false}
                  />
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-slate-400">
                  <div className="text-center space-y-3">
                    <svg className="w-14 h-14 mx-auto text-slate-300 dark:text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <p className="font-black text-slate-500 dark:text-slate-400">Selecione um idoso para iniciar uma conversa</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col flex-1 overflow-hidden rounded-2xl shadow-xl border-2 border-slate-300 dark:border-slate-800 m-4 bg-white dark:bg-slate-900">
            <div className="px-5 py-4 border-b-2 border-slate-200 dark:border-slate-800 bg-blue-800 dark:bg-blue-950 text-white flex items-center gap-3 shrink-0 rounded-t-2xl">
              <div className="w-10 h-10 rounded-full bg-white text-blue-800 flex items-center justify-center font-black text-sm">
                {(linkedCaregiver?.name || 'C').split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase()}
              </div>
              <div>
                <p className="font-black text-white text-lg">{linkedCaregiver?.name || 'Seu Cuidador'}</p>
                <p className="text-xs text-blue-200 font-bold">Cuidador Responsável</p>
              </div>
              <div className="ml-auto flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse inline-block"></span>
                <span className="text-sm text-emerald-300 font-black">Online</span>
              </div>
            </div>

            <MessageList grouped={grouped} loading={loading} myRole="idoso" bottomRef={bottomRef} isIdoso />

            <ChatInput
              inputText={inputText}
              setInputText={setInputText}
              handleSend={handleSend}
              sending={sending}
              inputRef={inputRef}
              isIdoso={true}
            />
          </div>
        )}

        <div className="text-center pb-6">
          <button
            onClick={() => onNavigate && onNavigate('home')}
            className="px-6 py-3 bg-slate-900 dark:bg-slate-800 hover:bg-slate-950 text-white font-black text-base rounded-2xl shadow border-2 border-slate-950 dark:border-slate-700 transition cursor-pointer inline-flex items-center gap-2"
          >
            <span>← Voltar à Página Inicial</span>
          </button>
        </div>

      </div>
    </div>
  );
}

function MessageList({ grouped, loading, myRole, bottomRef, isIdoso }) {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1 bg-slate-50 dark:bg-slate-950">
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <div className="flex flex-col items-center gap-3 text-slate-400">
            <svg className="w-8 h-8 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <p className="font-bold text-sm">Carregando mensagens...</p>
          </div>
        </div>
      ) : grouped.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center space-y-2 text-slate-400">
            <svg className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="font-bold text-sm">Sem mensagens ainda. Diga olá!</p>
          </div>
        </div>
      ) : (
        grouped.map((item, idx) => {
          if (item.type === 'date') {
            return (
              <div key={`date-${idx}`} className="flex items-center justify-center my-3">
                <span className="px-3 py-1 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-black rounded-full">
                  {item.label}
                </span>
              </div>
            );
          }

          const msg = item.data;
          const isMe = msg.sender_role === myRole;

          return (
            <div
              key={msg.id}
              className={`flex items-end gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {!isMe && <Avatar name={msg.sender_name} role={msg.sender_role} />}

              <div className={`max-w-[75%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                {!isMe && (
                  <span className="text-xs font-black text-slate-500 dark:text-slate-400 mb-1 ml-1">{msg.sender_name}</span>
                )}
                <div className={`px-4 py-2.5 rounded-2xl shadow-sm ${
                  isMe
                    ? 'bg-blue-700 dark:bg-blue-600 text-white rounded-br-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-bl-sm'
                } ${isIdoso ? 'text-lg' : 'text-sm'}`}>
                  <p className={`font-medium leading-relaxed ${isIdoso ? 'text-lg' : 'text-sm'}`}>
                    {msg.content}
                  </p>
                </div>
                <span className="text-xs text-slate-400 font-bold mt-1 mx-1">
                  {formatTime(msg.created_at)}
                </span>
              </div>
            </div>
          );
        })
      )}
      <div ref={bottomRef} />
    </div>
  );
}

function ChatInput({ inputText, setInputText, handleSend, sending, inputRef, isIdoso }) {
  return (
    <form
      onSubmit={handleSend}
      className="px-4 py-3 border-t-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-3 shrink-0"
    >
      <input
        ref={inputRef}
        type="text"
        value={inputText}
        onChange={
        (e) => setInputText(e.target.value)}
        placeholder={isIdoso ? 'Escreva uma mensagem...' : 'Digite sua mensagem...'}
        autoComplete="off"
        className={`flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-2xl font-medium text-slate-950 dark:text-white focus:border-blue-600 outline-none transition ${
          isIdoso ? 'text-lg' : 'text-sm'
        }`}
      />
      <button
        type="submit"
        disabled={sending || !inputText.trim()}
        className={`shrink-0 rounded-2xl font-black transition flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
          isIdoso
            ? 'w-14 h-14 bg-blue-700 dark:bg-blue-600 hover:bg-blue-800 text-white'
            : 'w-11 h-11 bg-blue-700 dark:bg-blue-600 hover:bg-blue-800 text-white'
        }`}
      >
        <svg className={isIdoso ? 'w-7 h-7' : 'w-5 h-5'} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      </button>
    </form>
  );
}
