import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetMessagesWithFriend, useSendMessage } from '../hooks/useQueries';
import MessageBubble from '../components/MessageBubble';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Phone, Send, Loader2, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

export default function ChatPage() {
  const { username } = useParams({ from: '/chat/$username' });
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: messages, isLoading } = useGetMessagesWithFriend(username);
  const sendMessage = useSendMessage();

  const currentPrincipal = identity?.getPrincipal().toString();

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = messageText.trim();
    if (!trimmed) return;

    try {
      await sendMessage.mutateAsync({ friendUsername: username, content: trimmed });
      setMessageText('');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to send message');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const initials = username.slice(0, 2).toUpperCase();

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 flex flex-col h-[calc(100vh-4rem-5rem)]">
      {/* Chat Header */}
      <div className="bg-card border border-border rounded-2xl px-4 py-3 mb-4 flex items-center gap-3 shadow-xs">
        <button
          onClick={() => navigate({ to: '/' })}
          className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="w-9 h-9 rounded-full bg-teal/15 border border-teal/20 flex items-center justify-center shrink-0">
          <span className="text-teal font-semibold text-sm">{initials}</span>
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground truncate">{username}</p>
          <p className="text-xs text-muted-foreground">Chat</p>
        </div>

        <Button
          size="sm"
          onClick={() => navigate({ to: '/call/$username', params: { username } })}
          className="rounded-xl bg-teal hover:bg-teal-dark text-white shadow-sm"
        >
          <Phone className="w-3.5 h-3.5 mr-1.5" />
          Call
        </Button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto bg-card border border-border rounded-2xl p-4 mb-4 space-y-1">
        {isLoading && (
          <div className="space-y-3 p-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                <Skeleton className={`h-10 rounded-2xl ${i % 2 === 0 ? 'w-48' : 'w-36'}`} />
              </div>
            ))}
          </div>
        )}

        {!isLoading && (!messages || messages.length === 0) && (
          <div className="h-full flex flex-col items-center justify-center text-center py-12">
            <div className="w-14 h-14 rounded-2xl bg-teal/10 flex items-center justify-center mb-4">
              <MessageSquare className="w-7 h-7 text-teal/60" />
            </div>
            <p className="text-muted-foreground text-sm font-medium">No messages yet</p>
            <p className="text-muted-foreground/60 text-xs mt-1">
              Say hi to {username}!
            </p>
          </div>
        )}

        {!isLoading && messages && messages.map((msg, idx) => {
          const isSent = msg.sender.toString() === currentPrincipal;
          return (
            <MessageBubble
              key={idx}
              content={msg.content}
              timestamp={msg.timestamp}
              isSent={isSent}
              senderInitials={isSent ? undefined : initials}
            />
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSend} className="bg-card border border-border rounded-2xl p-3 flex gap-2 items-end">
        <Textarea
          placeholder={`Message ${username}...`}
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 min-h-[44px] max-h-32 resize-none rounded-xl border-border focus-visible:ring-teal text-sm"
          rows={1}
        />
        <Button
          type="submit"
          disabled={!messageText.trim() || sendMessage.isPending}
          className="h-11 w-11 p-0 rounded-xl bg-teal hover:bg-teal-dark text-white shadow-teal shrink-0 transition-all"
        >
          {sendMessage.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </form>
      <p className="text-center text-xs text-muted-foreground mt-2">
        Press Enter to send · Shift+Enter for new line
      </p>
    </div>
  );
}
