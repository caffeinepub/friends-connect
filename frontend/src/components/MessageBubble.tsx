import { formatDistanceToNow } from 'date-fns';

interface MessageBubbleProps {
  content: string;
  timestamp: bigint;
  isSent: boolean;
  senderInitials?: string;
}

export default function MessageBubble({ content, timestamp, isSent, senderInitials }: MessageBubbleProps) {
  // timestamp is 0 for messages (backend stores 0), show "just now" in that case
  const timeLabel = timestamp === BigInt(0) || timestamp === 0n
    ? 'just now'
    : formatDistanceToNow(new Date(Number(timestamp) / 1_000_000), { addSuffix: true });

  return (
    <div className={`flex items-end gap-2 mb-2 ${isSent ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar for received messages */}
      {!isSent && senderInitials && (
        <div className="w-7 h-7 rounded-full bg-teal/15 border border-teal/20 flex items-center justify-center shrink-0 mb-1">
          <span className="text-teal font-semibold text-xs">{senderInitials}</span>
        </div>
      )}

      {/* Bubble */}
      <div className={`max-w-[75%] group ${isSent ? 'items-end' : 'items-start'} flex flex-col`}>
        <div
          className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed break-words ${
            isSent
              ? 'bg-teal text-white rounded-br-sm'
              : 'bg-muted text-foreground rounded-bl-sm'
          }`}
        >
          {content}
        </div>
        <span className="text-xs text-muted-foreground/60 mt-1 px-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {timeLabel}
        </span>
      </div>

      {/* Spacer for sent messages alignment */}
      {isSent && <div className="w-7 shrink-0" />}
    </div>
  );
}
