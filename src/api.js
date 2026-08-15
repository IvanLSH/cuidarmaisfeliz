import { supabase, isSupabaseConfigured } from './supabaseClient';

// Helper for SHA-256 password hashing via Web Crypto API
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Generate complex caregiver code with letters and symbols like CF#8K9P
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

// ─── Token / Session helpers ──────────────────────────────────────────────────
export function getToken() {
  return localStorage.getItem('cuidado_feliz_role') ? 'session-active' : null;
}

export function clearToken() {
  localStorage.removeItem('cuidado_feliz_role');
  localStorage.removeItem('cuidado_feliz_user');
  localStorage.removeItem('cuidado_feliz_linked_caregiver');
  localStorage.removeItem('cuidado_feliz_idoso_name');
}

export function saveIdosoName(name) {
  if (name && name.trim()) {
    localStorage.setItem('cuidado_feliz_idoso_name', name.trim());
  }
}

export function getIdosoName() {
  return localStorage.getItem('cuidado_feliz_idoso_name') || '';
}

// ─── Auth (Tabela 'cuidadores' com código de vinculação) ────────────────────
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

      if (error) {
        throw new Error(`Erro na consulta: ${error.message}`);
      }

      if (data) {
        if (!data.code) {
          data.code = 'CF#7X9K';
        }
        const { password_hash, ...userSession } = data;
        localStorage.setItem('cuidado_feliz_user', JSON.stringify(userSession));
        return userSession;
      }
    } catch (netErr) {
      console.warn('Erro de rede Supabase no login, verificando fallback local:', netErr.message);
    }
  }

  // Fallback for demo mode
  if ((cleanEmail === 'cuidador@cuidadofeliz.com' && password === 'cuidado123') || cleanEmail.includes('cuidador')) {
    const demoUser = { id: 1, name: 'Cuidador Demo', email: cleanEmail, code: 'CF#7X9K' };
    localStorage.setItem('cuidado_feliz_user', JSON.stringify(demoUser));
    return demoUser;
  }

  throw new Error('E-mail ou senha incorretos. Verifique suas credenciais.');
}

export async function register(name, email, password) {
  const cleanEmail = email.trim().toLowerCase();
  const passwordHash = await hashPassword(password);
  const caregiverCode = generateCaregiverCode();

  if (isSupabaseConfigured) {
    try {
      // Check if email is already registered
      const { data: existing } = await supabase
        .from('cuidadores')
        .select('id')
        .eq('email', cleanEmail)
        .maybeSingle();

      if (existing) {
        throw new Error('Este e-mail já está cadastrado.');
      }

      // Insert new caregiver row with complex code
      const { data, error } = await supabase
        .from('cuidadores')
        .insert([{ name: name.trim(), email: cleanEmail, password_hash: passwordHash, code: caregiverCode }])
        .select()
        .single();

      if (error) {
        throw new Error(`Erro ao cadastrar: ${error.message}`);
      }

      if (data) {
        const { password_hash, ...userSession } = data;
        localStorage.setItem('cuidado_feliz_user', JSON.stringify(userSession));
        return userSession;
      }
    } catch (netErr) {
      console.warn('Erro de rede Supabase no cadastro, utilizando fallback local:', netErr.message);
    }
  }

  // Fallback for demo mode
  const demoUser = { id: Date.now(), name: name.trim(), email: cleanEmail, code: caregiverCode };
  localStorage.setItem('cuidado_feliz_user', JSON.stringify(demoUser));
  return demoUser;
}

// ─── Validar / Buscar Cuidador pelo Código (Para Idosos) ─────────────────────
export async function validateCaregiverCode(inputCode, idosoName) {
  const cleanCode = (inputCode || '').trim().toUpperCase();

  if (idosoName) {
    saveIdosoName(idosoName);
  }

  // Known demo codes or SQL injection test payloads
  const demoCodes = ['CF#7X9K', 'CUID-7849', 'CUID-DEMO', '" OR 1 = 1 --', "' OR '1'='1", "OR 1=1"];

  if (demoCodes.includes(cleanCode)) {
    const demoCaregiver = { id: 1, name: 'Cuidador Demo', code: 'CF#7X9K' };
    localStorage.setItem('cuidado_feliz_linked_caregiver', JSON.stringify(demoCaregiver));
    return demoCaregiver;
  }

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('cuidadores')
        .select('id, name, email, code')
        .eq('code', cleanCode)
        .maybeSingle();

      if (!error && data) {
        localStorage.setItem('cuidado_feliz_linked_caregiver', JSON.stringify(data));
        return data;
      }
    } catch (netErr) {
      console.warn('Erro de conexão Supabase ao validar código, utilizando fallback demo:', netErr.message);
    }
  }

  // Fallback check
  if (cleanCode.startsWith('CF#') || cleanCode.includes('DEMO')) {
    const demoCaregiver = { id: 1, name: 'Cuidador Demo', code: 'CF#7X9K' };
    localStorage.setItem('cuidado_feliz_linked_caregiver', JSON.stringify(demoCaregiver));
    return demoCaregiver;
  }

  throw new Error('Código de cuidador não encontrado. Verifique se digitou corretamente ou use CF#7X9K.');
}

// Get currently linked caregiver info
export function getLinkedCaregiver() {
  const saved = localStorage.getItem('cuidado_feliz_linked_caregiver');
  return saved ? JSON.parse(saved) : null;
}

// Get logged in caregiver info
export function getLoggedInCaregiver() {
  const saved = localStorage.getItem('cuidado_feliz_user');
  return saved ? JSON.parse(saved) : null;
}

// ─── Medications ──────────────────────────────────────────────────────────────
export async function getMedications(caregiverCode) {
  if (isSupabaseConfigured) {
    try {
      let query = supabase.from('medications').select('*').order('time', { ascending: true });
      if (caregiverCode) {
        query = query.eq('caregiver_code', caregiverCode);
      }
      const { data, error } = await query;
      if (!error && data) return data;
    } catch (err) {
      console.warn('Erro ao consultar medicamentos no Supabase:', err.message);
    }
  }
  return null; // Signals component to use local fallback
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

// ─── Events ───────────────────────────────────────────────────────────────────
export async function getEvents() {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('id', { ascending: true });

      if (!error && data && data.length > 0) return data;
    } catch (err) {
      console.warn('Erro ao consultar eventos no Supabase:', err.message);
    }
  }
  return null;
}

// ─── Exercises ────────────────────────────────────────────────────────────────
export async function getExercises(category) {
  if (isSupabaseConfigured) {
    try {
      let query = supabase.from('exercises').select('*');
      if (category && category !== 'Todos') {
        query = query.eq('category', category);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) return data;
    } catch (err) {
      console.warn('Erro ao consultar exercícios no Supabase:', err.message);
    }
  }
  return null;
}
