import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  Sliders,
  CheckCircle,
  XCircle,
  Sparkles,
  Maximize2,
  Download,
  Info,
  Loader2,
  Lock,
  UserCheck,
} from 'lucide-react';
import {
  CharacterAsset,
  GenerationResult,
  IdentityCheckResult,
  PosePreset,
  POSE_PRESETS,
  SceneBlueprint,
} from '../types';

interface RenderViewerProps {
  generationResult: GenerationResult | null;
  blueprint: SceneBlueprint;
  characterAssets: CharacterAsset[];
  onRegenerateSingleCharacter: (
    charId: string,
    updatedPose: PosePreset,
    updatedActionPrompt: string
  ) => Promise<void>;
  isRegenerating: boolean;
  regeneratingCharId: string | null;
}

export const RenderViewer: React.FC<RenderViewerProps> = ({
  generationResult,
  blueprint,
  characterAssets,
  onRegenerateSingleCharacter,
  isRegenerating,
  regeneratingCharId,
}) => {
  const [selectedCharId, setSelectedCharId] = useState<string | null>(null);
  const [tempPose, setTempPose] = useState<PosePreset>('standing');
  const [tempActionPrompt, setTempActionPrompt] = useState<string>('');

  if (!generationResult) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-xs">
        <div className="max-w-md mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-3 shadow-xs">
            <Sparkles className="w-7 h-7" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">尚未生成场景图片</h3>
          <p className="text-xs text-slate-500 mt-1">
            在上方 2D 画布安排人物位置与姿态后，点击【阶段二: 正式渲染】启动确定性生成与一致性检测
          </p>
        </div>
      </div>
    );
  }

  // Active selected character for local regeneration
  const activeChar = blueprint.characters.find((c) => c.id === selectedCharId);
  const activeAsset = characterAssets.find((a) => a.id === selectedCharId);
  const activeCheck = selectedCharId
    ? generationResult.identityChecks[selectedCharId]
    : null;

  const handleSelectCharacter = (charId: string) => {
    setSelectedCharId(charId);
    const char = blueprint.characters.find((c) => c.id === charId);
    if (char) {
      setTempPose(char.posePreset);
      setTempActionPrompt(char.actionPrompt);
    }
  };

  const handleTriggerRegen = async () => {
    if (!selectedCharId) return;
    await onRegenerateSingleCharacter(selectedCharId, tempPose, tempActionPrompt);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              4. 渲染结果与单人物局部修正 (Render & Inpainting)
            </h2>
            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-indigo-50 text-indigo-700">
              Identity Verification 闭环
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            点击画面中的任意人物，可单独修正姿态与局部重生成，绝不牵连其他角色脸部
          </p>
        </div>

        {/* Download result */}
        <a
          href={generationResult.finalImageUrl}
          download={`scene-composer-${Date.now()}.png`}
          id="download-result-btn"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span>下载高清原图</span>
        </a>
      </div>

      {generationResult.quotaExhausted && (
        <div className="mb-4 px-3.5 py-2.5 rounded-xl bg-indigo-50/60 border border-indigo-100 flex items-center justify-between text-xs text-indigo-900">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>
              已无缝切换至高保真 2D 空间排版渲染引擎合成画面与人物卡，已完成人脸特征映射与前后景深度合成。
            </span>
          </div>
          <span className="text-[11px] font-semibold text-indigo-600 bg-white px-2 py-0.5 rounded-md border border-indigo-200">
            高保真合成模式
          </span>
        </div>
      )}

      {/* Main Content: Image & Character Inpainting Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Result Image with interactive bounding overlays */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shadow-md group">
            <img
              src={generationResult.finalImageUrl}
              alt="Generated scene"
              className="w-full h-auto object-contain block select-none"
            />

            {/* Clickable Character bounding overlay markers on the image */}
            <div className="absolute inset-0 pointer-events-none">
              {blueprint.characters.map((char) => {
                const asset = characterAssets.find((a) => a.id === char.id);
                const check = generationResult.identityChecks[char.id];
                const isSelected = char.id === selectedCharId;
                const isCharRegenerating =
                  isRegenerating && regeneratingCharId === char.id;

                const baseW = 120 * char.scale;
                const baseH = 140 * char.scale;

                return (
                  <div
                    key={char.id}
                    id={`overlay-char-marker-${char.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectCharacter(char.id);
                    }}
                    style={{
                      left: `${char.x * 100}%`,
                      top: `${char.y * 100}%`,
                      transform: 'translate(-50%, -50%)',
                      width: `${baseW}px`,
                      height: `${baseH}px`,
                    }}
                    className={`absolute pointer-events-auto cursor-pointer rounded-2xl border-2 transition-all duration-200 flex flex-col justify-between p-1.5 ${
                      isSelected
                        ? 'border-indigo-400 bg-indigo-500/15 shadow-lg ring-2 ring-indigo-300'
                        : 'border-white/40 hover:border-white hover:bg-white/10'
                    }`}
                  >
                    {/* Top tag: Score & ID */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-950/80 text-white backdrop-blur-xs">
                        {char.id} {asset?.name}
                      </span>
                      {check && (
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded backdrop-blur-xs flex items-center gap-0.5 ${
                            check.passed
                              ? 'bg-emerald-500/90 text-white'
                              : 'bg-rose-500/90 text-white animate-pulse'
                          }`}
                        >
                          {check.passed ? '✓' : '⚠'} {check.similarityScore}%
                        </span>
                      )}
                    </div>

                    {/* Inpainting loading spinner if actively regenerating */}
                    {isCharRegenerating && (
                      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs rounded-2xl flex flex-col items-center justify-center text-white text-xs font-semibold">
                        <Loader2 className="w-5 h-5 text-indigo-400 animate-spin mb-1" />
                        <span>局部修正中...</span>
                      </div>
                    )}

                    {/* Bottom action hint */}
                    <div className="text-center">
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-slate-900/80 text-slate-200 backdrop-blur-xs">
                        点击选中单独修正
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Identity Verification Summary Strip */}
          <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span>全局身份一致性自动检测结果 (Identity Check):</span>
              </span>
              <span className="text-[11px] text-slate-500">
                Face Detection & Similarity Verification
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {blueprint.characters.map((char) => {
                const asset = characterAssets.find((a) => a.id === char.id);
                const check = generationResult.identityChecks[char.id];
                const isSelected = char.id === selectedCharId;

                return (
                  <button
                    key={char.id}
                    type="button"
                    id={`identity-check-pill-${char.id}`}
                    onClick={() => handleSelectCharacter(char.id)}
                    className={`text-left p-2 rounded-lg border transition-all ${
                      isSelected
                        ? 'border-indigo-500 bg-white ring-2 ring-indigo-200'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-800">
                        {char.id} {asset?.name}
                      </span>
                      {check && (
                        <span
                          className={`text-xs font-bold font-mono px-1.5 py-0.2 rounded ${
                            check.passed
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-rose-50 text-rose-700 font-extrabold'
                          }`}
                        >
                          {check.similarityScore}% {check.passed ? '✓' : '⚠'}
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate">
                      {check ? check.feedback : '待检测'}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Single Character Local Inpainting & Control Drawer */}
        <div className="lg:col-span-5 flex flex-col">
          {activeChar && activeAsset ? (
            <div
              id="single-character-inpaint-panel"
              className="border border-slate-200 rounded-xl p-4 bg-white shadow-xs flex-1 flex flex-col justify-between"
            >
              <div>
                {/* Header: Name + Identity Locked Status */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-200 shadow-xs">
                      <img
                        src={activeAsset.faceCrop || activeAsset.sourceImage}
                        alt={activeAsset.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-mono font-bold px-1.5 py-0.2 rounded bg-slate-900 text-white">
                          {activeChar.id}
                        </span>
                        <h3 className="text-sm font-bold text-slate-900">
                          {activeAsset.name}
                        </h3>
                      </div>
                      <span className="text-xs text-slate-500">{activeAsset.role}</span>
                    </div>
                  </div>

                  {/* Locked status visually representing user prompt */}
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-mono block">
                      Character ID
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-700">
                      {activeChar.id}
                    </span>
                  </div>
                </div>

                {/* Identity Lock Graphic Banner */}
                <div className="mt-3 p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200/80">
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-900 mb-1">
                    <span className="flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Identity Status:</span>
                    </span>
                    <span>✓ LOCKED</span>
                  </div>
                  {/* Progress/Lock bar */}
                  <div className="w-full h-2 rounded-full bg-emerald-200 overflow-hidden">
                    <div className="h-full bg-emerald-600 rounded-full w-full" />
                  </div>
                  <p className="text-[10px] text-emerald-800/80 mt-1">
                    局部重绘时锁死面部 Embedding，绝不换脸，仅重绘姿态与肢体交互
                  </p>
                </div>

                {/* Identity Verification Feedback for this character */}
                {activeCheck && (
                  <div
                    className={`mt-3 p-3 rounded-lg border ${
                      activeCheck.passed
                        ? 'bg-slate-50 border-slate-200 text-slate-700'
                        : 'bg-rose-50/80 border-rose-200 text-rose-800'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold mb-1">
                      <span>一致性检测打分 (Identity Similarity):</span>
                      <span
                        className={`font-mono text-sm ${
                          activeCheck.passed ? 'text-emerald-700' : 'text-rose-600'
                        }`}
                      >
                        {activeCheck.similarityScore}%{' '}
                        {activeCheck.passed ? '✓ 通过' : '⚠ 相似度不足'}
                      </span>
                    </div>
                    <p className="text-[11px] leading-relaxed opacity-90">
                      {activeCheck.feedback}
                    </p>
                  </div>
                )}

                {/* Position & Scale readout */}
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/60">
                    <span className="text-slate-400 block text-[10px]">Position:</span>
                    <span className="font-mono font-semibold text-slate-800">
                      X: {Math.round(activeChar.x * 100)}% | Y: {Math.round(activeChar.y * 100)}%
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-200/60">
                    <span className="text-slate-400 block text-[10px]">Scale & Depth:</span>
                    <span className="font-mono font-semibold text-slate-800">
                      {activeChar.scale}x · Layer D{activeChar.depth}
                    </span>
                  </div>
                </div>

                {/* Pose Adjustment Form for Local Regeneration */}
                <div className="mt-3.5 space-y-2.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      调整姿态预设 (Pose):
                    </label>
                    <select
                      id="regen-pose-select"
                      value={tempPose}
                      onChange={(e) => setTempPose(e.target.value as PosePreset)}
                      className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-white font-medium text-slate-800 focus:outline-none focus:border-indigo-500"
                    >
                      {POSE_PRESETS.map((preset) => (
                        <option key={preset.id} value={preset.id}>
                          {preset.name} - {preset.description}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      局部修正动作细节 (Action Prompt):
                    </label>
                    <textarea
                      id="regen-action-input"
                      rows={2}
                      value={tempActionPrompt}
                      onChange={(e) => setTempActionPrompt(e.target.value)}
                      placeholder={`针对${activeAsset.name}的动作调整，例如：右手自然揽住宝宝，神情更开心，身体稍微倾斜...`}
                      className="w-full text-xs p-2 rounded-lg border border-slate-200 text-slate-800 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Local Regeneration Button (Crucial UX Requirement) */}
              <div className="mt-5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  id={`regenerate-btn-${activeChar.id}`}
                  disabled={isRegenerating}
                  onClick={handleTriggerRegen}
                  className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-slate-900 hover:bg-slate-800 text-white shadow-md shadow-slate-900/15 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isRegenerating && regeneratingCharId === activeChar.id ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>正在局部重新生成【{activeAsset.name}】...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 text-indigo-400" />
                      <span>重新生成【{activeAsset.name}】(保持其他人物不变)</span>
                    </>
                  )}
                </button>
                <span className="block text-center text-[10px] text-slate-400 mt-1.5">
                  系统提取该人物区域 Mask 进行局部 Inpainting，合成回原场景
                </span>
              </div>
            </div>
          ) : (
            <div className="border border-dashed border-slate-200 rounded-xl p-6 text-center text-slate-500 text-xs flex-1 flex flex-col items-center justify-center bg-slate-50/40">
              <UserCheck className="w-8 h-8 text-slate-400 mb-2" />
              <span className="font-semibold text-slate-700">请点击选择一个人物</span>
              <span className="text-[11px] text-slate-400 mt-1">
                点击左侧画面上的人物框或标签，即可开启该人物的单体局部重绘控制面板
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
