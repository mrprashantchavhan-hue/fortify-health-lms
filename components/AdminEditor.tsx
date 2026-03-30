import React, { useState, useEffect } from 'react';
import { Module, Topic } from '../types';
import { X, Plus, Trash2 } from 'lucide-react';

interface AdminEditorProps {
  initialData?: Module;
  onSave: (module: Module) => void;
  onCancel: () => void;
  saveLabel?: string;
}

const AdminEditor: React.FC<AdminEditorProps> = ({ initialData, onSave, onCancel, saveLabel = 'Save Module' }) => {
  const [formData, setFormData] = useState<Module>({
    id: `m${Date.now()}`,
    title: '',
    description: '',
    quizLink: '',
    topics: []
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const addTopic = () => {
    const newTopic: Topic = {
      id: `t${Date.now()}`,
      title: 'New Topic',
      summary: '',
      links: []
    };
    setFormData({ ...formData, topics: [...formData.topics, newTopic] });
  };

  const updateTopic = (index: number, field: keyof Topic, value: any) => {
    const updatedTopics = [...formData.topics];
    updatedTopics[index] = { ...updatedTopics[index], [field]: value };
    setFormData({ ...formData, topics: updatedTopics });
  };

  const removeTopic = (index: number) => {
    const updatedTopics = formData.topics.filter((_, i) => i !== index);
    setFormData({ ...formData, topics: updatedTopics });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">
            {initialData ? 'Edit Module' : 'Create New Module'}
          </h2>
          <button onClick={onCancel} className="text-slate-400 hover:text-slate-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Module Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                placeholder="e.g. Module 1: Introduction"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                placeholder="Brief summary of the module..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Quiz Link</label>
              <input
                type="text"
                value={formData.quizLink}
                onChange={(e) => setFormData({ ...formData, quizLink: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="border-t border-slate-100 pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-slate-800">Topics</h3>
              <button
                type="button"
                onClick={addTopic}
                className="flex items-center text-sm text-teal-600 font-medium hover:text-teal-700"
              >
                <Plus className="w-4 h-4 mr-1" /> Add Topic
              </button>
            </div>

            <div className="space-y-4">
              {formData.topics.map((topic, idx) => (
                <div key={topic.id} className="bg-slate-50 p-4 rounded-lg border border-slate-200 relative group">
                  <button 
                    type="button"
                    onClick={() => removeTopic(idx)}
                    className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors"
                    title="Delete Topic"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <div className="grid gap-3 pr-8">
                    <input
                      type="text"
                      value={topic.title}
                      onChange={(e) => updateTopic(idx, 'title', e.target.value)}
                      className="px-3 py-2 border border-slate-300 rounded-md text-sm w-full"
                      placeholder="Topic Title"
                    />
                    <textarea
                      value={topic.summary}
                      onChange={(e) => updateTopic(idx, 'summary', e.target.value)}
                      className="px-3 py-2 border border-slate-300 rounded-md text-sm w-full"
                      rows={2}
                      placeholder="Topic Summary"
                    />
                  </div>
                </div>
              ))}
              {formData.topics.length === 0 && (
                <div className="text-center py-8 text-slate-400 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
                  No topics added yet.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 flex justify-end space-x-3 bg-slate-50 rounded-b-xl">
          <button
            onClick={onCancel}
            className="px-6 py-2 text-slate-600 font-medium hover:bg-white border border-transparent hover:border-slate-200 rounded-lg transition-all"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(formData)}
            className="px-6 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 shadow-sm transition-all"
          >
            {saveLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminEditor;