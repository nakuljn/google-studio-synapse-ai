import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { MOCK_COURSES } from '../constants';
import { Playground } from '../components/Playground';
import ReactMarkdown from 'react-markdown';
import { ChevronLeft, Menu } from 'lucide-react';

export const LessonView: React.FC = () => {
  const { courseId, lessonId } = useParams();
  
  // Flatten lookup for simplicity
  const course = MOCK_COURSES.find(c => c.id === courseId);
  const module = course?.modules.find(m => m.lessons.some(l => l.id === lessonId));
  const lesson = module?.lessons.find(l => l.id === lessonId);

  if (!lesson || !course) {
    return <div className="p-10 text-center text-slate-400">Lesson not found.</div>;
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Lesson Header */}
      <header className="h-14 bg-dark-bg border-b border-dark-border flex items-center justify-between px-4 flex-shrink-0">
         <div className="flex items-center space-x-4">
            <Link to={`/course/${courseId}`} className="text-slate-400 hover:text-white transition-colors">
                <ChevronLeft size={20} />
            </Link>
            <div className="flex flex-col">
                <span className="text-xs text-slate-500">{course.title}</span>
                <h1 className="text-sm font-bold text-white">{lesson.title}</h1>
            </div>
         </div>
      </header>

      {/* Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left: Lesson Material */}
        <div className="flex-1 lg:max-w-[40%] bg-dark-surface overflow-y-auto border-r border-dark-border">
            <div className="p-6 md:p-8 prose prose-invert prose-slate max-w-none">
                <ReactMarkdown>{lesson.content}</ReactMarkdown>
            </div>
        </div>

        {/* Right: Playground */}
        <div className="flex-1 relative">
            <Playground 
                lessonId={lesson.id}
                initialState={lesson.initialPlaygroundState} 
                lessonContext={lesson.content}
                validationCriteria={lesson.validationCriteria}
            />
        </div>
      </div>
    </div>
  );
};
