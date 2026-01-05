import React, { useState } from 'react';
import { generateLessonPlan } from './services/gemini';
import { LessonPlan, GeneratorFormData } from './types';
import { GRADE_LEVELS, SUBJECTS, DURATIONS, VISUAL_THEMES } from './constants';
import { PlanDisplay } from './components/PlanDisplay';
import { SparklesIcon } from './components/Icons';

function App() {
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<LessonPlan | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<GeneratorFormData>({
    topic: '',
    gradeLevel: GRADE_LEVELS[0],
    subject: SUBJECTS[0],
    duration: DURATIONS[1],
    visualTheme: VISUAL_THEMES[0],
    customQuestions: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.topic) return;

    setLoading(true);
    setError(null);
    setPlan(null);

    try {
      const generatedPlan = await generateLessonPlan(
        formData.topic,
        formData.gradeLevel,
        formData.subject,
        formData.duration,
        formData.visualTheme,
        formData.customQuestions
      );
      setPlan(generatedPlan);
    } catch (err) {
      setError("Failed to generate lesson plan. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleExportJson = () => {
    if (!plan) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(plan, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${plan.topic.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_lesson_plan.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
              <SparklesIcon className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl text-slate-900 tracking-tight">CanvaClass<span className="text-indigo-600">Architect</span></span>
          </div>
          <div>
            <a href="https://canva.com" target="_blank" rel="noreferrer" className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">
              Open Canva
            </a>
          </div>
        </div>
      </nav>

      <main className="flex-1 bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
        
        {/* Input Section */}
        {!plan && (
          <div className="max-w-2xl mx-auto mt-10 animate-fadeInUp">
            <div className="text-center mb-10">
              <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Design Beautiful Lessons</h1>
              <p className="text-lg text-slate-600">
                Generate structured lesson plans complete with <span className="text-indigo-600 font-semibold">Canva visual prompts</span>, 
                quizzes, and curated multimedia resources in seconds.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Lesson Topic</label>
                  <input
                    type="text"
                    name="topic"
                    required
                    placeholder="e.g. The Water Cycle, Introduction to Python, The Cold War"
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                    value={formData.topic}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Subject</label>
                    <div className="relative">
                      <select
                        name="subject"
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white transition-all outline-none"
                        value={formData.subject}
                        onChange={handleInputChange}
                      >
                        {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Visual Theme</label>
                    <select
                      name="visualTheme"
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white transition-all outline-none"
                      value={formData.visualTheme}
                      onChange={handleInputChange}
                    >
                      {VISUAL_THEMES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Grade Level</label>
                    <select
                      name="gradeLevel"
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white transition-all outline-none"
                      value={formData.gradeLevel}
                      onChange={handleInputChange}
                    >
                      {GRADE_LEVELS.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Duration</label>
                    <select
                      name="duration"
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white transition-all outline-none"
                      value={formData.duration}
                      onChange={handleInputChange}
                    >
                      {DURATIONS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                   <label className="block text-sm font-medium text-slate-700 mb-2">
                     Custom Questions (Optional)
                     <span className="ml-2 text-xs font-normal text-slate-400">Add specific questions for the quiz or exit ticket</span>
                   </label>
                   <textarea
                     name="customQuestions"
                     rows={3}
                     placeholder="e.g. 1. What is the boiling point of water? 2. Explain the difference between..."
                     className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none resize-y"
                     value={formData.customQuestions}
                     onChange={handleInputChange}
                   />
                </div>

                <button
                  type="submit"
                  disabled={loading || !formData.topic}
                  className={`w-full py-4 px-6 rounded-lg text-white font-bold text-lg shadow-lg transform transition-all 
                    ${loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-0.5 hover:shadow-xl'}
                    flex items-center justify-center gap-2`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Designing Curriculum...
                    </>
                  ) : (
                    <>
                      <SparklesIcon />
                      Generate Lesson Plan
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Loading Skeleton / Messages */}
        {loading && !plan && (
           <div className="max-w-4xl mx-auto mt-20 text-center space-y-4 animate-pulse">
             <div className="h-8 bg-slate-200 rounded w-1/3 mx-auto"></div>
             <div className="h-4 bg-slate-200 rounded w-1/4 mx-auto"></div>
             <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="h-64 bg-slate-200 rounded-xl"></div>
               <div className="h-64 bg-slate-200 rounded-xl col-span-2"></div>
             </div>
           </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto mt-10 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-center">
            {error}
            <button 
              onClick={() => setError(null)}
              className="block mx-auto mt-2 text-sm font-bold hover:underline"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Result Display */}
        {plan && (
          <>
            <div className="mb-6 flex justify-center">
              <button 
                onClick={() => setPlan(null)}
                className="text-slate-500 hover:text-slate-800 text-sm font-medium flex items-center gap-1 transition-colors"
              >
                ← Create Another Plan
              </button>
            </div>
            <PlanDisplay plan={plan} onExport={handleExportJson} />
          </>
        )}

      </main>

      <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm">
          Powered by Gemini • Designed for Educators
        </div>
      </footer>
    </div>
  );
}

export default App;
