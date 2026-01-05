export interface CanvaPrompt {
  element: string;
  prompt: string;
  description: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface LessonProcedure {
  time: string;
  activity: string;
  description: string;
}

export interface LessonPlan {
  topic: string;
  gradeLevel: string;
  subject: string;
  duration: string;
  
  // Visual Style & Canva
  visualStyle: {
    themeName: string;
    tone: string;
    colorPalette: string[];
    fontPairing: string;
    canvaPrompts: CanvaPrompt[];
  };

  // Content
  procedures: LessonProcedure[];
  
  // Assessment
  quiz: QuizQuestion[];
  exitTicket: string[];
  
  // Projects & Media
  miniProject: {
    title: string;
    description: string;
    materialsNeeded: string[];
  };
  
  youtubeSearchQuery: string;
  youtubeVideoId?: string; // Optional if we can extract it
}

export interface GeneratorFormData {
  topic: string;
  gradeLevel: string;
  subject: string;
  duration: string;
  visualTheme: string;
  customQuestions?: string;
}
