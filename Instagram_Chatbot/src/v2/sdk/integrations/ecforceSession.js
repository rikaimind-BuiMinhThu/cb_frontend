export function ecRunEcForceSessionLandingLogout() {
  try {
    if (typeof document === 'undefined') return;

    const name = '_ec_force_session';

    if ((document.cookie || '').includes(name + '=')) {
      document.cookie = name + '=; Max-Age=0; path=/';
    }
  } catch (e) {
    // ignore
  }
}
