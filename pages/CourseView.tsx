import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { MOCK_COURSES } from '../constants';
import { ChevronLeft, PlayCircle, CheckCircle, Lock } from 'lucide-react';

export const CourseView: React.FC = () => {
  const { courseId } = useParams();
  const course = MOCK_COURSES.find(c => c.id === courseId);

  if (!course) {
    return <div className="p-10 text-center text-slate-400">Course not found.</div>;
  }

  return (
    <div className="flex flex-col h-full bg-dark-bg">
      {/* Hero Header */}
      <div className="relative h-64 bg-dark-surface border-b border-dark-border flex-shrink-0">
         <img src={course.image} alt={course.title} className="w-full h-full object-cover opacity-20" />
         <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-transparent" />
         <div className="absolute bottom-0 left-0 p-8 w-full max-w-4xl">
            <Link to="/" className="text-slate-400 hover:text-white text-sm flex items-center mb-4 transition-colors">
                <ChevronLeft size={16} className="mr-1" /> Back to Dashboard
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{course.title}</h1>
            <p className="text-slate-300 max-w-2xl">{course.description}</p>
         </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="max-w-4xl mx-auto space-y-8">
            {course.modules.length === 0 && (
                <div className="text-center py-20 text-slate-500 bg-dark-surface rounded-xl border border-dark-border border-dashed">
                    This course is currently under construction. Check back later!
                </div>
            )}
            
            {course.modules.map((module, mIndex) => (
                <div key={module.id} className="space-y-4">
                    <h3 className="text-lg font-semibold text-brand-300 uppercase tracking-wide text-xs mb-4 ml-1">
                        Module {mIndex + 1}: {module.title}
                    </h3>
                    <div className="bg-dark-surface border border-dark-border rounded-xl overflow-hidden divide-y divide-dark-border">
                        {module.lessons.map((lesson, lIndex) => (
                            <Link 
                                key={lesson.id} 
                                to={`/course/${course.id}/lesson/${lesson.id}`}
                                className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors group"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="text-slate-500 group-hover:text-brand-400 transition-colors">
                                        {mIndex === 0 && lIndex === 0 ? <PlayCircle size={20} /> : <Lock size={20} />} 
                                        {/* Logic above is just mock logic for locked state */}
                                    </div>
                                    <div>
                                        <h4 className="text-slate-200 font-medium group-hover:text-white">{lesson.title}</h4>
                                        <p className="text-xs text-slate-500">Interactive Lab</p>
                                    </div>
                                </div>
                                <div className="px-3 py-1 bg-dark-bg rounded text-xs text-slate-400 font-mono group-hover:bg-brand-900 group-hover:text-brand-300 transition-colors">
                                    Start
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};
