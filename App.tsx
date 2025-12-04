
import React from 'react';
import { HashRouter, Routes, Route, Outlet } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Courses } from './pages/Courses';
import { CourseView } from './pages/CourseView';
import { LessonView } from './pages/LessonView';
import { Achievements } from './pages/Achievements';
import { Lab } from './pages/Lab';
import { Community } from './pages/Community';
import { Arena } from './pages/Arena';
import { ArenaBattle } from './pages/ArenaBattle';
import { Bounties } from './pages/Bounties';
import { Settings } from './pages/Settings';

const AppLayout = () => {
    return (
        <Layout>
            <Outlet />
        </Layout>
    )
}

const FullscreenLayout = () => {
    return (
        <div className="h-screen w-screen bg-black text-slate-200">
            <Outlet />
        </div>
    )
}

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          {/* Intel Routes */}
          <Route path="/intel" element={<Courses />} />
          <Route path="/course/:courseId" element={<CourseView />} />
          
          {/* Engineering Routes */}
          <Route path="/workshop" element={<Lab />} />
          <Route path="/community" element={<Community />} />
          
          {/* Ops Routes */}
          <Route path="/network" element={<Arena />} />
          <Route path="/bounties" element={<Bounties />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        
        <Route element={<FullscreenLayout />}>
           <Route path="/course/:courseId/lesson/:lessonId" element={<LessonView />} />
           <Route path="/arena/:levelId" element={<ArenaBattle />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
