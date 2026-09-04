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
    <header className="border-b border-white/20 bg-[#17212b]/90 text-white backdrop-blur-xl sticky top-0 z-40 shadow-[0_8px_30px_rgba(23,33,43,.18)]">
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
          <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-lg border border-slate-200">
            <span className="text-xs text-slate-500 font-medium px-2 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> 快速预设:
            </span>
            {ALL_PRESETS.map((preset, idx) => (
              <button
                key={preset.name}
                type="button"
                id={`preset-btn-${idx}`}
                onClick={() => onLoadPreset(preset)}
                className="px-2.5 py-1 text-xs font-medium rounded-md bg-white text-slate-700 hover:bg-slate-50 hover:text-indigo-600 shadow-xs border border-slate-200/80 transition-all"
                title={preset.description}
              >
                {preset.name.split(' ')[0]}
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
