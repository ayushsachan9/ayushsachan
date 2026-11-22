/**
 * Email-Based Authentication & Access Control for Ayush Sachan
 * Restricts editing on /exam and /daily exclusively to authorized emails.
 */

export const AUTHORIZED_EMAILS = [
  'ayushsachanx369@gmail.com',
  'ayushsachan279@gmail.com'
];

const EDITOR_EMAIL_KEY = 'ayush_editor_authorized_email';

/**
 * Check if the current user is signed in with an authorized email
 */
export function getAuthorizedEmail() {
  try {
    const email = localStorage.getItem(EDITOR_EMAIL_KEY);
    if (!email) return null;
    const clean = email.trim().toLowerCase();
    return AUTHORIZED_EMAILS.includes(clean) ? clean : null;
  } catch {
    return null;
  }
}

export function isEditorAuthenticated() {
  return !!getAuthorizedEmail();
}

/**
 * Authenticate with email
 */
export function loginWithEmail(email) {
  try {
    if (!email) {
      return { success: false, error: 'Please enter an email address.' };
    }

    const clean = email.trim().toLowerCase();

    if (AUTHORIZED_EMAILS.includes(clean)) {
      localStorage.setItem(EDITOR_EMAIL_KEY, clean);
      // Clean up legacy password keys if any
      localStorage.removeItem('ayush_admin_authenticated_v1');
      localStorage.removeItem('ayush_admin_custom_pin_hash');
      return { success: true, email: clean };
    }

    return {
      success: false,
      error: `Access denied for "${clean}". Editing is strictly restricted to Ayush's authorized emails (ayushsachanx369@gmail.com or ayushsachan279@gmail.com).`
    };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * Sign out of editor mode
 */
export function logoutEditor() {
  try {
    localStorage.removeItem(EDITOR_EMAIL_KEY);
    localStorage.removeItem('ayush_admin_authenticated_v1');
  } catch {}
}
