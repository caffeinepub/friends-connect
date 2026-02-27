import { useState } from 'react';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function ProfileSetupModal() {
  const [name, setName] = useState('');
  const saveProfile = useSaveCallerUserProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;

    try {
      await saveProfile.mutateAsync({ name: trimmed });
      toast.success('Profile created! Welcome to FriendsConnect 🎉');
    } catch (err) {
      toast.error('Failed to save profile. Please try again.');
    }
  };

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-md rounded-3xl border-border" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader className="text-center items-center pb-2">
          <div className="w-16 h-16 rounded-2xl gradient-teal flex items-center justify-center mb-4 shadow-teal mx-auto">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <DialogTitle className="font-display text-2xl font-bold">Set Up Your Profile</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Choose a display name so your friends can find you.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Display Name
            </Label>
            <Input
              id="name"
              placeholder="e.g. Alex Johnson"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-xl h-11 border-border focus-visible:ring-teal"
              autoFocus
              maxLength={50}
            />
          </div>

          <Button
            type="submit"
            disabled={!name.trim() || saveProfile.isPending}
            className="w-full h-11 rounded-xl bg-teal hover:bg-teal-dark text-white font-semibold shadow-teal transition-all"
          >
            {saveProfile.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Continue →'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
