import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import { CheckCircle, XCircle, AlertCircle, Award } from 'lucide-react';

interface QuizModalProps {
  title: string;
  questions: QuizQuestion[];
  onClose: () => void;
  onComplete: (score: number) => void;
}

const QuizModal: React.FC<QuizModalProps> = ({ title, questions, onClose, onComplete }) => {
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (submitted) return;
    setUserAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmit = () => {
    // Calculate score
    let correctCount = 0;
    questions.forEach(q => {
      if (userAnswers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });
    
    const percentage = Math.round((correctCount / questions.length) * 100);
    setScore(percentage);
    setSubmitted(true);
    onComplete(percentage);
  };

  const allAnswered = questions.every(q => userAnswers[q.id] !== undefined);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-teal-600 p-6 flex justify-between items-center text-white">
          <div>
            <h3 className="text-xl font-bold">Quiz: {title}</h3>
            <p className="text-teal-100 text-sm">{questions.length} Questions</p>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-50">
          {!submitted ? (
            questions.map((q, idx) => (
              <div key={q.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <p className="font-semibold text-slate-800 mb-4 text-lg">
                  <span className="text-teal-600 mr-2">{idx + 1}.</span> {q.question}
                </p>
                <div className="space-y-2">
                  {q.options.map((opt, optIdx) => (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(q.id, optIdx)}
                      className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${
                        userAnswers[q.id] === optIdx
                          ? 'bg-teal-50 border-teal-500 text-teal-800 ring-1 ring-teal-500'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`w-4 h-4 rounded-full border mr-3 flex items-center justify-center ${
                          userAnswers[q.id] === optIdx ? 'border-teal-500' : 'border-slate-300'
                        }`}>
                          {userAnswers[q.id] === optIdx && <div className="w-2 h-2 rounded-full bg-teal-500" />}
                        </div>
                        {opt}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-teal-100 text-teal-600 rounded-full mb-6">
                <Award className="w-12 h-12" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Quiz Completed!</h2>
              <p className="text-slate-600 text-lg mb-8">You scored <span className="font-bold text-teal-600">{score}%</span></p>
              
              <div className="text-left space-y-6">
                 <h4 className="font-bold text-slate-700 border-b pb-2">Review Answers</h4>
                 {questions.map((q, idx) => {
                   const isCorrect = userAnswers[q.id] === q.correctAnswer;
                   return (
                     <div key={q.id} className={`p-4 rounded-lg border ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                       <div className="flex items-start gap-3">
                         {isCorrect ? <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" /> : <XCircle className="w-5 h-5 text-red-600 mt-0.5" />}
                         <div>
                           <p className="font-semibold text-slate-800 mb-1">{q.question}</p>
                           <p className="text-sm">
                             <span className="font-medium text-slate-500">Your Answer: </span> 
                             <span className={isCorrect ? 'text-green-700' : 'text-red-700'}>{q.options[userAnswers[q.id]]}</span>
                           </p>
                           {!isCorrect && (
                             <p className="text-sm mt-1 text-slate-600">
                               <span className="font-medium text-slate-500">Correct Answer: </span> {q.options[q.correctAnswer]}
                             </p>
                           )}
                         </div>
                       </div>
                     </div>
                   );
                 })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-white border-t border-slate-100 flex justify-end gap-3">
          {!submitted ? (
            <>
              <button 
                onClick={onClose}
                className="px-6 py-2.5 text-slate-600 font-medium hover:bg-slate-50 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!allAnswered}
                className="px-6 py-2.5 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                Submit Quiz
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors shadow-sm"
            >
              Close & Return
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizModal;