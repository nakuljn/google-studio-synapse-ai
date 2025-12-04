
import React from 'react';
import { Trophy, Medal, Crown } from 'lucide-react';
import { LEADERBOARD } from '../constants';

export const Achievements: React.FC = () => {
  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Leaderboard</h1>
        <p className="text-slate-400">Top Engineers of the Season</p>
      </div>

      <div className="bg-dark-surface border border-dark-border rounded-xl overflow-hidden">
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-dark-border bg-dark-bg/50 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <div className="col-span-1 text-center">Rank</div>
              <div className="col-span-6">User</div>
              <div className="col-span-3 text-right">XP</div>
              <div className="col-span-2 text-center">Badges</div>
          </div>
          
          <div className="divide-y divide-dark-border">
              {LEADERBOARD.map((user) => (
                  <div key={user.username} className={`grid grid-cols-12 gap-4 p-4 items-center ${user.rank === 1 ? 'bg-brand-900/10' : ''}`}>
                      <div className="col-span-1 flex justify-center">
                          {user.rank === 1 ? <Crown size={20} className="text-yellow-400" /> : 
                           user.rank === 2 ? <Medal size={20} className="text-slate-300" /> : 
                           user.rank === 3 ? <Medal size={20} className="text-amber-600" /> : 
                           <span className="font-mono text-slate-500 font-bold">#{user.rank}</span>}
                      </div>
                      <div className="col-span-6 flex items-center space-x-3">
                          <div className="text-2xl">{user.avatar}</div>
                          <span className={`font-bold ${user.rank === 1 ? 'text-white' : 'text-slate-300'}`}>{user.username}</span>
                      </div>
                      <div className="col-span-3 text-right font-mono text-brand-400 font-bold">
                          {user.xp.toLocaleString()}
                      </div>
                      <div className="col-span-2 text-center text-slate-500 text-sm">
                          {user.badges}
                      </div>
                  </div>
              ))}
          </div>
      </div>
    </div>
  );
};