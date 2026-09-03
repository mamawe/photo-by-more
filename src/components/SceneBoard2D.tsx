import React, { useState, useRef, useEffect } from 'react';
import {
  Move,
  Maximize2,
  Minimize2,
  FlipHorizontal,
  ArrowUp,
  ArrowDown,
  Layers,
  Sparkles,
  Sliders,
  RotateCw,
  Eye,
  Check,
  Compass,
} from 'lucide-react';
import {
  AspectRatioType,
  CharacterAsset,
  PosePreset,
  POSE_PRESETS,
  SceneBlueprint,
  SceneCharacter,
} from '../types';

interface SceneBoard2DProps {
  blueprint: SceneBlueprint;
  characterAssets: CharacterAsset[];
  selectedCharId: string | null;
  onSelectCharacter: (id: string | null) => void;
  onUpdateCharacterInScene: (id: string, patch: Partial<SceneCharacter>) => void;
  onRemoveCharacterFromScene: (id: string) => void;
  onChangeAspectRatio: (ratio: AspectRatioType) => void;
}

export const SceneBoard2D: React.FC<SceneBoard2DProps> = ({
  blueprint,
  characterAssets,
  selectedCharId,
  onSelectCharacter,
  onUpdateCharacterInScene,
  onRemoveCharacterFromScene,
  onChangeAspectRatio,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedCharId, setDraggedCharId] = useState<string | null>(null);
  const [dragStartPos, setDragStartPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [showGrid, setShowGrid] = useState(true);

  // Selected character object
  const activeChar = blueprint.characters.find((c) => c.id === selectedCharId);
  const activeAsset = characterAssets.find((a) => a.id === selectedCharId);

  // Aspect ratio styling
  const getAspectRatioClasses = (ratio: AspectRatioType) => {
    switch (ratio) {
      case '16:9':
        return 'aspect-[16/9]';
      case '4:3':
        return 'aspect-[4/3]';
      case '1:1':
        return 'aspect-[1/1]';
      case '9:16':
        return 'aspect-[9/16] max-h-[580px] mx-auto';
      default:
        return 'aspect-[16/9]';
    }
  };

  // Dragging logic on the 2D canvas
  const handlePointerDown = (charId: string, e: React.PointerEvent) => {
    e.stopPropagation();
    onSelectCharacter(charId);
    setIsDragging(true);
    setDraggedCharId(charId);
    setDragStartPos({ x: e.clientX, y: e.clientY });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !draggedCharId || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const currentX = (e.clientX - rect.left) / rect.width;
    const currentY = (e.clientY - rect.top) / rect.height;

    // Clamp inside canvas bounds (0.05 to 0.95)
    const clampedX = Math.max(0.08, Math.min(0.92, currentX));
    const clampedY = Math.max(0.12, Math.min(0.90, currentY));

    onUpdateCharacterInScene(draggedCharId, {
      x: Number(clampedX.toFixed(3)),
      y: Number(clampedY.toFixed(3)),
    });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    setDraggedCharId(null);
  };

  // Sort characters for display by depth
  const sortedCharacters = [...blueprint.characters].sort((a, b) => a.depth - b.depth);

  return (
    <div className="surface rounded-2xl p-5 sm:p-6 flex flex-col">
      {/* Board Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              2. 2D 场景排布画布 (2D Scene Board)
            </h2>
            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              纯 2D 编排 · 零 3D 门槛
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            自由拖动人物位置、缩放尺寸、设置前后层级与姿态预设
          </p>
        </div>

        {/* Aspect Ratio Selector & Grid toggle */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
            {(['16:9', '4:3', '1:1', '9:16'] as AspectRatioType[]).map((ratio) => (
              <button
                key={ratio}
                type="button"
                id={`aspect-ratio-${ratio}`}
                onClick={() => onChangeAspectRatio(ratio)}
                className={`px-2 py-1 font-medium rounded-md transition-all ${
                  blueprint.aspectRatio === ratio
                    ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {ratio}
              </button>
            ))}
          </div>

          <button
            type="button"
            id="toggle-grid-btn"
            onClick={() => setShowGrid(!showGrid)}
            className={`p-1.5 rounded-lg border text-xs transition-colors ${
              showGrid
                ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
            }`}
            title="切换九宫格/构图参考线"
          >
            <Compass className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2D Canvas Area */}
      <div className="relative w-full bg-slate-950 rounded-xl overflow-hidden shadow-inner border border-slate-800">
        <div
          ref={containerRef}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onClick={() => onSelectCharacter(null)}
          className={`relative w-full ${getAspectRatioClasses(
            blueprint.aspectRatio
          )} select-none overflow-hidden`}
          style={{
            background:
              'linear-gradient(180deg, #1e293b 0%, #0f172a 70%, #020617 100%)',
          }}
        >
          {/* Rule of Thirds / Composition grid */}
          {showGrid && (
            <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 opacity-15">
              <div className="border-r border-b border-slate-400"></div>
              <div className="border-r border-b border-slate-400"></div>
              <div className="border-b border-slate-400"></div>
              <div className="border-r border-b border-slate-400"></div>
              <div className="border-r border-b border-slate-400"></div>
              <div className="border-b border-slate-400"></div>
              <div className="border-r border-slate-400"></div>
              <div className="border-r border-slate-400"></div>
              <div></div>
            </div>
          )}

          {/* Depth Planes Guidance Indicators */}
          <div className="absolute right-3 top-3 pointer-events-none flex flex-col gap-1 z-10">
            <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-slate-900/80 text-indigo-300 border border-indigo-500/30 backdrop-blur-xs">
              前景 Depth: 3
            </span>
            <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-slate-900/80 text-amber-300 border border-amber-500/30 backdrop-blur-xs">
              中景 Depth: 2
            </span>
            <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-slate-900/80 text-slate-400 border border-slate-700 backdrop-blur-xs">
              后景 Depth: 1
            </span>
          </div>

          {/* Canvas Center Horizon Mark */}
          <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-slate-700/40 pointer-events-none" />

          {/* Empty state prompt if no characters */}
          {blueprint.characters.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 text-xs">
              <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400 mb-2">
                <Move className="w-6 h-6" />
              </div>
              <span>请从上方人物卡点击【加入画布】安排角色位置</span>
            </div>
          )}

          {/* Render Characters as 2D Draggable Sprites */}
          {sortedCharacters.map((char) => {
            const asset = characterAssets.find((a) => a.id === char.id);
            if (!asset) return null;

            const isSelected = char.id === selectedCharId;
            const poseInfo = POSE_PRESETS.find((p) => p.id === char.posePreset);

            // Size scales with scale property
            const baseW = 120 * char.scale;
            const baseH = 136 * char.scale;

            return (
              <div
                key={char.id}
                id={`scene-character-${char.id}`}
                onPointerDown={(e) => handlePointerDown(char.id, e)}
                style={{
                  left: `${char.x * 100}%`,
                  top: `${char.y * 100}%`,
                  transform: `translate(-50%, -50%) rotate(${char.rotation}deg) scaleX(${
                    char.flipX ? -1 : 1
                  })`,
                  width: `${baseW}px`,
                  height: `${baseH}px`,
                  zIndex: char.depth * 10 + (isSelected ? 5 : 0),
                }}
                className={`absolute cursor-grab active:cursor-grabbing transition-shadow group touch-none ${
                  isSelected ? 'ring-2 ring-indigo-400 shadow-2xl' : ''
                }`}
              >
                {/* 2D Sprite Body Card */}
                <div className="w-full h-full rounded-2xl overflow-hidden bg-white/95 border-2 border-white shadow-xl flex flex-col relative backdrop-blur-xs">
                  {/* Avatar crop image */}
                  <div className="flex-1 w-full bg-slate-100 overflow-hidden relative">
                    <img
                      src={asset.faceCrop || asset.sourceImage}
                      alt={asset.name}
                      className="w-full h-full object-cover pointer-events-none"
                    />

                    {/* Depth Tag Badge inside card */}
                    <div
                      style={{ transform: char.flipX ? 'scaleX(-1)' : 'none' }}
                      className={`absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold ${
                        char.depth === 3
                          ? 'bg-indigo-600 text-white'
                          : char.depth === 2
                          ? 'bg-amber-600 text-white'
                          : 'bg-slate-700 text-slate-200'
                      }`}
                    >
                      D{char.depth}
                    </div>
                  </div>

                  {/* Character label footer */}
                  <div
                    style={{ transform: char.flipX ? 'scaleX(-1)' : 'none' }}
                    className="p-1.5 bg-slate-900 text-white flex items-center justify-between"
                  >
                    <div className="flex items-center gap-1 truncate">
                      <span className="text-[10px] font-mono text-indigo-300 font-bold">
                        {char.id}
                      </span>
                      <span className="text-[11px] font-bold truncate">{asset.name}</span>
                    </div>
                    <span className="text-[9px] px-1 py-0.2 rounded bg-slate-800 text-slate-300">
                      {poseInfo?.name || '站立'}
                    </span>
                  </div>
                </div>

                {/* Ground Shadow Footprint */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-3/4 h-2 bg-black/40 rounded-full blur-xs pointer-events-none" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Character Quick Inspector Toolbar */}
      {activeChar && activeAsset && (
        <div
          id="character-inspector-toolbar"
          className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-wrap items-center justify-between gap-4"
        >
          {/* Left: Identity info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-300 flex-shrink-0">
              <img
                src={activeAsset.faceCrop || activeAsset.sourceImage}
                alt={activeAsset.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-slate-900 text-white">
                  {activeChar.id}
                </span>
                <span className="text-sm font-bold text-slate-900">{activeAsset.name}</span>
                <span className="text-[11px] text-emerald-700 font-medium bg-emerald-100/60 px-1.5 py-0.2 rounded">
                  Identity Locked
                </span>
              </div>
              <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                坐标: X {Math.round(activeChar.x * 100)}%, Y {Math.round(activeChar.y * 100)}%
              </div>
            </div>
          </div>

          {/* Middle: Controls (Pose Preset, Scale, Depth, Flip) */}
          <div className="flex items-center flex-wrap gap-2.5">
            {/* Pose Preset Selector */}
            <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-lg border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">姿态预设:</span>
              <select
                id={`pose-preset-select-${activeChar.id}`}
                value={activeChar.posePreset}
                onChange={(e) =>
                  onUpdateCharacterInScene(activeChar.id, {
                    posePreset: e.target.value as PosePreset,
                  })
                }
                className="text-xs font-semibold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
              >
                {POSE_PRESETS.map((preset) => (
                  <option key={preset.id} value={preset.id}>
                    {preset.name} ({preset.description})
                  </option>
                ))}
              </select>
            </div>

            {/* Depth Level selector */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-medium px-1">层级:</span>
              {[
                { val: 1, label: '后景' },
                { val: 2, label: '中景' },
                { val: 3, label: '前景' },
              ].map((d) => (
                <button
                  key={d.val}
                  type="button"
                  id={`depth-btn-${d.val}`}
                  onClick={() => onUpdateCharacterInScene(activeChar.id, { depth: d.val })}
                  className={`px-2 py-0.5 text-xs font-medium rounded ${
                    activeChar.depth === d.val
                      ? 'bg-slate-900 text-white font-semibold'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>

            {/* Scale adjustment */}
            <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-medium">尺寸:</span>
              <input
                type="range"
                id={`scale-slider-${activeChar.id}`}
                min="0.4"
                max="1.8"
                step="0.05"
                value={activeChar.scale}
                onChange={(e) =>
                  onUpdateCharacterInScene(activeChar.id, {
                    scale: parseFloat(e.target.value),
                  })
                }
                className="w-18 accent-indigo-600 cursor-pointer"
              />
              <span className="text-xs font-mono text-slate-700 w-8 text-right">
                {activeChar.scale}x
              </span>
            </div>

            {/* Flip / Mirror Button */}
            <button
              type="button"
              id={`flip-char-btn-${activeChar.id}`}
              onClick={() =>
                onUpdateCharacterInScene(activeChar.id, { flipX: !activeChar.flipX })
              }
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors shadow-xs ${
                activeChar.flipX
                  ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
              title="水平镜像翻转朝向"
            >
              <FlipHorizontal className="w-3.5 h-3.5" />
              <span>朝向镜像</span>
            </button>

            {/* Remove from canvas */}
            <button
              type="button"
              id={`remove-from-canvas-btn-${activeChar.id}`}
              onClick={() => onRemoveCharacterFromScene(activeChar.id)}
              className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2 py-1 rounded-md transition-colors"
            >
              移出画布
            </button>
          </div>

          {/* Free action prompt input */}
          <div className="w-full pt-2 border-t border-slate-200/60 flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium flex-shrink-0">
              动作自由描述:
            </span>
            <input
              type="text"
              id={`action-prompt-input-${activeChar.id}`}
              value={activeChar.actionPrompt}
              onChange={(e) =>
                onUpdateCharacterInScene(activeChar.id, { actionPrompt: e.target.value })
              }
              placeholder="例如：右手抱着宝宝，左手插在口袋，微笑着看向旁边..."
              className="flex-1 text-xs px-2.5 py-1 rounded-md bg-white border border-slate-200 focus:outline-none focus:border-indigo-500 text-slate-800 placeholder:text-slate-400"
            />
          </div>
        </div>
      )}
    </div>
  );
};
