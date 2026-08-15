import { supabase, isSupabaseConfigured } from './supabaseClient';

// Helper for SHA-256 password hashing via Web Crypto API
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// ─── Token / Session helpers ──────────────────────────────────────────────────
export function getToken() {
  return localStorage.getItem('cuidado_feliz_role') ? 'session-active' : null;
}

export function clearToken() {
  localStorage.removeItem('cuidado_feliz_role');
  localStorage.removeItem('cuidado_feliz_user');
}

// ─── Auth (usando a tabela 'cuidadores' com hash de senha SHA-256) ───────────
export async function login(email, password) {
  const cleanEmail = email.trim().toLowerCase();
  const passwordHash = await hashPassword(password);

  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('cuidadores')
      .select('*')
      .eq('email', cleanEmail)
      .eq('password_hash', passwordHash)
      .maybeSingle();

    if (error) {
      throw new Error(`Erro na consulta: ${error.message}`);
    }

    if (!data) {
      throw new Error('E-mail ou senha incorretos. Verifique suas credenciais.');
    }

    // Never keep password hash in localStorage session
    const { password_hash, ...userSession } = data;
    localStorage.setItem('cuidado_feliz_user', JSON.stringify(userSession));
    return userSession;
  }

  // Fallback for demo mode
  if (cleanEmail === 'cuidador@cuidadofeliz.com' && password === 'cuidado123') {
    const demoUser = { id: 1, name: 'Cuidador Demo', email: cleanEmail };
    localStorage.setItem('cuidado_feliz_user', JSON.stringify(demoUser));
    return demoUser;
  }

  throw new Error('E-mail ou senha incorretos. Verifique suas credenciais.');
}

export async function register(name, email, password) {
  const cleanEmail = email.trim().toLowerCase();
  const passwordHash = await hashPassword(password);

  if (isSupabaseConfigured) {
    // Check if email is already registered in 'cuidadores'
    const { data: existing } = await supabase
      .from('cuidadores')
      .select('id')
      .eq('email', cleanEmail)
      .maybeSingle();

    if (existing) {
      throw new Error('Este e-mail já está cadastrado.');
    }

    // Insert new caregiver row into 'cuidadores' with password_hash
    const { data, error } = await supabase
      .from('cuidadores')
      .insert([{ name: name.trim(), email: cleanEmail, password_hash: passwordHash }])
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao cadastrar: ${error.message}`);
    }

    const { password_hash, ...userSession } = data;
    localStorage.setItem('cuidado_feliz_user', JSON.stringify(userSession));
    return userSession;
  }

  // Fallback for demo mode
  const demoUser = { id: Date.now(), name: name.trim(), email: cleanEmail };
  localStorage.setItem('cuidado_feliz_user', JSON.stringify(demoUser));
  return demoUser;
}

// ─── Medications ──────────────────────────────────────────────────────────────
export async function getMedications() {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('medications')
      .select('*')
      .order('time', { ascending: true });
      
    if (!error && data) return data;
  }
  return null; // Signals component to use local fallback
}

export async function createMedication(payload) {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('medications')
      .insert([payload])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }
  return null;
}

export async function toggleMedicationTaken(id, currentTaken) {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('medications')
      .update({ taken: !currentTaken })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }
  return null;
}

export async function deleteMedication(id) {
  if (isSupabaseConfigured) {
    const { error } = await supabase
      .from('medications')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
    return true;
  }
  return true;
}

// ─── Events ───────────────────────────────────────────────────────────────────
export async function getEvents() {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('id', { ascending: true });

    if (!error && data && data.length > 0) return data;
  }
  return null;
}

// ─── Exercises ────────────────────────────────────────────────────────────────
export async function getExercises(category) {
  if (isSupabaseConfigured) {
    let query = supabase.from('exercises').select('*');
    if (category && category !== 'Todos') {
      query = query.eq('category', category);
    }
    const { data, error } = await query;
    if (!error && data && data.length > 0) return data;
  }
  return null;
}
