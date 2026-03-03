import posthog from 'posthog-js';

const CONSENT_COOKIE_NAME = 'pitchperfect_consent';

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
}

function hasConsent(): boolean {
  const consent = getCookie(CONSENT_COOKIE_NAME);
  return consent === 'accepted';
}

let initialized = false;

export function init(): void {
  if (initialized) return;
  if (typeof window === 'undefined') return;
  if (!hasConsent()) return;

  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

  if (!key || !host) {
    console.warn('[Analytics] PostHog credentials missing');
    return;
  }

  posthog.init(key, {
    api_host: host,
    loaded: (ph) => {
      console.log('[Analytics] PostHog initialized');
      initialized = true;
    },
    capture_pageview: false,
    capture_pageleave: false,
  });
}

export function track(event: string, properties?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;
  if (!hasConsent()) return;
  if (!initialized) init();
  if (!initialized) return;

  posthog.capture(event, properties);
}

export function identify(distinctId: string): void {
  if (typeof window === 'undefined') return;
  if (!hasConsent()) return;
  if (!initialized) init();
  if (!initialized) return;

  posthog.identify(distinctId);
}
