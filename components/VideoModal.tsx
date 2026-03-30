import React from 'react';
import { X } from 'lucide-react';

interface VideoModalProps {
  url: string;
  title: string;
  onClose: () => void;
}

const VideoModal: React.FC<VideoModalProps> = ({ url, title, onClose }) => {
  // Helper to convert YouTube watch links to embed links
  const getEmbedUrl = (inputUrl: string) => {
    try {
      const urlObj = new URL(inputUrl);
      if (urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be')) {
        let videoId = urlObj.searchParams.get('v');
        if (!videoId && urlObj.hostname.includes('youtu.be')) {
          videoId = urlObj.pathname.slice(1);
        }
        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        }
      }
      return inputUrl;
    } catch (e) {
      return inputUrl;
    }
  };

  const embedUrl = getEmbedUrl(url);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-black rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[80vh]">
        <div className="flex items-center justify-between px-4 py-3 bg-slate-900 text-white border-b border-slate-800">
          <h3 className="font-medium truncate pr-4">{title}</h3>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="flex-1 bg-black relative">
          <iframe
            src={embedUrl}
            title={title}
            className="absolute inset-0 w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;