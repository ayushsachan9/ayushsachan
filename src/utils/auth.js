/**
 * Admin Authentication & Edit Mode Gate for Ayush Sachan
 * Protects /exam and /daily from unauthorized edits.
 * Default passcode: ayush2026 (stored as SHA-256 hash)
 */

// SHA-256 hash of default passcode "ayush2026"
const DEFAULT_PIN_HASH = '238f7a56ddddc237225a1c60ee2726b981c9707344546e051af7c01cc6e7a76d';
const AUTH_KEY = 'ayush_admin_authenticated_v1';
const CUSTOM_PIN_HASH_KEY = 'ayush_admin_custom_pin_hash';

export async function sha256(text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export function isEditorAuthenticated() {
  try {
    return localStorage.getItem(AUTH_KEY) === 'true';
  } catch {
    return false;
  }
}

export async function loginWithPasscode(passcode) {
  try {
    const inputHash = await sha256(passcode.trim());
    const savedCustomHash = localStorage.getItem(CUSTOM_PIN_HASH_KEY);
    const expectedHash = savedCustomHash || DEFAULT_PIN_HASH;

    if (inputHash === expectedHash) {
      localStorage.setItem(AUTH_KEY, 'true');
      return { success: true };
    }
    return { success: false, error: 'Incorrect passcode. Access denied.' };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export function logoutEditor() {
  try {
    localStorage.removeItem(AUTH_KEY);
  } catch {}
}

export async function updatePasscode(oldPasscode, newPasscode) {
  try {
    const check = await loginWithPasscode(oldPasscode);
    if (!check.success) {
      return { success: false, error: 'Current passcode is incorrect.' };
    }
    if (!newPasscode || newPasscode.trim().length < 4) {
      return { success: false, error: 'New passcode must be at least 4 characters long.' };
    }
    const newHash = await sha256(newPasscode.trim());
    localStorage.setItem(CUSTOM_PIN_HASH_KEY, newHash);
    localStorage.setItem(AUTH_KEY, 'true');
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}
