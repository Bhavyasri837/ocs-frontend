export const AUTH_STORAGE_KEY = "ocs_auth_v1";

export function loadAuthFromStorage() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return { isLoggedIn: false, role: "" };
    const parsed = JSON.parse(raw);
    return {
      isLoggedIn: Boolean(parsed?.isLoggedIn),
      role: typeof parsed?.role === "string" ? parsed.role : "",
    };
  } catch {
    return { isLoggedIn: false, role: "" };
  }
}

export function saveAuthToStorage({ isLoggedIn, role }) {
  try {
    localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({ isLoggedIn: Boolean(isLoggedIn), role: role || "" })
    );
  } catch {
    // ignore
  }
}

export function clearAuthStorage() {
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch {
    // ignore
  }
}

