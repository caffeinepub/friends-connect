import { useState } from 'react';
import { useGetFriendsList, useAddFriend, useRemoveFriend } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { UserPlus, Trash2, Loader2, Users, Search } from 'lucide-react';
import { toast } from 'sonner';

export default function FriendsManagementPage() {
  const [username, setUsername] = useState('');
  const [search, setSearch] = useState('');

  const { data: friends, isLoading } = useGetFriendsList();
  const addFriend = useAddFriend();
  const removeFriend = useRemoveFriend();

  const handleAddFriend = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = username.trim();
    if (!trimmed) return;

    try {
      await addFriend.mutateAsync(trimmed);
      setUsername('');
      toast.success(`${trimmed} added to your friends!`);
    } catch (err: any) {
      const msg = err?.message || 'Failed to add friend';
      if (msg.includes('already added')) {
        toast.error('This friend is already in your list.');
      } else if (msg.includes('empty')) {
        toast.error('Please enter a username.');
      } else {
        toast.error(msg);
      }
    }
  };

  const handleRemoveFriend = async (friendName: string) => {
    try {
      await removeFriend.mutateAsync(friendName);
      toast.success(`${friendName} removed from friends.`);
    } catch (err: any) {
      toast.error(err?.message || 'Failed to remove friend');
    }
  };

  const filteredFriends = friends?.filter((f) =>
    f.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground mb-1">Manage Friends</h1>
        <p className="text-muted-foreground">Add or remove friends from your list</p>
      </div>

      {/* Add Friend Form */}
      <div className="bg-card border border-border rounded-2xl p-6 mb-6">
        <h2 className="font-display font-semibold text-lg text-foreground mb-4 flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-teal" />
          Add a Friend
        </h2>
        <form onSubmit={handleAddFriend} className="flex gap-3">
          <Input
            placeholder="Enter username..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="flex-1 rounded-xl h-11 border-border focus-visible:ring-teal"
            maxLength={50}
          />
          <Button
            type="submit"
            disabled={!username.trim() || addFriend.isPending}
            className="h-11 px-5 rounded-xl bg-teal hover:bg-teal-dark text-white font-semibold shadow-teal transition-all"
          >
            {addFriend.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <UserPlus className="w-4 h-4 mr-1.5" />
                Add
              </>
            )}
          </Button>
        </form>
      </div>

      {/* Friends List */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-border flex items-center justify-between gap-3">
          <h2 className="font-display font-semibold text-lg text-foreground flex items-center gap-2">
            <Users className="w-5 h-5 text-teal" />
            Your Friends
            {friends && (
              <Badge variant="secondary" className="ml-1 text-xs">
                {friends.length}
              </Badge>
            )}
          </h2>
          {friends && friends.length > 3 && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 w-40 rounded-xl text-sm border-border"
              />
            </div>
          )}
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="divide-y divide-border">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-4">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="h-8 w-20 rounded-lg" />
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!isLoading && (!friends || friends.length === 0) && (
          <div className="py-12 text-center">
            <Users className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">No friends added yet</p>
            <p className="text-muted-foreground/60 text-xs mt-1">Use the form above to add friends</p>
          </div>
        )}

        {/* No search results */}
        {!isLoading && friends && friends.length > 0 && filteredFriends?.length === 0 && (
          <div className="py-10 text-center">
            <p className="text-muted-foreground text-sm">No friends match "{search}"</p>
          </div>
        )}

        {/* Friends List */}
        {!isLoading && filteredFriends && filteredFriends.length > 0 && (
          <div className="divide-y divide-border">
            {filteredFriends.map((friend) => {
              const initials = friend.username.slice(0, 2).toUpperCase();
              return (
                <div
                  key={friend.username}
                  className="flex items-center gap-3 px-5 py-4 hover:bg-muted/30 transition-colors"
                >
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <div className="w-10 h-10 rounded-full bg-teal/15 border border-teal/20 flex items-center justify-center">
                      <span className="text-teal font-semibold text-sm">{initials}</span>
                    </div>
                    <span
                      className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-card ${
                        friend.online ? 'bg-green-500' : 'bg-muted-foreground/40'
                      }`}
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{friend.username}</p>
                    <p className={`text-xs ${friend.online ? 'text-green-500' : 'text-muted-foreground'}`}>
                      {friend.online ? 'Online' : 'Offline'}
                    </p>
                  </div>

                  {/* Remove Button */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                        disabled={removeFriend.isPending}
                      >
                        {removeFriend.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                        <span className="ml-1.5 text-xs">Remove</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="rounded-2xl">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Remove {friend.username}?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will remove <strong>{friend.username}</strong> from your friends list. You can add them again later.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleRemoveFriend(friend.username)}
                          className="rounded-xl bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                        >
                          Remove
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
