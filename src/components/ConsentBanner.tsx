'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { init as initAnalytics } from '@/lib/analytics';

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

function setCookie(name: string, value: string, days: number): void {
  if (typeof document === 'undefined') return;
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

export function ConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);

  const initializePostHog = useCallback((): void => {
    initAnalytics();
  }, []);

  useEffect(() => {
    const consent = getCookie(CONSENT_COOKIE_NAME);
    if (!consent) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowBanner(true);
    } else if (consent === 'accepted') {
      initializePostHog();
    }
  }, [initializePostHog]);

  function handleAccept(): void {
    setCookie(CONSENT_COOKIE_NAME, 'accepted', 365);
    initializePostHog();
    setShowBanner(false);
  }

  function handleDecline(): void {
    setCookie(CONSENT_COOKIE_NAME, 'declined', 365);
    setShowBanner(false);
  }

  if (!showBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-sm text-gray-700">
              We use cookies and analytics to improve your experience. By clicking &quot;Accept&quot;, you
              consent to our use of cookies and analytics tracking.{' '}
              <a
                href="/privacy"
                className="text-indigo-600 hover:text-indigo-700 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn more
              </a>
            </p>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <Button
              onClick={handleDecline}
              variant="outline"
              className="flex-1 sm:flex-none"
            >
              Decline
            </Button>
            <Button
              onClick={handleAccept}
              className="flex-1 sm:flex-none bg-indigo-600 hover:bg-indigo-700"
            >
              Accept
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function hasConsent(): boolean {
  const consent = getCookie(CONSENT_COOKIE_NAME);
  return consent === 'accepted';
}
