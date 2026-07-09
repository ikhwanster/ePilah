import React, { useState, useMemo } from 'react';
import { Trophy, Medal, Crown, Calendar, Sparkles } from 'lucide-react';
import { Citizen } from '../types';

interface LeaderboardTabProps {
  citizens: Citizen[];
}

export default function LeaderboardTab({ citizens }: LeaderboardTabProps) {
  const [selectedBlock, setSelectedBlock] = useState<string>('semua');

  // Compute unique blocks present in dataset for dropdown filter
  const blocks = useMemo(() => {
    const unique = new Set(citizens.map(c => c.block));
    return Array.from(unique).sort();
  }, [citizens]);

  // Filter & sort citizens by Green Points descending
  const sortedCitizens = useMemo(() => {
    let list = [...citizens];
    if (selectedBlock !== 'semua') {
      list = list.filter(c => c.block === selectedBlock);
    }
    return list.sort((a, b) => b.points - a.points);
  }, [citizens, selectedBlock]);

  // Compute overall Top 3 champions for the visual podium
  const overallTop3 = useMemo(() => {
    return [...citizens].sort((a, b) => b.points - a.points).slice(0, 3);
  }, [citizens]);

  // Custom order for podium: Rank 2 on Left, Rank 1 in Middle, Rank 3 on Right
  const podiumOrder = useMemo(() => {
    const items = [];
    if (overallTop3[1]) {
      items.push({
        data: overallTop3[1],
        rank: 2,
        height: 'h-20',
        color: 'bg-brand-card border-brand-border text-brand-dark',
        label: 'SILVER',
      });
    }
    if (overallTop3[0]) {
      items.push({
        data: overallTop3[0],
        rank: 1,
        height: 'h-28',
        color: 'bg-[#D6E8C1] border-brand-accent text-brand-herotext',
        label: 'GOLD',
        hasCrown: true,
      });
    }
    if (overallTop3[2]) {
      items.push({
        data: overallTop3[2],
        rank: 3,
        height: 'h-16',
        color: 'bg-brand-card/50 border-brand-border/65 text-brand-muted',
        label: 'BRONZE',
      });
    }
    return items;
  }, [overallTop3]);

  return (
    <div className="p-4 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Filter and Podium */}
        <div className="lg:col-span-5 bg-brand-card/75 p-5 rounded-2xl border border-brand-border shadow-sm space-y-4">
          <div className="flex flex-col gap-2">
            <h3 className="font-extrabold text-sm uppercase tracking-wider text-brand-dark font-display flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-brand-primary" /> Papan Peringkat RT 005
            </h3>
            <p className="text-[11px] text-brand-muted leading-relaxed">
              Kompetisi sehat antarrumah warga untuk mewujudkan Taman Buaran Indah IV bebas sampah tak terkelola.
            </p>
          </div>

          {/* Dynamic Filter Dropdown */}
          <div className="flex justify-between items-center pt-2 border-t border-brand-border/40">
            <span className="text-[10px] text-brand-muted font-bold uppercase tracking-wider">
              Filter Wilayah:
            </span>
            <select 
              value={selectedBlock}
              onChange={(e) => setSelectedBlock(e.target.value)}
              className="px-3 py-1.5 bg-white border border-brand-border rounded-xl text-[10px] font-bold focus:outline-none focus:ring-1 focus:ring-brand-primary cursor-pointer uppercase tracking-wider text-brand-text"
            >
              <option value="semua">Semua Blok</option>
              {blocks.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* 3D-Like Visual Podium (rendered if top 3 exists) */}
          {podiumOrder.length > 0 && (
            <div className="grid grid-cols-3 gap-2.5 pt-4 max-w-sm mx-auto items-end text-center select-none">
              {podiumOrder.map((pod) => (
                <div key={pod.data.id} className="flex flex-col items-center flex-1">
                  {pod.hasCrown && (
                    <Crown className="w-5 h-5 text-brand-primary animate-bounce mb-1 fill-brand-accent" />
                  )}
                  <span className="text-[9px] font-black text-brand-dark block truncate w-full px-0.5">
                    {pod.data.name}
                  </span>
                  <span className="text-[8px] text-brand-muted block truncate font-medium">
                    {pod.data.block}-{pod.data.houseNo}
                  </span>
                  <div className={`w-full mt-1.5 border-t-2 border-x-2 rounded-t-2xl flex flex-col justify-between p-1.5 shadow-xs ${pod.color} ${pod.height}`}>
                    <span className="bg-white/95 text-brand-dark font-extrabold text-[9px] w-5 h-5 rounded-full flex items-center justify-center shadow-inner mx-auto mt-1 border border-brand-border">
                      {pod.rank}
                    </span>
                    <div className="text-center pt-2">
                      <span className="font-extrabold text-[10px] block leading-none text-brand-dark">
                        {pod.data.points}
                      </span>
                      <span className="text-[7px] text-brand-muted block uppercase tracking-widest font-black pt-0.5">
                        Poin
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Leaderboard Table List */}
        <div className="lg:col-span-7 bg-brand-card/75 rounded-2xl border border-brand-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-brand-primary/10 border-b border-brand-border text-brand-muted font-extrabold text-[10px] uppercase tracking-wider select-none">
                  <th className="py-3 px-3.5 w-12 text-center">Rank</th>
                  <th className="py-3 px-3">Rumah</th>
                  <th className="py-3 px-3">Penghuni</th>
                  <th className="py-3 px-3 text-center">Berat (kg)</th>
                  <th className="py-3 px-3 text-right">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/40">
                {sortedCitizens.map((citizen, index) => {
                  const overallIndex = citizens.findIndex(c => c.id === citizen.id);
                  const displayRank = overallIndex !== -1 ? overallIndex + 1 : index + 1;
                  
                  let rankBadge: React.ReactNode = (
                    <span className="text-brand-muted font-bold text-[11px]">{displayRank}</span>
                  );

                  if (displayRank === 1) {
                    rankBadge = <Crown className="w-4 h-4 text-brand-primary mx-auto fill-brand-accent" />;
                  } else if (displayRank === 2) {
                    rankBadge = <Medal className="w-4 h-4 text-brand-muted mx-auto fill-brand-border" />;
                  } else if (displayRank === 3) {
                    rankBadge = <Medal className="w-4 h-4 text-brand-dark mx-auto fill-brand-card" />;
                  }

                  const isTop1 = displayRank === 1;

                  return (
                    <tr 
                      key={citizen.id} 
                      className={`hover:bg-brand-bg/50 transition-all ${isTop1 ? 'bg-[#D6E8C1]/30' : ''}`}
                    >
                      <td className="py-3 px-2 text-center shrink-0">
                        {rankBadge}
                      </td>
                      <td className="py-3 px-3 font-bold text-brand-dark">
                        {citizen.block} No. {citizen.houseNo}
                      </td>
                      <td className="py-3 px-3 text-brand-muted max-w-[90px] truncate">
                        {citizen.name}
                      </td>
                      <td className="py-3 px-3 text-center font-semibold text-brand-dark">
                        {citizen.weight.toFixed(1)}
                      </td>
                      <td className="py-3 px-3 text-right font-black text-brand-primary text-[13px]">
                        {citizen.points.toLocaleString('id-ID')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
