import React, { useState } from 'react';
import { LessonPlan } from '../types';
import { SparklesIcon, PaletteIcon, YoutubeIcon, CheckCircleIcon, BookOpenIcon, LayersIcon, DownloadIcon } from './Icons';

interface PlanDisplayProps {
  plan: LessonPlan;
  onExport: () => void;
}

const SectionCard = ({ title, icon, children, className = "" }: { title: string; icon: React.ReactNode; children?: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6 ${className}`}>
    <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
      <div className="text-indigo-600">{icon}</div>
      <h3 className="font-semibold text-lg text-slate-800">{title}</h3>
    </div>
    <div className="p-6">
      {children}
    </div>
  </div>
);

export const PlanDisplay: React.FC<PlanDisplayProps> = ({ plan, onExport }) => {
  const [videoLoaded, setVideoLoaded] = useState(false);

  return (
    <div className="w-full max-w-5xl mx-auto animate-fadeIn pb-20 relative">
      
      {/* Header */}
      <div className="text-center mb-10 relative">
        <div className="absolute top-0 right-0 hidden md:block">
            <button 
              onClick={onExport}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
              title="Save Plan as JSON"
            >
              <DownloadIcon className="w-4 h-4" />
              Export JSON
            </button>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium mb-4">
          <BookOpenIcon className="w-4 h-4" />
          {plan.subject} • {plan.gradeLevel}
        </div>
        <h1 className="text-4xl font-bold text-slate-900 mb-4">{plan.topic}</h1>
        <p className="text-slate-500 max-w-2xl mx-auto">
          A comprehensive {plan.duration} lesson plan designed with visual engagement in mind.
        </p>

        {/* Mobile Export Button */}
        <div className="mt-4 md:hidden flex justify-center">
             <button 
              onClick={onExport}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
            >
              <DownloadIcon className="w-4 h-4" />
              Export JSON
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Core Lesson Content */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Procedures */}
          <SectionCard title="Lesson Procedures" icon={<LayersIcon className="w-5 h-5" />}>
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
              {plan.procedures.map((step, idx) => (
                <div key={idx} className="relative flex items-start group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-100 group-[.is-active]:bg-indigo-600 group-[.is-active]:text-white shadow shrink-0 z-10">
                    <span className="font-semibold text-sm">{idx + 1}</span>
                  </div>
                  <div className="ml-6 w-full">
                    <div className="flex items-baseline justify-between mb-1">
                      <h4 className="font-bold text-slate-900">{step.activity}</h4>
                      <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{step.time}</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed text-sm">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Mini Project */}
          <SectionCard title="Mini Project" icon={<SparklesIcon className="w-5 h-5" />}>
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-lg border border-indigo-100">
              <h4 className="font-bold text-indigo-900 text-lg mb-2">{plan.miniProject.title}</h4>
              <p className="text-slate-700 mb-4">{plan.miniProject.description}</p>
              
              <div>
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2 block">Materials Needed</span>
                <div className="flex flex-wrap gap-2">
                  {plan.miniProject.materialsNeeded.map((mat, i) => (
                    <span key={i} className="px-2 py-1 bg-white text-slate-600 text-xs rounded border border-indigo-100 shadow-sm">
                      {mat}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </SectionCard>

          {/* Assessment (Quiz & Exit Ticket) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SectionCard title="Quiz" icon={<CheckCircleIcon className="w-5 h-5" />} className="h-full">
               <ul className="space-y-4">
                 {plan.quiz.map((q, i) => (
                   <li key={i} className="bg-slate-50 p-3 rounded-lg text-sm">
                     <p className="font-medium text-slate-800 mb-2">{i + 1}. {q.question}</p>
                     <ul className="pl-4 list-disc text-slate-500 text-xs space-y-1 mb-2">
                        {q.options.map((opt, oi) => <li key={oi}>{opt}</li>)}
                     </ul>
                     <p className="text-green-600 text-xs font-semibold">Answer: {q.correctAnswer}</p>
                   </li>
                 ))}
               </ul>
            </SectionCard>

            <SectionCard title="Exit Ticket" icon={<BookOpenIcon className="w-5 h-5" />} className="h-full">
              <div className="space-y-3">
                {plan.exitTicket.map((ticket, i) => (
                  <div key={i} className="p-3 bg-yellow-50 border border-yellow-100 rounded-lg text-yellow-900 text-sm italic">
                    "{ticket}"
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>

        </div>

        {/* Right Column: Visuals & Media */}
        <div className="space-y-6">
          
          {/* Canva Visual Style Guide */}
          <SectionCard title="Canva Design Spec" icon={<PaletteIcon className="w-5 h-5" />}>
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Theme & Tone</h4>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800">{plan.visualStyle.themeName}</span>
                  <span className="text-xs px-2 py-1 bg-slate-100 rounded text-slate-600">{plan.visualStyle.tone}</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Color Palette</h4>
                <div className="flex gap-2">
                  {plan.visualStyle.colorPalette.map((color, i) => (
                    <div key={i} className="group relative">
                      <div 
                        className="w-8 h-8 rounded-full border border-slate-200 shadow-sm cursor-pointer"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                        {color}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Font Pairing</h4>
                <p className="text-sm text-slate-700 bg-slate-50 p-2 rounded border border-slate-100 font-mono">
                  {plan.visualStyle.fontPairing}
                </p>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <h4 className="text-sm font-bold text-indigo-600 mb-3 flex items-center gap-2">
                  <SparklesIcon className="w-4 h-4" /> 
                  Magic Media Prompts
                </h4>
                <div className="space-y-3">
                  {plan.visualStyle.canvaPrompts.map((p, i) => (
                    <div key={i} className="text-sm animate-[fadeIn_0.5s_ease-out_forwards]" style={{ animationDelay: `${i * 100}ms` }}>
                      <div className="flex justify-between items-baseline mb-1">
                        <span className="font-medium text-slate-800 text-xs uppercase">{p.element}</span>
                      </div>
                      <div className="bg-slate-800 text-slate-200 p-3 rounded-md text-xs font-mono relative group cursor-pointer hover:bg-slate-700 transition-colors"
                           onClick={() => navigator.clipboard.writeText(p.prompt)}>
                        {p.prompt}
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-[10px] bg-white text-slate-900 px-1 rounded">COPY</div>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{p.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </SectionCard>

          {/* Multimedia / YouTube */}
          <SectionCard title="Multimedia" icon={<YoutubeIcon className="w-5 h-5" />}>
            <div className="aspect-video w-full bg-slate-100 rounded-lg overflow-hidden relative group">
              {/* Shimmer loading state for video */}
              {!videoLoaded && plan.youtubeVideoId && (
                <div className="absolute inset-0 bg-slate-200 animate-pulse flex items-center justify-center z-10">
                   <div className="flex flex-col items-center gap-2">
                      <YoutubeIcon className="w-10 h-10 text-slate-300" />
                      <span className="text-xs font-medium text-slate-400">Loading Video...</span>
                   </div>
                </div>
              )}

              {plan.youtubeVideoId ? (
                <iframe 
                  onLoad={() => setVideoLoaded(true)}
                  width="100%" 
                  height="100%" 
                  src={`https://www.youtube.com/embed/${plan.youtubeVideoId}`} 
                  title="YouTube video player" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                  className={`absolute inset-0 transition-opacity duration-700 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
                ></iframe>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                   <p className="text-slate-500 text-sm mb-4">No specific video ID found automatically.</p>
                   <a 
                     href={`https://www.youtube.com/results?search_query=${encodeURIComponent(plan.youtubeSearchQuery)}`}
                     target="_blank"
                     rel="noreferrer"
                     className="px-4 py-2 bg-red-600 text-white rounded-full text-sm font-medium hover:bg-red-700 transition-colors flex items-center gap-2"
                   >
                     <YoutubeIcon className="w-4 h-4" />
                     Search "{plan.youtubeSearchQuery}"
                   </a>
                </div>
              )}
            </div>
            <div className="mt-3">
              <p className="text-xs text-slate-500 font-medium uppercase mb-1">Recommended Search</p>
              <p className="text-sm text-slate-800 bg-slate-50 p-2 rounded border border-slate-100">
                "{plan.youtubeSearchQuery}"
              </p>
            </div>
          </SectionCard>

        </div>
      </div>
    </div>
  );
};
