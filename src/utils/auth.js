/**
 * Password Gate for /exam and /daily
 * Password: 108
 */

const AUTH_KEY = 'ayush_editor_unlocked_108';
const SECRET_PASS = '108';

export function isEditorAuthenticated() {
  try {
    return localStorage.getItem(AUTH_KEY) === 'true';
  } catch {
    return false;
  }
}

export function loginWithPassword(pass) {
  if (pass && pass.trim() === SECRET_PASS) {
    try {
      localStorage.setItem(AUTH_KEY, 'true');
    } catch {}
    return { success: true };
  }
  return { success: false, error: 'Incorrect password. Access denied.' };
}

export function logoutEditor() {
  try {
    localStorage.removeItem(AUTH_KEY);
    // clean up legacy keys
    localStorage.removeItem('ayush_editor_authorized_email');
    localStorage.removeItem('ayush_admin_authenticated_v1');
  } catch {}
}
