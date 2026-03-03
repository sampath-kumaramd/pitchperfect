'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { track } from '@/lib/analytics';
import { AmbientBackground } from '@/components/AmbientBackground';
import { GlassButton } from '@/components/ui/glass-button';
import { GlassCard } from '@/components/ui/glass-card';
import { Reveal, StaggerContainer } from '@/components/ui/reveal';

export default function Home() {
  useEffect(() => {
    track('page_viewed', { page: 'landing' });
  }, []);

  const handleScrollToFeatures = () => {
    // Will be implemented when features section is added
  };

  return (
    <>
      <AmbientBackground variant="default" />
      
      <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center relative z-10">
        <StaggerContainer staggerMs={100}>
          <Reveal>
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs font-medium text-slate-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI-Powered Pitch Practice</span>
              <span className="px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 text-[10px] font-semibold">
                Free
              </span>
            </div>
          </Reveal>

          <Reveal>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] max-w-4xl mt-8">
              <span className="text-slate-100">Practice your pitch with an</span>
              <br />
              <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                AI audience
              </span>
              <span className="text-slate-100"> that</span>
              <br />
              <span className="text-slate-100">challenges you</span>
            </h1>
          </Reveal>

          <Reveal>
            <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mt-6">
              No signup. No credit card. Pick a persona and start practicing in 30 seconds.
            </p>
          </Reveal>

          <Reveal>
            <div className="flex gap-4 mt-10">
              <Link href="/setup">
                <GlassButton variant="primary" size="lg" className="group">
                  Start Practicing 
                  <span className="inline-block transition-transform group-hover:translate-x-1 ml-1">
                    →
                  </span>
                </GlassButton>
              </Link>
              <GlassButton 
                variant="secondary" 
                size="lg"
                onClick={handleScrollToFeatures}
              >
                See How It Works
              </GlassButton>
            </div>
          </Reveal>

          <Reveal>
            <p className="text-slate-500 text-sm mt-16">
              Trusted by 200+ startup founders, sales teams, and MBA students
            </p>
          </Reveal>
        </StaggerContainer>

        <div 
          className="absolute w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 blur-[60px] animate-pulse-glow -z-10"
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      </div>

      <section className="max-w-6xl mx-auto py-32 px-6 relative z-10">
        <StaggerContainer staggerMs={100}>
          <Reveal>
            <div className="text-center">
              <div className="text-xs uppercase tracking-[0.2em] text-violet-400 font-semibold">
                HOW IT WORKS
              </div>
              <h2 className="text-4xl font-bold text-slate-100 mt-4">
                Three steps. Zero friction.
              </h2>
              <p className="text-slate-400 mt-3">
                No accounts. No installations. Just start.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <Reveal>
              <GlassCard hover={true}>
                <div className="text-5xl font-extrabold bg-gradient-to-b from-violet-400 to-transparent bg-clip-text text-transparent">
                  01
                </div>
                <h3 className="text-xl font-semibold text-slate-100 mt-4">
                  Set Up Your Pitch
                </h3>
                <p className="text-slate-400 mt-2">
                  Name your presentation, give context, and pick your AI opponent.
                </p>
              </GlassCard>
            </Reveal>

            <Reveal>
              <GlassCard hover={true}>
                <div className="text-5xl font-extrabold bg-gradient-to-b from-fuchsia-400 to-transparent bg-clip-text text-transparent">
                  02
                </div>
                <h3 className="text-xl font-semibold text-slate-100 mt-4">
                  Practice Live
                </h3>
                <p className="text-slate-400 mt-2">
                  Speak naturally. Your AI buyer responds in real-time with voice. See your WPM, fillers, and pacing live.
                </p>
              </GlassCard>
            </Reveal>

            <Reveal>
              <GlassCard hover={true}>
                <div className="text-5xl font-extrabold bg-gradient-to-b from-cyan-400 to-transparent bg-clip-text text-transparent">
                  03
                </div>
                <h3 className="text-xl font-semibold text-slate-100 mt-4">
                  Get Scored
                </h3>
                <p className="text-slate-400 mt-2">
                  Instant feedback: Clarity, Confidence, Structure scored 1-5. Plus specific strengths and improvements.
                </p>
              </GlassCard>
            </Reveal>
          </div>
        </StaggerContainer>
      </section>

      <section className="max-w-6xl mx-auto py-32 px-6 relative z-10">
        <StaggerContainer staggerMs={100}>
          <Reveal>
            <div className="text-center">
              <div className="text-xs uppercase tracking-[0.2em] text-cyan-400 font-semibold">
                AI PERSONAS
              </div>
              <h2 className="text-4xl font-bold text-slate-100 mt-4">
                Four opponents. Four challenges.
              </h2>
              <p className="text-slate-400 mt-3">
                Each persona tests different aspects of your pitch.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
            <Reveal>
              <GlassCard hover={true} glow="violet">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-100">
                      Curious
                    </h3>
                    <p className="text-sm text-slate-400 mt-1">
                      The Explorer
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold">
                    Medium
                  </span>
                </div>
                <p className="text-slate-400 mt-4">
                  VP of Innovation who asks deep follow-up questions. Interrupts every 30-45 seconds with genuine curiosity.
                </p>
              </GlassCard>
            </Reveal>

            <Reveal>
              <GlassCard hover={true} glow="fuchsia">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-100">
                      Skeptical
                    </h3>
                    <p className="text-sm text-slate-400 mt-1">
                      The Challenger
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-semibold">
                    Hard
                  </span>
                </div>
                <p className="text-slate-400 mt-4">
                  VP of Procurement who demands data for every claim. Hard mode.
                </p>
              </GlassCard>
            </Reveal>

            <Reveal>
              <GlassCard hover={true} glow="cyan">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-100">
                      Friendly
                    </h3>
                    <p className="text-sm text-slate-400 mt-1">
                      The Ally
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold">
                    Easy
                  </span>
                </div>
                <p className="text-slate-400 mt-4">
                  Head of Partnerships who champions your vision. Perfect for building confidence.
                </p>
              </GlassCard>
            </Reveal>

            <Reveal>
              <GlassCard hover={true} glow="violet">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-100">
                      Neutral
                    </h3>
                    <p className="text-sm text-slate-400 mt-1">
                      The Evaluator
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold">
                    Medium
                  </span>
                </div>
                <p className="text-slate-400 mt-4">
                  Director of Operations who evaluates everything on merit. No hints.
                </p>
              </GlassCard>
            </Reveal>
          </div>
        </StaggerContainer>
      </section>

      <section className="relative py-40 px-6 z-10">
        <div className="max-w-3xl mx-auto text-center relative">
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-100">
            Ready to stop winging it?
          </h2>
          <p className="text-xl text-slate-400 mt-6">
            Your next pitch deserves practice. Give it 5 minutes.
          </p>
          <div className="mt-10">
            <Link href="/setup">
              <GlassButton variant="primary" size="lg">
                Start Your First Session →
              </GlassButton>
            </Link>
          </div>
          <p className="text-sm text-slate-500 mt-4">
            Free · No signup · Works in Chrome, Firefox, Safari
          </p>
        </div>
        
        <div 
          className="absolute w-[800px] h-[800px] rounded-full bg-gradient-to-br from-violet-600/15 to-fuchsia-600/15 blur-[150px] -z-10"
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      </section>

      <footer className="border-t border-white/[0.05] mt-0 py-8 px-6 relative z-10">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <span className="font-semibold text-slate-400">PitchPerfect</span>
            <span className="text-slate-500 ml-2">© 2026 AnoNa Labs</span>
          </div>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-slate-500 hover:text-slate-300 transition-colors">
              Privacy
            </a>
            <a href="#" className="text-slate-500 hover:text-slate-300 transition-colors">
              Terms
            </a>
            <a href="#" className="text-slate-500 hover:text-slate-300 transition-colors">
              Twitter
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
