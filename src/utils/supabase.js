import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY
const SERVICE_ROLE = import.meta.env.VITE_SUPABASE_SERVICE_ROLE;


const supabase = createClient(SUPABASE_URL, SUPABASE_KEY,{
  db: { schema: 'unitechouses' },
});
const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE,{
  db: { schema: 'unitechouses' },
});

export async function createUser(email, password) {
  const { data: list, error: listError } = await supabaseAdmin.auth.admin.listUsers();

  if (listError) throw listError;

  const existingUser = list.users.find((u) => u.email === email);

  if (existingUser) {
    const {error} = supabaseAdmin.auth.admin.updateUserById(existingUser.id, {password: password});
    return { id: existingUser.id, alreadyExists: true };
  }

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (error) throw error;
  return { id: data.user.id, alreadyExists: false };
}


export async function updateUserPassword(userId, newPassword) {
  try {
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      password: newPassword,
    });

    if (error) throw error;
    return data;
  } catch (err) {
    console.error("Error updating password:", err);
    return null;
  }
}

export async function deleteUser(userId) {
  try {
    const { data, error } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (error) throw error;
    return data;
  } catch (err) {
    console.error("Error deleting user:", err);
    return null;
  }
}

export default supabase;
