import { createRootRoute, createRoute, createRouter, RouterProvider, Outlet } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import Layout from './components/Layout';
import FriendsListPage from './pages/FriendsListPage';
import FriendsManagementPage from './pages/FriendsManagementPage';
import CallPage from './pages/CallPage';
import ChatPage from './pages/ChatPage';
import AccessDeniedScreen from './components/AccessDeniedScreen';
import ProfileSetupModal from './components/ProfileSetupModal';
import { useGetCallerUserProfile } from './hooks/useQueries';
import { Toaster } from '@/components/ui/sonner';

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { identity, isInitializing, isLoggingIn } = useInternetIdentity();
  const isAuthenticated = !!identity;

  // Use the custom hook that properly handles actor dependency state
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  // Show loading spinner while auth is initializing or login is in progress
  if (isInitializing || isLoggingIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-teal border-t-transparent animate-spin" />
          <p className="text-muted-foreground text-sm">
            {isLoggingIn ? 'Logging in...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AccessDeniedScreen />;
  }

  // Only show profile setup when we're sure the profile doesn't exist
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  return (
    <>
      {showProfileSetup && <ProfileSetupModal />}
      {children}
    </>
  );
}

function RootLayout() {
  return (
    <AuthGuard>
      <Layout>
        <Outlet />
      </Layout>
    </AuthGuard>
  );
}

const rootRoute = createRootRoute({
  component: RootLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: FriendsListPage,
});

const friendsManagementRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/friends',
  component: FriendsManagementPage,
});

const callRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/call/$username',
  component: CallPage,
});

const chatRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/chat/$username',
  component: ChatPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  friendsManagementRoute,
  callRoute,
  chatRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster richColors position="top-right" />
    </>
  );
}
