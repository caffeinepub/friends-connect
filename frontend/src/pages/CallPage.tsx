import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import CallControls from '../components/CallControls';
import { Phone } from 'lucide-react';

export default function CallPage() {
  const { username } = useParams({ from: '/call/$username' });
  const navigate = useNavigate();

  const [seconds, setSeconds] = useState(0);
  const [muted, setMuted] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [callEnded, setCallEnded] = useState(false);

  useEffect(() => {
    if (callEnded) return;
    const interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [callEnded]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const handleEndCall = useCallback(() => {
    setCallEnded(true);
    setTimeout(() => navigate({ to: '/' }), 800);
  }, [navigate]);

  const initials = username.slice(0, 2).toUpperCase();

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm animate-slide-up">
        {/* Call Card */}
        <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-card">
          {/* Top gradient area */}
          <div className="gradient-hero px-6 pt-10 pb-8 flex flex-col items-center text-center">
            {/* Avatar */}
            <div className="relative mb-5">
              <div className="w-24 h-24 rounded-full bg-teal/20 border-4 border-teal/30 flex items-center justify-center shadow-teal">
                <span className="font-display text-3xl font-bold text-teal">{initials}</span>
              </div>
              {/* Pulse rings */}
              {!callEnded && (
                <>
                  <span className="absolute inset-0 rounded-full border-2 border-teal/30 animate-ping" style={{ animationDuration: '2s' }} />
                  <span className="absolute -inset-3 rounded-full border border-teal/15 animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }} />
                </>
              )}
            </div>

            <h2 className="font-display text-2xl font-bold text-foreground mb-1">{username}</h2>

            {callEnded ? (
              <p className="text-coral font-medium text-sm">Call ended</p>
            ) : (
              <>
                <p className="text-muted-foreground text-sm mb-2">In call</p>
                <div className="bg-teal/10 border border-teal/20 rounded-full px-4 py-1.5">
                  <span className="text-teal font-mono font-semibold text-lg tracking-widest">
                    {formatTime(seconds)}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Status indicators */}
          {!callEnded && (
            <div className="flex items-center justify-center gap-4 px-6 py-3 border-t border-border bg-muted/20">
              <div className={`flex items-center gap-1.5 text-xs font-medium ${muted ? 'text-coral' : 'text-muted-foreground'}`}>
                <span className={`w-2 h-2 rounded-full ${muted ? 'bg-coral' : 'bg-green-500'}`} />
                {muted ? 'Muted' : 'Mic on'}
              </div>
              <div className="w-px h-4 bg-border" />
              <div className={`flex items-center gap-1.5 text-xs font-medium ${!videoEnabled ? 'text-coral' : 'text-muted-foreground'}`}>
                <span className={`w-2 h-2 rounded-full ${!videoEnabled ? 'bg-coral' : 'bg-green-500'}`} />
                {videoEnabled ? 'Video on' : 'Video off'}
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="px-6 py-6">
            <CallControls
              muted={muted}
              videoEnabled={videoEnabled}
              onToggleMute={() => setMuted((m) => !m)}
              onToggleVideo={() => setVideoEnabled((v) => !v)}
              onEndCall={handleEndCall}
              disabled={callEnded}
            />
          </div>
        </div>

        {/* Back hint */}
        {!callEnded && (
          <p className="text-center text-xs text-muted-foreground mt-4">
            Simulated call — no real audio/video
          </p>
        )}
      </div>
    </div>
  );
}
