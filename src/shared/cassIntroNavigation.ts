const SKIP_HOME_INTRO_ONCE_KEY = 'cass:skip-home-intro-once';

export function requestHomeWithoutIntro() {
  try {
    window.sessionStorage.setItem(SKIP_HOME_INTRO_ONCE_KEY, 'true');
  } catch {
    // Navigation should still work if storage is unavailable.
  }
}

export function consumeHomeIntroSkip() {
  try {
    const shouldSkip = window.sessionStorage.getItem(SKIP_HOME_INTRO_ONCE_KEY) === 'true';

    if (shouldSkip) {
      window.sessionStorage.removeItem(SKIP_HOME_INTRO_ONCE_KEY);
    }

    return shouldSkip;
  } catch {
    return false;
  }
}
