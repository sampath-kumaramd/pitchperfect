interface AmbientBackgroundProps {
  variant?: 'default' | 'session' | 'feedback';
}

export function AmbientBackground({ variant = 'default' }: AmbientBackgroundProps) {
  const noisePattern = "data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='4' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E";

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {variant === 'default' && (
        <>
          {/* Orb 1 - Top Left */}
          <div
            className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-br from-violet-600/20 to-indigo-600/10 blur-[120px] animate-orb"
            style={{
              top: '-200px',
              left: '-100px',
              animationDuration: '25s',
            }}
          />
          
          {/* Orb 2 - Bottom Right */}
          <div
            className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-br from-fuchsia-600/15 to-violet-600/10 blur-[100px] animate-orb"
            style={{
              bottom: '-150px',
              right: '-100px',
              animationDuration: '30s',
              animationDelay: '-10s',
            }}
          />
          
          {/* Orb 3 - Center Right */}
          <div
            className="absolute w-[400px] h-[400px] rounded-full bg-gradient-to-br from-cyan-500/10 to-blue-600/5 blur-[80px] animate-orb"
            style={{
              top: '40%',
              right: '10%',
              animationDuration: '35s',
              animationDelay: '-20s',
            }}
          />
        </>
      )}

      {variant === 'session' && (
        <>
          {/* Orb 1 - Centered, larger, cyan, pulsing */}
          <div
            className="absolute w-[800px] h-[800px] rounded-full bg-gradient-to-br from-cyan-500/25 to-blue-600/15 blur-[120px] animate-orb animate-pulse-glow"
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              animationDuration: '25s',
            }}
          />
          
          {/* Orb 2 - Bottom Right */}
          <div
            className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-br from-fuchsia-600/15 to-violet-600/10 blur-[100px] animate-orb"
            style={{
              bottom: '-150px',
              right: '-100px',
              animationDuration: '30s',
              animationDelay: '-10s',
            }}
          />
          
          {/* Orb 3 - Top Left */}
          <div
            className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-br from-violet-600/15 to-indigo-600/10 blur-[120px] animate-orb"
            style={{
              top: '-200px',
              left: '-100px',
              animationDuration: '35s',
              animationDelay: '-20s',
            }}
          />
        </>
      )}

      {variant === 'feedback' && (
        <>
          {/* Orb 2 - Centered, emerald/green tint */}
          <div
            className="absolute w-[700px] h-[700px] rounded-full bg-gradient-to-br from-emerald-600/20 to-green-600/10 blur-[120px] animate-orb"
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              animationDuration: '30s',
              animationDelay: '-10s',
            }}
          />
          
          {/* Orb 1 - Top Left */}
          <div
            className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-br from-violet-600/15 to-indigo-600/10 blur-[120px] animate-orb"
            style={{
              top: '-200px',
              left: '-100px',
              animationDuration: '25s',
            }}
          />
          
          {/* Orb 3 - Bottom Right */}
          <div
            className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-br from-cyan-500/10 to-blue-600/5 blur-[100px] animate-orb"
            style={{
              bottom: '-150px',
              right: '-100px',
              animationDuration: '35s',
              animationDelay: '-20s',
            }}
          />
        </>
      )}

      {/* Noise texture overlay */}
      <div
        className="fixed inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `url('${noisePattern}')`,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px',
        }}
      />
    </div>
  );
}
