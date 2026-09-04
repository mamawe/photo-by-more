import React from 'react';
import {
  Sparkles,
  Sun,
  Camera,
  Palette,
  MapPin,
  Wand2,
  FileCode2,
  Layers,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { SceneBlueprint } from '../types';

interface SceneConfigPanelProps {
  blueprint: SceneBlueprint;
  onUpdateBlueprint: (patch: Partial<SceneBlueprint>) => void;
  onGenerate: (draftOnly: boolean) => void;
  isGenerating: boolean;
  generatingStage: string;
  hasCharacters: boolean;
}

export const SceneConfigPanel: React.FC<SceneConfigPanelProps> = ({
  blueprint,
  onUpdateBlueprint,
  onGenerate,
  isGenerating,
  generatingStage,
  hasCharacters,
}) => {
  const quickBackgrounds = [
    '巴黎埃菲尔铁塔远景，秋季法式梧桐树街道，黄金时刻暖阳',
    '加州阳光海滩，粉紫色晚霞，海浪拍打沙滩野餐垫',
    '现代极简北欧咖啡馆室内，温暖落地窗自然采光',
    '故宫红墙琉璃瓦中庭，清晨薄雾自然柔光',
    '现代科技发布会舞台，深蓝冷色背景光与聚光灯',
  ];

  const quickLightings = [
    '黄金时刻夕阳侧逆光，柔和发丝轮廓光',
    '自然漫射日光，清透均匀阴影',
    '电影感侧光，强明暗反差氛围',
    '室内暖色柔光灯与微弱烛光',
  ];

  const quickStyles = [
    '真实旅行胶片摄影，自然皮肤质感与衣褶',
    '商业时尚大片，细腻毛孔与织物细节',
    '日系清新胶片，柔和低对比微颗粒',
    '复古画报艺术写真，高质感胶片色调',
  ];

  return (
    <div className="surface rounded-2xl p-5 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            3. 场景与氛围配置 (Scene Environment)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Prompt 只负责世界与环境渲染，“谁是谁”由 Character ID 严格锁定
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Background / Setting */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-indigo-600" />
            <span>场景地点与背景描述:</span>
          </label>
          <textarea
            id="scene-background-input"
            rows={2}
            value={blueprint.background}
            onChange={(e) => onUpdateBlueprint({ background: e.target.value })}
            placeholder="例如：巴黎埃菲尔铁塔远景，秋天落叶街头，法式咖啡馆露天座椅..."
            className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 text-slate-800"
          />
          {/* Quick pills */}
          <div className="flex flex-wrap gap-1 mt-1.5">
            {quickBackgrounds.slice(0, 3).map((bg, idx) => (
              <button
                key={idx}
                type="button"
                id={`quick-bg-${idx}`}
                onClick={() => onUpdateBlueprint({ background: bg })}
                className="text-[10px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 truncate max-w-[200px]"
              >
                {bg.split('，')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Lighting Atmosphere */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <Sun className="w-3.5 h-3.5 text-amber-500" />
            <span>光影与氛围 (Lighting):</span>
          </label>
          <input
            type="text"
            id="scene-lighting-input"
            value={blueprint.lighting}
            onChange={(e) => onUpdateBlueprint({ lighting: e.target.value })}
            placeholder="例如：黄金时刻夕阳侧逆光，发丝轮廓光..."
            className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 text-slate-800"
          />
          <div className="flex flex-wrap gap-1 mt-1.5">
            {quickLightings.slice(0, 3).map((lt, idx) => (
              <button
                key={idx}
                type="button"
                id={`quick-lighting-${idx}`}
                onClick={() => onUpdateBlueprint({ lighting: lt })}
                className="text-[10px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 truncate"
              >
                {lt.split('，')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Camera / Shot */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <Camera className="w-3.5 h-3.5 text-blue-500" />
            <span>镜头与视角 (Camera):</span>
          </label>
          <input
            type="text"
            id="scene-camera-input"
            value={blueprint.camera}
            onChange={(e) => onUpdateBlueprint({ camera: e.target.value })}
            placeholder="例如：35mm 徕卡纪实镜头，视平线真实视角，浅景深虚化背景..."
            className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 text-slate-800"
          />
        </div>

        {/* Art Style */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-purple-500" />
            <span>艺术风格 (Style):</span>
          </label>
          <input
            type="text"
            id="scene-style-input"
            value={blueprint.style}
            onChange={(e) => onUpdateBlueprint({ style: e.target.value })}
            placeholder="例如：真实旅行胶片摄影，真实皮肤质感与自然光影融合..."
            className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-500 text-slate-800"
          />
        </div>
      </div>

      {/* Generation Trigger Action Area */}
      <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs text-slate-500 flex items-center gap-2">
          <span className="font-semibold text-slate-700">生成流程:</span>
          <span>Character ID 映射</span>
          <span className="text-slate-300">→</span>
          <span>Scene Blueprint</span>
          <span className="text-slate-300">→</span>
          <span>确定性渲染</span>
          <span className="text-slate-300">→</span>
          <span>自动一致性检测</span>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Stage 1 Draft button */}
          <button
            type="button"
            id="generate-draft-btn"
            disabled={isGenerating || !hasCharacters}
            onClick={() => onGenerate(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xs"
          >
            阶段一: 构图草图 (Draft)
          </button>

          {/* Stage 2 Final Render button */}
          <button
            type="button"
            id="generate-final-btn"
            disabled={isGenerating || !hasCharacters}
            onClick={() => onGenerate(false)}
            className="photo-button px-4 py-2.5 rounded-xl text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>{generatingStage || '渲染中...'}</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 text-indigo-200" />
                <span>阶段二: 正式渲染 (Final Render)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
