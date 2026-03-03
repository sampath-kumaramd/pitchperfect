'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PersonaPicker } from '@/components/setup/PersonaPicker';
import { DurationSlider } from '@/components/setup/DurationSlider';
import type { PersonaType } from '@/types/persona';

interface ValidationErrors {
  userName?: string;
  presentationTitle?: string;
  presentationContext?: string;
  persona?: string;
}

function SetupFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userName, setUserName] = useState('');
  const [presentationTitle, setPresentationTitle] = useState('');
  const [presentationContext, setPresentationContext] = useState('');
  const [persona, setPersona] = useState<PersonaType | null>(null);
  const [durationMinutes, setDurationMinutes] = useState(5);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const urlUserName = searchParams.get('userName');
    const urlTitle = searchParams.get('title');
    const urlContext = searchParams.get('context');
    const urlPersona = searchParams.get('persona') as PersonaType | null;
    const urlDuration = searchParams.get('duration');

    if (urlUserName) setUserName(urlUserName);
    if (urlTitle) setPresentationTitle(urlTitle);
    if (urlContext) setPresentationContext(urlContext);
    if (urlPersona && ['friendly', 'professional', 'critical'].includes(urlPersona)) {
      setPersona(urlPersona);
    }
    if (urlDuration) {
      const duration = parseInt(urlDuration, 10);
      if (!isNaN(duration) && duration >= 1 && duration <= 30) {
        setDurationMinutes(duration);
      }
    }
  }, [searchParams]);

  function validateUserName(value: string): string | undefined {
    if (value.length < 2) {
      return 'Name must be at least 2 characters';
    }
    if (value.length > 50) {
      return 'Name must be less than 50 characters';
    }
    return undefined;
  }

  function validatePresentationTitle(value: string): string | undefined {
    if (value.length < 5) {
      return 'Title must be at least 5 characters';
    }
    if (value.length > 100) {
      return 'Title must be less than 100 characters';
    }
    return undefined;
  }

  function validatePresentationContext(value: string): string | undefined {
    if (value.length < 10) {
      return 'Context must be at least 10 characters';
    }
    if (value.length > 500) {
      return 'Context must be less than 500 characters';
    }
    return undefined;
  }

  function validatePersona(value: PersonaType | null): string | undefined {
    if (!value) {
      return 'Please select a persona';
    }
    return undefined;
  }

  function handleBlur(field: string) {
    setTouched((prev) => new Set(prev).add(field));
    
    const newErrors = { ...errors };
    
    switch (field) {
      case 'userName':
        newErrors.userName = validateUserName(userName);
        break;
      case 'presentationTitle':
        newErrors.presentationTitle = validatePresentationTitle(presentationTitle);
        break;
      case 'presentationContext':
        newErrors.presentationContext = validatePresentationContext(presentationContext);
        break;
      case 'persona':
        newErrors.persona = validatePersona(persona);
        break;
    }
    
    setErrors(newErrors);
  }

  function isFormValid(): boolean {
    const userNameError = validateUserName(userName);
    const titleError = validatePresentationTitle(presentationTitle);
    const contextError = validatePresentationContext(presentationContext);
    const personaError = validatePersona(persona);
    
    return !userNameError && !titleError && !contextError && !personaError;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!isFormValid()) {
      setTouched(new Set(['userName', 'presentationTitle', 'presentationContext', 'persona']));
      setErrors({
        userName: validateUserName(userName),
        presentationTitle: validatePresentationTitle(presentationTitle),
        presentationContext: validatePresentationContext(presentationContext),
        persona: validatePersona(persona),
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName,
          presentationTitle,
          presentationContext,
          persona,
          durationMinutes,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create session');
      }

      const data = await response.json();
      router.push(`/session?sessionId=${data.sessionId}`);
    } catch (error) {
      console.error('Error creating session:', error);
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="userName">Your Name</Label>
        <Input
          id="userName"
          type="text"
          placeholder="Your name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          onBlur={() => handleBlur('userName')}
          className={errors.userName && touched.has('userName') ? 'border-red-600' : ''}
        />
        {errors.userName && touched.has('userName') && (
          <p className="text-sm text-red-600">{errors.userName}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="presentationTitle">Presentation Title</Label>
        <Input
          id="presentationTitle"
          type="text"
          placeholder="e.g., Q4 Sales Strategy"
          value={presentationTitle}
          onChange={(e) => setPresentationTitle(e.target.value)}
          onBlur={() => handleBlur('presentationTitle')}
          className={errors.presentationTitle && touched.has('presentationTitle') ? 'border-red-600' : ''}
        />
        {errors.presentationTitle && touched.has('presentationTitle') && (
          <p className="text-sm text-red-600">{errors.presentationTitle}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="presentationContext">Presentation Context</Label>
        <Textarea
          id="presentationContext"
          placeholder="Briefly describe your pitch in 1-2 sentences..."
          rows={3}
          value={presentationContext}
          onChange={(e) => setPresentationContext(e.target.value)}
          onBlur={() => handleBlur('presentationContext')}
          className={errors.presentationContext && touched.has('presentationContext') ? 'border-red-600' : ''}
        />
        {errors.presentationContext && touched.has('presentationContext') && (
          <p className="text-sm text-red-600">{errors.presentationContext}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Select Persona</Label>
        <PersonaPicker
          selected={persona}
          onSelect={(selectedPersona) => {
            setPersona(selectedPersona);
            setTouched((prev) => new Set(prev).add('persona'));
            setErrors((prev) => ({ ...prev, persona: undefined }));
          }}
        />
        {errors.persona && touched.has('persona') && (
          <p className="text-sm text-red-600">{errors.persona}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Duration</Label>
        <DurationSlider
          value={durationMinutes}
          onChange={setDurationMinutes}
        />
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={!isFormValid() || isSubmitting}
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Creating session...
          </span>
        ) : (
          'Start Practice Session'
        )}
      </Button>
    </form>
  );
}

export function SetupForm() {
  return (
    <Suspense fallback={<div className="animate-pulse space-y-6">
      <div className="space-y-2">
        <div className="h-5 w-24 rounded bg-gray-200"></div>
        <div className="h-10 w-full rounded bg-gray-200"></div>
      </div>
      <div className="space-y-2">
        <div className="h-5 w-40 rounded bg-gray-200"></div>
        <div className="h-10 w-full rounded bg-gray-200"></div>
      </div>
      <div className="space-y-2">
        <div className="h-5 w-48 rounded bg-gray-200"></div>
        <div className="h-24 w-full rounded bg-gray-200"></div>
      </div>
      <div className="h-32 w-full rounded bg-gray-200"></div>
      <div className="h-10 w-full rounded bg-gray-200"></div>
    </div>}>
      <SetupFormContent />
    </Suspense>
  );
}
