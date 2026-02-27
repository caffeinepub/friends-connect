import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Users, Lock, Loader2 } from 'lucide-react';

export default function AccessDeniedScreen() {
  const { login, isLoggingIn, isInitializing } = useInternetIdentity();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center gap-2.5">
          <img
            src="/assets/generated/logo.dim_256x256.png"
            alt="Friends Connect"
            className="w-8 h-8 rounded-lg object-cover"
          />
          <span className="font-display font-bold text-lg tracking-tight">
            Friends<span className="text-teal">Connect</span>
          </span>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center animate-slide-up">
          {/* Icon */}
          <div className="relative mx-auto w-24 h-24 mb-8">
            <div className="absolute inset-0 rounded-3xl gradient-teal opacity-20 animate-pulse-ring" />
            <div className="relative w-24 h-24 rounded-3xl gradient-teal flex items-center justify-center shadow-teal">
              <Users className="w-12 h-12 text-white" />
            </div>
          </div>

          <h1 className="font-display text-3xl font-bold text-foreground mb-3">
            Welcome to FriendsConnect
          </h1>
          <p className="text-muted-foreground text-base mb-8 leading-relaxed">
            Stay connected with your friends — chat, call, and manage your social circle all in one place.
          </p>

          {/* Features */}
          <div className="grid grid-cols-3 gap-3 mb-10">
            {[
              { icon: '💬', label: 'Chat' },
              { icon: '📞', label: 'Call' },
              { icon: '👥', label: 'Friends' },
            ].map(({ icon, label }) => (
              <div key={label} className="bg-card border border-border rounded-2xl p-4 flex flex-col items-center gap-2">
                <span className="text-2xl">{icon}</span>
                <span className="text-xs font-medium text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>

          {/* Login Button */}
          <Button
            onClick={login}
            disabled={isLoggingIn || isInitializing}
            size="lg"
            className="w-full bg-teal hover:bg-teal-dark text-white font-semibold rounded-2xl h-12 shadow-teal transition-all hover:shadow-lg"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 mr-2" />
                Login to Get Started
              </>
            )}
          </Button>
          <p className="text-xs text-muted-foreground mt-3">
            Secure authentication powered by Internet Identity
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-5">
        <div className="max-w-5xl mx-auto px-4 text-center text-sm text-muted-foreground">
          Built with <span className="text-coral">♥</span> using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname || 'friends-connect')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal hover:underline font-medium"
          >
            caffeine.ai
          </a>
        </div>
      </footer>
    </div>
  );
}
