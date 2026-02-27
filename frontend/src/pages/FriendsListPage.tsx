import { useNavigate } from '@tanstack/react-router';
import { useGetFriendsList } from '../hooks/useQueries';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Phone, UserPlus, Users } from 'lucide-react';

export default function FriendsListPage() {
  const navigate = useNavigate();
  const { data: friends, isLoading, error } = useGetFriendsList();
  const { data: userProfile } = useGetCallerUserProfile();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground mb-1">
          Hey, {userProfile?.name?.split(' ')[0] || 'there'} 👋
        </h1>
        <p className="text-muted-foreground">
          {friends?.length
            ? `You have ${friends.length} friend${friends.length !== 1 ? 's' : ''}`
            : 'Add friends to get started'}
        </p>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-9 flex-1 rounded-xl" />
                <Skeleton className="h-9 flex-1 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-6 text-center">
          <p className="text-destructive font-medium">Failed to load friends list</p>
          <p className="text-sm text-muted-foreground mt-1">Please try refreshing the page</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && (!friends || friends.length === 0) && (
        <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
          <div className="w-20 h-20 rounded-3xl gradient-teal flex items-center justify-center mb-6 shadow-teal opacity-80">
            <Users className="w-10 h-10 text-white" />
          </div>
          <h2 className="font-display text-xl font-semibold text-foreground mb-2">No friends yet</h2>
          <p className="text-muted-foreground text-sm mb-6 max-w-xs">
            Add friends by their username to start chatting and calling.
          </p>
          <Button
            onClick={() => navigate({ to: '/friends' })}
            className="bg-teal hover:bg-teal-dark text-white rounded-xl shadow-teal"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add Your First Friend
          </Button>
        </div>
      )}

      {/* Friends Grid */}
      {!isLoading && friends && friends.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
          {friends.map((friend) => (
            <FriendCard
              key={friend.username}
              username={friend.username}
              online={friend.online}
              onCall={() => navigate({ to: '/call/$username', params: { username: friend.username } })}
              onChat={() => navigate({ to: '/chat/$username', params: { username: friend.username } })}
            />
          ))}

          {/* Add More Card */}
          <button
            onClick={() => navigate({ to: '/friends' })}
            className="bg-card border-2 border-dashed border-border rounded-2xl p-5 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-teal hover:text-teal hover:bg-teal/5 transition-all group min-h-[140px]"
          >
            <UserPlus className="w-6 h-6 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium">Add Friend</span>
          </button>
        </div>
      )}
    </div>
  );
}

interface FriendCardProps {
  username: string;
  online: boolean;
  onCall: () => void;
  onChat: () => void;
}

function FriendCard({ username, online, onCall, onChat }: FriendCardProps) {
  const initials = username.slice(0, 2).toUpperCase();

  return (
    <div className="bg-card border border-border rounded-2xl p-5 hover:shadow-card-hover transition-all group animate-fade-in">
      {/* Avatar & Info */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-teal/15 border-2 border-teal/20 flex items-center justify-center">
            <span className="text-teal font-semibold text-sm">{initials}</span>
          </div>
          {/* Online indicator */}
          <span
            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-card ${
              online ? 'bg-green-500' : 'bg-muted-foreground/40'
            }`}
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground truncate">{username}</p>
          <Badge
            variant="secondary"
            className={`text-xs px-2 py-0 h-5 ${
              online
                ? 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            {online ? '● Online' : '○ Offline'}
          </Badge>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onChat}
          className="flex-1 rounded-xl border-border hover:border-teal hover:text-teal hover:bg-teal/5 transition-all"
        >
          <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
          Chat
        </Button>
        <Button
          size="sm"
          onClick={onCall}
          className="flex-1 rounded-xl bg-teal hover:bg-teal-dark text-white shadow-sm transition-all"
        >
          <Phone className="w-3.5 h-3.5 mr-1.5" />
          Call
        </Button>
      </div>
    </div>
  );
}
