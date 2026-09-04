import React from 'react';
import { Layers, Sparkles, FileCode2, ShieldCheck, RefreshCw } from 'lucide-react';
import { ALL_PRESETS } from '../data/presets';
import { CharacterAsset, SceneBlueprint } from '../types';

interface HeaderProps {
  onLoadPreset: (preset: {
    characters: CharacterAsset[];
    blueprint: SceneBlueprint;
  }) => void;
  onOpenBlueprint: () => void;
  characterCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onLoadPreset,
  onOpenBlueprint,
  characterCount,
}) => {
  return (
    <header className="photo-toolbar sticky top-0 z-40 text-white backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-md shadow-slate-900/10">
            <Layers className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-[#fffaf4] tracking-tight">
                2D AI Scene Composer
              </h1>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                多人物 AI 场景编排器
              </span>
            </div>
            <p className="text-xs text-white/60 font-medium">
              让用户先决定“谁在哪里”，再让 AI 决定“画成什么样”
            </p>
          </div>
        </div>

        {/* Action Controls & Presets */}
        <div className="flex items-center flex-wrap gap-2 sm:gap-3">
          {/* Presets quick load */}
          <div className="preset-strip flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 p-1.5 backdrop-blur-md max-w-full overflow-x-auto">
            <span className="shrink-0 px-2 text-[10px] font-bold uppercase tracking-[.14em] text-[#f7dfaa] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> 场景
            </span>
            {ALL_PRESETS.map((preset, idx) => (
              <button
                key={preset.name}
                type="button"
                id={`preset-btn-${idx}`}
                onClick={() => onLoadPreset(preset)}
                className="group relative h-12 w-24 shrink-0 overflow-hidden rounded-xl border border-white/20 text-left shadow-lg transition-all hover:-translate-y-0.5 hover:border-[#f7dfaa]"
                title={preset.description}
              >
                <img src={preset.blueprint.backgroundImage || '/images/hero-paris-picnic.png'} alt="" className="absolute inset-0 size-full object-cover transition-transform group-hover:scale-110" />
                <span className="absolute inset-0 bg-gradient-to-t from-[#17212b] via-[#17212b]/20 to-transparent" />
                <span className="absolute bottom-1 left-2 right-1 truncate text-[10px] font-bold text-white">{preset.name.split(' ')[0]}</span>
              </button>
            ))}
          </div>

          {/* Identity lock guarantee indicator */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200/60 text-emerald-800 text-xs font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Character ID 锁定中 ({characterCount})</span>
          </div>

          {/* Blueprint modal trigger */}
          <button
            type="button"
            id="open-blueprint-btn"
            onClick={onOpenBlueprint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium shadow-xs transition-all"
          >
            <FileCode2 className="w-3.5 h-3.5 text-slate-300" />
            <span>Scene Blueprint</span>
          </button>
        </div>
      </div>
    </header>
  );
};
