import React, { useState, useEffect } from 'react';
import { Module, User, ModuleProgress, UserProgress } from '../types';
import { BookOpen, ArrowRight, PlayCircle, CheckCircle, Circle, Award } from 'lucide-react';
import { useNavigate, useParams, Navigate, Link } from 'react-router-dom';
import VideoModal from './VideoModal';
import QuizModal from './QuizModal';

interface ModuleDetailProps {
  modules: Module[];
}

const ModuleDetail: React.FC<ModuleDetailProps> = ({ modules }) => {
  const { id } = useParams<{ id: string }>();
  const module = modules.find(m => m.id === id);
  const [playingVideo, setPlayingVideo] = useState<{url: string, title: string} | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  
  // Tracking State
  const [progress, setProgress] = useState<ModuleProgress>({
    moduleId: id || '',
    completedTopicIds: [],
    status: 'not-started',
    lastAccessed: new Date().toISOString()
  });

  useEffect(() => {
    // Get current user
    const currentUser = JSON.parse(localStorage.getItem('fh_current_user') || 'null');
    setUser(currentUser);

    if (currentUser && id) {
      // Load progress
      const allProgress = JSON.parse(localStorage.getItem('fh_user_progress') || '{}');
      const userProg = allProgress[currentUser.username] || { modules: {} };
      if (userProg.modules[id]) {
        setProgress(userProg.modules[id]);
      }
    }
  }, [id]);

  const saveProgress = (newProgress: ModuleProgress) => {
    if (!user || !id) return;
    
    const allProgress = JSON.parse(localStorage.getItem('fh_user_progress') || '{}');
    const userProg = allProgress[user.username] || { username: user.username, modules: {} };
    
    userProg.modules[id] = newProgress;
    allProgress[user.username] = userProg;
    
    localStorage.setItem('fh_user_progress', JSON.stringify(allProgress));
    setProgress(newProgress);
  };

  const handleTopicClick = (topicId: string, isVideo: boolean, url?: string, title?: string) => {
    if (isVideo && url && title) {
      setPlayingVideo({ url, title });
    }

    // Mark as complete if not already
    if (!progress.completedTopicIds.includes(topicId)) {
      const updatedTopics = [...progress.completedTopicIds, topicId];
      const newStatus = updatedTopics.length === module?.topics.length ? 'completed' : 'in-progress';
      
      saveProgress({
        ...progress,
        completedTopicIds: updatedTopics,
        status: newStatus,
        lastAccessed: new Date().toISOString()
      });
    }
  };

  const toggleTopicComplete = (topicId: string) => {
    let updatedTopics;
    if (progress.completedTopicIds.includes(topicId)) {
      updatedTopics = progress.completedTopicIds.filter(tid => tid !== topicId);
    } else {
      updatedTopics = [...progress.completedTopicIds, topicId];
    }
    
    const newStatus = module && updatedTopics.length === module.topics.length ? 'completed' : 'in-progress';
    
    saveProgress({
      ...progress,
      completedTopicIds: updatedTopics,
      status: newStatus,
      lastAccessed: new Date().toISOString()
    });
  };

  const handleQuizComplete = (score: number) => {
    saveProgress({
      ...progress,
      quizScore: score,
      status: 'completed', // Finishing quiz usually implies module mastery
      lastAccessed: new Date().toISOString()
    });
    // Don't close immediately, let them see result
  };

  if (!module) return <Navigate to="/dashboard" />;

  const completionPercentage = Math.round((progress.completedTopicIds.length / module.topics.length) * 100);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <div className="flex justify-between items-start">
           <div>
             <Link to="/dashboard" className="text-teal-600 font-medium hover:underline mb-4 inline-block">&larr; Back to Modules</Link>
             <h1 className="text-3xl font-bold text-slate-900 mb-4">{module.title}</h1>
           </div>
           
           {/* Progress Badge */}
           <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 min-w-[200px]">
             <div className="flex justify-between text-sm font-semibold text-slate-700 mb-2">
               <span>Progress</span>
               <span>{completionPercentage}%</span>
             </div>
             <div className="w-full bg-slate-100 rounded-full h-2.5">
               <div className="bg-teal-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${completionPercentage}%` }}></div>
             </div>
             {progress.quizScore !== undefined && (
               <div className="mt-3 pt-3 border-t border-slate-100 text-sm flex items-center justify-between">
                 <span className="text-slate-500">Quiz Score:</span>
                 <span className={`font-bold ${progress.quizScore >= 80 ? 'text-green-600' : 'text-amber-600'}`}>
                   {progress.quizScore}%
                 </span>
               </div>
             )}
           </div>
        </div>
        <p className="text-lg text-slate-600 leading-relaxed mt-4">{module.description}</p>
      </div>

      <div className="space-y-6">
        {module.topics.map((topic, idx) => {
          const isCompleted = progress.completedTopicIds.includes(topic.id);
          return (
            <div key={topic.id} className={`bg-white border rounded-xl overflow-hidden shadow-sm transition-all ${isCompleted ? 'border-teal-200' : 'border-slate-200 hover:shadow-md'}`}>
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <button 
                    onClick={() => toggleTopicComplete(topic.id)}
                    className={`flex-shrink-0 mt-1 transition-colors ${isCompleted ? 'text-teal-600' : 'text-slate-300 hover:text-slate-400'}`}
                    title={isCompleted ? "Mark incomplete" : "Mark complete"}
                  >
                    {isCompleted ? <CheckCircle className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                  </button>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className={`text-xl font-bold mb-2 ${isCompleted ? 'text-slate-600' : 'text-slate-900'}`}>{topic.title}</h3>
                      {isCompleted && <span className="text-xs font-bold bg-teal-50 text-teal-700 px-2 py-1 rounded border border-teal-100">COMPLETED</span>}
                    </div>
                    <p className="text-slate-600 mb-4">{topic.summary}</p>
                    
                    <div className="flex flex-wrap gap-3">
                      {topic.links.map((link, i) => (
                        <button 
                          key={i} 
                          onClick={() => handleTopicClick(topic.id, true, link.url, topic.title)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-700 border border-slate-200 rounded-lg hover:bg-teal-50 hover:text-teal-700 hover:border-teal-200 transition-colors text-sm font-medium group"
                        >
                          <PlayCircle className="w-4 h-4 text-slate-400 group-hover:text-teal-600" />
                          {link.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-10 p-8 bg-gradient-to-r from-teal-50 to-white border border-teal-100 rounded-xl flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white rounded-full shadow-sm text-teal-600">
             <Award className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-teal-900">Module Quiz</h3>
            <p className="text-teal-700 mt-1">
              {progress.quizScore !== undefined 
                ? `You have completed this quiz with a score of ${progress.quizScore}%.` 
                : "Ready to test your knowledge? Take the assessment to complete this module."}
            </p>
          </div>
        </div>
        <button 
          onClick={() => setShowQuiz(true)}
          className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg shadow-sm font-bold transition-all ${
            progress.quizScore !== undefined 
              ? 'bg-white text-teal-700 border border-teal-200 hover:bg-teal-50' 
              : 'bg-teal-600 text-white hover:bg-teal-700'
          }`}
        >
          {progress.quizScore !== undefined ? 'Retake Quiz' : 'Start Quiz'} 
        </button>
      </div>

      {playingVideo && (
        <VideoModal 
          url={playingVideo.url} 
          title={playingVideo.title} 
          onClose={() => setPlayingVideo(null)} 
        />
      )}

      {showQuiz && (
        <QuizModal 
          title={module.title}
          questions={module.questions || []}
          onClose={() => setShowQuiz(false)}
          onComplete={handleQuizComplete}
        />
      )}
    </div>
  );
};

export default ModuleDetail;