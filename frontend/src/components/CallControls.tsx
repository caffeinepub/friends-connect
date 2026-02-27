import { Mic, MicOff, Video, VideoOff, PhoneOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface CallControlsProps {
  muted: boolean;
  videoEnabled: boolean;
  onToggleMute: () => void;
  onToggleVideo: () => void;
  onEndCall: () => void;
  disabled?: boolean;
}

export default function CallControls({
  muted,
  videoEnabled,
  onToggleMute,
  onToggleVideo,
  onEndCall,
  disabled = false,
}: CallControlsProps) {
  return (
    <TooltipProvider>
      <div className="flex items-center justify-center gap-4">
        {/* Mute */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={onToggleMute}
              disabled={disabled}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-sm hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
                muted
                  ? 'bg-coral text-white shadow-coral'
                  : 'bg-muted hover:bg-muted/80 text-foreground'
              }`}
            >
              {muted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
          </TooltipTrigger>
          <TooltipContent>{muted ? 'Unmute' : 'Mute'}</TooltipContent>
        </Tooltip>

        {/* End Call */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={onEndCall}
              disabled={disabled}
              className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-all shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PhoneOff className="w-6 h-6" />
            </button>
          </TooltipTrigger>
          <TooltipContent>End Call</TooltipContent>
        </Tooltip>

        {/* Video */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={onToggleVideo}
              disabled={disabled}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-sm hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
                !videoEnabled
                  ? 'bg-coral text-white shadow-coral'
                  : 'bg-muted hover:bg-muted/80 text-foreground'
              }`}
            >
              {videoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </button>
          </TooltipTrigger>
          <TooltipContent>{videoEnabled ? 'Turn off video' : 'Turn on video'}</TooltipContent>
        </Tooltip>
      </div>

      {/* Labels */}
      <div className="flex items-center justify-center gap-4 mt-3">
        <span className="w-14 text-center text-xs text-muted-foreground">{muted ? 'Unmute' : 'Mute'}</span>
        <span className="w-16 text-center text-xs text-muted-foreground">End</span>
        <span className="w-14 text-center text-xs text-muted-foreground">{videoEnabled ? 'Video' : 'Video'}</span>
      </div>
    </TooltipProvider>
  );
}
