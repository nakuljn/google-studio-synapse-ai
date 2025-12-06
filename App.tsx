import React from 'react';
import { HashRouter, Routes, Route, Outlet } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Missions } from './pages/Missions';
import { MissionBriefing } from './pages/CourseView';
import { Squad } from './pages/Lab';
import { Wargames } from './pages/Arena';
import { ArenaBattle } from './pages/ArenaBattle';
import { Settings } from './pages/Settings';
import { Manual } from './pages/Manual';
import { Weapons } from './pages/Weapons';
import { PlaygroundPage } from './pages/PlaygroundPage';
import { Playground } from './components/Playground';

const AppLayout = () => {
    return (
        <Layout>
            <Outlet />
        </Layout>
    )
}

const BuilderLayout = () => {
    return (
        <Layout defaultCollapsed={true}>
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
          
          {/* 1. Agents (Characters) */}
          <Route path="/squad" element={<Squad />} />
          
          {/* 2. Weapons (Tools) */}
          <Route path="/weapons" element={<Weapons />} />

          {/* 3. Training (Offline Practice) */}
          <Route path="/training" element={<PlaygroundPage />} />
          
          {/* 4. Missions (Campaign) */}
          <Route path="/missions" element={<Missions />} />
          
          {/* 5. Arena (PvP) */}
          <Route path="/wargames" element={<Wargames />} />
          
          {/* 6. Academy (Manual) */}
          <Route path="/manual" element={<Manual />} />
          
          <Route path="/settings" element={<Settings />} />
        </Route>
        
        {/* Builder Routes with Collapsed Sidebar */}
        <Route element={<BuilderLayout />}>
           <Route path="/builder/:agentId" element={<Playground mode="builder" />} />
           <Route path="/playground/raw" element={<Playground mode="raw" />} />
        </Route>

        {/* Pure Fullscreen Routes */}
        <Route element={<FullscreenLayout />}>
           <Route path="/missions/:opId" element={<MissionBriefing />} />
           <Route path="/arena/lobby/:gameId" element={<div className="p-10 text-white">Lobby System Placeholder. <br/>Would allow selecting Squad Member to deploy.</div>} /> 
           <Route path="/arena/:levelId" element={<ArenaBattle />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;