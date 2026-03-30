import React, { useState } from 'react';
import { Module } from '../types';
import { BookOpen, ArrowRight, PlayCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import VideoModal from './VideoModal';

interface ModuleCardProps {
  module: Module;
  isAdmin?: boolean;
  onEdit?: (m: Module) => void;
  onDelete?: (id: string) => void;
  progress?: number;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ module, isAdmin, onEdit, onDelete, progress }) => {
  const navigate = useNavigate();
  const [playingVideo, setPlayingVideo] = useState<{url: string, title: string} | null>(null);

  // Helper to find the first available video link
  const firstTopicWithLink = module.topics.find(t => t.links && t.links.length > 0);
  const videoLink = firstTopicWithLink?.links[0];

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col h-full">
        <div className="p-6 flex-1">
          <div className="flex items-center justify-between mb-4">
            <span className="inline-flex items-center justify-center px-3 py-1 text-xs font-semibold text-teal-700 bg-teal-50 rounded-full border border-teal-100">
              {module.topics.length} Topics
            </span>
            <BookOpen className="w-5 h-5 text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2 leading-tight">{module.title}</h3>
          <p className="text-slate-600 text-sm line-clamp-3">{module.description}</p>

          {!isAdmin && videoLink && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setPlayingVideo({ url: videoLink.url, title: firstTopicWithLink?.title || module.title });
              }}
              className="mt-3 inline-flex items-center gap-2 text-sm text-teal-600 font-medium hover:text-teal-800 transition-colors"
            >
              <PlayCircle className="w-4 h-4" />
              {videoLink.label || 'Watch Video'}
            </button>
          )}

          {/* Progress Bar for Learners */}
          {!isAdmin && typeof progress === 'number' && (
            <div className="mt-6">
              <div className="flex justify-between items-center text-xs font-bold mb-2">
                <span className="text-slate-500 uppercase tracking-wider">{progress === 100 ? 'Completed' : 'Progress'}</span>
                <span className={progress === 100 ? 'text-green-600' : 'text-teal-600'}>{progress}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ease-out ${progress === 100 ? 'bg-green-500' : 'bg-teal-600'}`} 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          {isAdmin ? (
            <div className="flex space-x-3 w-full">
              <button 
                onClick={(e) => { e.stopPropagation(); onEdit?.(module); }}
                className="flex-1 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Edit
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); onDelete?.(module.id); }}
                className="flex-1 px-4 py-2 text-sm font-medium text-red-700 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
              >
                Delete
              </button>
            </div>
          ) : (
            <button 
              onClick={() => navigate(`/module/${module.id}`)}
              className="w-full flex items-center justify-center space-x-2 text-teal-700 font-medium hover:text-teal-800 transition-colors group"
            >
              <span>{progress === 100 ? 'Review Module' : (progress && progress > 0) ? 'Continue Module' : 'Start Module'}</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>
      </div>

      {playingVideo && (
        <VideoModal 
          url={playingVideo.url} 
          title={playingVideo.title} 
          onClose={() => setPlayingVideo(null)} 
        />
      )}
    </>
  );
};

export default ModuleCard;