import { supabase, isSupabaseConfigured } from './supabaseClient';

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export function generateCaregiverCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const symbols = ['#', '@', '$', '!'];
  const sym = symbols[Math.floor(Math.random() * symbols.length)];
  let code = 'CF' + sym;
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function generateIdosoCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const symbols = ['#', '@', '$', '!'];
  const sym = symbols[Math.floor(Math.random() * symbols.length)];
  let code = 'ID' + sym;
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function getToken() {
  return localStorage.getItem('cuidado_feliz_role') ? 'session-active' : null;
}

export function clearToken() {
  localStorage.removeItem('cuidado_feliz_role');
  localStorage.removeItem('cuidado_feliz_user');
  localStorage.removeItem('cuidado_feliz_linked_caregiver');
  localStorage.removeItem('cuidado_feliz_idoso_user');
  localStorage.removeItem('cuidado_feliz_idoso_name');
}

export function saveIdosoName(name) {
  if (name && name.trim()) {
    localStorage.setItem('cuidado_feliz_idoso_name', name.trim());
  }
}

export function getIdosoName() {
  const user = getLoggedInIdoso();
  if (user && user.name) return user.name;
  return localStorage.getItem('cuidado_feliz_idoso_name') || '';
}

export function getLoggedInIdoso() {
  const saved = localStorage.getItem('cuidado_feliz_idoso_user');
  return saved ? JSON.parse(saved) : null;
}

export async function login(email, password) {
  const cleanEmail = email.trim().toLowerCase();
  const passwordHash = await hashPassword(password);

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('cuidadores')
        .select('*')
        .eq('email', cleanEmail)
        .eq('password_hash', passwordHash)
        .maybeSingle();

      if (error) throw new Error(error.message);

      if (data) {
        if (!data.code) data.code = generateCaregiverCode();
        const { password_hash, ...userSession } = data;
        localStorage.setItem('cuidado_feliz_user', JSON.stringify(userSession));
        return userSession;
      }
    } catch (netErr) {
      console.warn('Erro de rede Supabase no login:', netErr.message);
    }
  }

  const savedUser = localStorage.getItem('cuidado_feliz_user');
  if (savedUser) {
    const user = JSON.parse(savedUser);
    if (user.email === cleanEmail) {
      return user;
    }
  }

  throw new Error('E-mail ou senha incorretos. Verifique suas credenciais.');
}

export async function register(name, email, password) {
  const cleanEmail = email.trim().toLowerCase();
  const passwordHash = await hashPassword(password);
  const caregiverCode = generateCaregiverCode();

  if (isSupabaseConfigured) {
    try {
      const { data: existing } = await supabase
        .from('cuidadores')
        .select('id')
        .eq('email', cleanEmail)
        .maybeSingle();

      if (existing) throw new Error('Este e-mail já está cadastrado.');

      const { data, error } = await supabase
        .from('cuidadores')
        .insert([{ name: name.trim(), email: cleanEmail, password_hash: passwordHash, code: caregiverCode }])
        .select()
        .single();

      if (error) throw new Error(error.message);

      if (data) {
        const { password_hash, ...userSession } = data;
        localStorage.setItem('cuidado_feliz_user', JSON.stringify(userSession));
        return userSession;
      }
    } catch (netErr) {
      console.warn('Erro de rede Supabase no cadastro:', netErr.message);
    }
  }

  const localUser = { id: Date.now(), name: name.trim(), email: cleanEmail, code: caregiverCode };
  localStorage.setItem('cuidado_feliz_user', JSON.stringify(localUser));
  return localUser;
}

export async function registerIdoso(name, caregiverCode, caregiverName) {
  const cleanName = name.trim();
  const idosoCode = generateIdosoCode();
  const cCode = caregiverCode || 'CF#7X9K';
  const cName = caregiverName || 'Cuidador';

  const existingList = await getIdososByCaregiver(cCode);
  if (existingList && existingList.length >= 3) {
    throw new Error('Limite máximo de 3 idosos cadastrados por cuidador atingido.');
  }

  const newIdoso = {
    name: cleanName,
    caregiver_code: cCode,
    caregiver_name: cName,
    code: idosoCode,
  };

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('idosos')
        .insert([newIdoso])
        .select()
        .single();

      if (error) throw new Error(error.message);
      if (data) return data;
    } catch (netErr) {
      console.warn('Erro de rede Supabase ao cadastrar idoso, usando localStorage:', netErr.message);
    }
  }

  const localList = JSON.parse(localStorage.getItem('cuidado_feliz_idosos_list') || '[]');
  const localIdoso = { id: Date.now(), ...newIdoso };
  localList.push(localIdoso);
  localStorage.setItem('cuidado_feliz_idosos_list', JSON.stringify(localList));
  return localIdoso;
}

export async function getIdososByCaregiver(caregiverCode) {
  if (!caregiverCode) return [];

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('idosos')
        .select('*')
        .eq('caregiver_code', caregiverCode)
        .order('id', { ascending: true });

      if (!error && data) return data;
    } catch (netErr) {
      console.warn('Erro Supabase ao buscar idosos:', netErr.message);
    }
  }

  const localList = JSON.parse(localStorage.getItem('cuidado_feliz_idosos_list') || '[]');
  return localList.filter(i => i.caregiver_code === caregiverCode);
}

export async function validateIdosoCode(inputCode) {
  const cleanCode = (inputCode || '').trim().toUpperCase();

  if (!cleanCode) {
    throw new Error('Por favor, informe um código de idoso válido.');
  }

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('idosos')
        .select('*')
        .eq('code', cleanCode)
        .maybeSingle();

      if (!error && data) {
        localStorage.setItem('cuidado_feliz_idoso_user', JSON.stringify(data));
        localStorage.setItem('cuidado_feliz_linked_caregiver', JSON.stringify({ name: data.caregiver_name, code: data.caregiver_code }));
        return data;
      }
    } catch (netErr) {
      console.warn('Erro Supabase ao validar código de idoso:', netErr.message);
    }
  }

  const localList = JSON.parse(localStorage.getItem('cuidado_feliz_idosos_list') || '[]');
  const match = localList.find(i => i.code === cleanCode);
  if (match) {
    localStorage.setItem('cuidado_feliz_idoso_user', JSON.stringify(match));
    localStorage.setItem('cuidado_feliz_linked_caregiver', JSON.stringify({ name: match.caregiver_name, code: match.caregiver_code }));
    return match;
  }

  throw new Error('Código de idoso não encontrado. Verifique se o cuidador já criou seu cadastro.');
}

export function getLinkedCaregiver() {
  const saved = localStorage.getItem('cuidado_feliz_linked_caregiver');
  return saved ? JSON.parse(saved) : null;
}

export function getLoggedInCaregiver() {
  const saved = localStorage.getItem('cuidado_feliz_user');
  return saved ? JSON.parse(saved) : null;
}

export async function getMedications(caregiverCode, idosoCode) {
  if (isSupabaseConfigured) {
    try {
      let query = supabase.from('medications').select('*').order('time', { ascending: true });
      if (idosoCode) {
        query = query.eq('idoso_code', idosoCode);
      } else if (caregiverCode) {
        query = query.eq('caregiver_code', caregiverCode);
      }
      const { data, error } = await query;
      if (!error && data) return data;
    } catch (err) {
      console.warn('Erro ao consultar medicamentos no Supabase:', err.message);
    }
  }
  return null;
}

export async function createMedication(payload) {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('medications')
        .insert([payload])
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    } catch (err) {
      console.warn('Erro ao criar medicamento no Supabase:', err.message);
    }
  }
  return null;
}

export async function toggleMedicationTaken(id, currentTaken) {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('medications')
        .update({ taken: !currentTaken })
        .eq('id', id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    } catch (err) {
      console.warn('Erro ao atualizar medicamento no Supabase:', err.message);
    }
  }
  return null;
}

export async function deleteMedication(id) {
  if (isSupabaseConfigured) {
    try {
      const { error } = await supabase
        .from('medications')
        .delete()
        .eq('id', id);

      if (error) throw new Error(error.message);
      return true;
    } catch (err) {
      console.warn('Erro ao deletar medicamento no Supabase:', err.message);
    }
  }
  return true;
}

export async function getEvents() {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('id', { ascending: true });

      if (!error && data) return data;
    } catch (err) {
      console.warn('Erro ao consultar eventos no Supabase:', err.message);
    }
  }
  return null;
}

export async function getExercises(category) {
  if (isSupabaseConfigured) {
    try {
      let query = supabase.from('exercises').select('*');
      if (category && category !== 'Todos') {
        query = query.eq('category', category);
      }
      const { data, error } = await query;
      if (!error && data) return data;
    } catch (err) {
      console.warn('Erro ao consultar exercícios no Supabase:', err.message);
    }
  }
  return null;
}

function chatLocalKey(caregiverCode, idosoCode) {
  return `cuidado_feliz_chat_${caregiverCode}_${idosoCode}`;
}

function getLocalMessages(caregiverCode, idosoCode) {
  const key = chatLocalKey(caregiverCode, idosoCode);
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : [];
}

function saveLocalMessages(caregiverCode, idosoCode, messages) {
  localStorage.setItem(chatLocalKey(caregiverCode, idosoCode), JSON.stringify(messages));
}

export async function getChatMessages(caregiverCode, idosoCode) {
  if (!caregiverCode || !idosoCode) return [];

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('caregiver_code', caregiverCode)
        .eq('idoso_code', idosoCode)
        .order('created_at', { ascending: true });

      if (!error && data) return data;
    } catch (err) {
      console.warn('Erro ao buscar mensagens de chat no Supabase:', err.message);
    }
  }
  return getLocalMessages(caregiverCode, idosoCode);
}

export async function sendChatMessage(caregiverCode, idosoCode, senderRole, senderName, content) {
  const newMsg = {
    caregiver_code: caregiverCode,
    idoso_code: idosoCode,
    sender_role: senderRole,
    sender_name: senderName,
    content: content.trim(),
  };

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert([newMsg])
        .select()
        .single();

      if (!error && data) return data;
    } catch (err) {
      console.warn('Erro ao enviar mensagem no Supabase, salvando localmente:', err.message);
    }
  }

  const existing = getLocalMessages(caregiverCode, idosoCode);
  const localMsg = { id: Date.now(), ...newMsg, created_at: new Date().toISOString() };
  existing.push(localMsg);
  saveLocalMessages(caregiverCode, idosoCode, existing);
  return localMsg;
}

export async function triggerPanicAlert(caregiverCode, idosoCode, idosoName) {
  const alertData = {
    caregiver_code: caregiverCode,
    idoso_code: idosoCode,
    idoso_name: idosoName || 'Idoso',
    active: true,
    created_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('panic_alerts')
        .insert([alertData])
        .select()
        .single();
      if (!error && data) return data;
    } catch (err) {
      console.warn('Erro Supabase pânico:', err.message);
    }
  }

  const key = `cuidado_feliz_panic_${caregiverCode}`;
  const localAlert = { id: Date.now(), ...alertData };
  localStorage.setItem(key, JSON.stringify(localAlert));
  return localAlert;
}

export async function getActivePanicAlert(caregiverCode) {
  if (!caregiverCode) return null;

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('panic_alerts')
        .select('*')
        .eq('caregiver_code', caregiverCode)
        .eq('active', true)
        .order('created_at', { ascending: false })
        .maybeSingle();

      if (!error && data) return data;
    } catch (err) {
      console.warn('Erro Supabase buscando pânico:', err.message);
    }
  }

  const key = `cuidado_feliz_panic_${caregiverCode}`;
  const stored = localStorage.getItem(key);
  if (stored) {
    const alert = JSON.parse(stored);
    if (alert && alert.active) return alert;
  }
  return null;
}

export async function dismissPanicAlert(alertId, caregiverCode) {
  if (isSupabaseConfigured && alertId) {
    try {
      await supabase
        .from('panic_alerts')
        .update({ active: false })
        .eq('id', alertId);
    } catch (err) {
      console.warn('Erro Supabase fechar pânico:', err.message);
    }
  }

  const key = `cuidado_feliz_panic_${caregiverCode}`;
  localStorage.removeItem(key);
  return true;
}
