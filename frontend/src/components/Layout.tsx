import { Link, useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { Users, Settings, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState } from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { identity, clear } = useInternetIdentity();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data: userProfile } = useGetCallerUserProfile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    // Clear all cached application data first
    queryClient.clear();
    // Then clear the identity
    await clear();
    // Navigate to root — AuthGuard will show AccessDeniedScreen
    navigate({ to: '/' });
  };

  const initials = userProfile?.name
    ? userProfile.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  const navLinks = [
    { to: '/', label: 'Friends', icon: Users },
    { to: '/friends', label: 'Manage', icon: Settings },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <img
              src="/assets/generated/logo.dim_256x256.png"
              alt="Friends Connect"
              className="w-8 h-8 rounded-lg object-cover"
            />
            <span className="font-display font-bold text-lg tracking-tight text-foreground group-hover:text-teal transition-colors">
              Friends<span className="text-teal">Connect</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                activeProps={{ className: 'text-teal bg-teal/10 hover:bg-teal/15 hover:text-teal' }}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </nav>

          {/* User Menu */}
          <div className="flex items-center gap-2">
            {identity && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-muted transition-colors">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src="/assets/generated/avatar-placeholder.dim_128x128.png" />
                      <AvatarFallback className="bg-teal text-white text-xs font-semibold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:block text-sm font-medium text-foreground max-w-[120px] truncate">
                      {userProfile?.name || 'User'}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{userProfile?.name || 'User'}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {identity.getPrincipal().toString().slice(0, 20)}...
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/" className="flex items-center gap-2 cursor-pointer">
                      <Users className="w-4 h-4" />
                      Friends
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/friends" className="flex items-center gap-2 cursor-pointer">
                      <Settings className="w-4 h-4" />
                      Manage Friends
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-destructive focus:text-destructive cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-card/95 backdrop-blur-sm">
            <nav className="max-w-5xl mx-auto px-4 py-3 flex flex-col gap-1">
              {navLinks.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                  activeProps={{ className: 'text-teal bg-teal/10 hover:text-teal' }}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-5 mt-auto">
        <div className="max-w-5xl mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} FriendsConnect · Built with{' '}
          <span className="text-coral">♥</span> using{' '}
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
