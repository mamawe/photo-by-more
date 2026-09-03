import React, { useState } from 'react';
import { X, Copy, Check, FileCode2, Layers, Cpu, ShieldCheck } from 'lucide-react';
import { CharacterAsset, SceneBlueprint } from '../types';

interface BlueprintModalProps {
  isOpen: boolean;
  onClose: () => void;
  blueprint: SceneBlueprint;
  characterAssets: CharacterAsset[];
}

export const BlueprintModal: React.FC<BlueprintModalProps> = ({
  isOpen,
  onClose,
  blueprint,
  characterAssets,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'blueprint' | 'references' | 'flow'>(
    'blueprint'
  );

  if (!isOpen) return null;

  // Build the clean JSON representation as specified in section 八 & 九
  const blueprintJson = {
    version: blueprint.version,
    scene_title: blueprint.title,
    aspect_ratio: blueprint.aspectRatio,
    environment: {
      background: blueprint.background,
      lighting: blueprint.lighting,
      camera: blueprint.camera,
      style: blueprint.style,
    },
    characters: blueprint.characters.map((c) => {
      const asset = characterAssets.find((a) => a.id === c.id);
      return {
        id: c.id,
        name: asset?.name || c.id,
        identity_lock: true,
        reference_source: `asset_${c.id}_face`,
        position: [c.x, c.y],
        scale: c.scale,
        depth: c.depth,
        pose_preset: c.posePreset,
        action_detail: c.actionPrompt,
        flip_horizontal: c.flipX,
        rotation: c.rotation,
      };
    }),
  };

  const formattedJson = JSON.stringify(blueprintJson, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        id="blueprint-modal-container"
        className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
              <FileCode2 className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Scene Blueprint & Reference Pack
              </h3>
              <p className="text-xs text-slate-500">
                确定性 2D 场景中间层：解耦 Prompt 与身份，解决多人物控制问题
              </p>
            </div>
          </div>

          <button
            type="button"
            id="close-blueprint-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="px-6 pt-3 border-b border-slate-100 flex items-center gap-3 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('blueprint')}
            className={`pb-2.5 border-b-2 transition-colors ${
              activeTab === 'blueprint'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Scene Blueprint JSON
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('references')}
            className={`pb-2.5 border-b-2 transition-colors ${
              activeTab === 'references'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Reference Pack 映射表 ({characterAssets.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('flow')}
            className={`pb-2.5 border-b-2 transition-colors ${
              activeTab === 'flow'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            技术架构管线闭环
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 font-mono text-xs">
          {activeTab === 'blueprint' && (
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-sans text-slate-500">
                  作为中间层直接传给后端渲染引擎，不让 AI 随机发挥身份与位置
                </span>
                <button
                  type="button"
                  id="copy-blueprint-json-btn"
                  onClick={handleCopy}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-sans text-xs transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>已复制</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>复制 JSON</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="p-4 rounded-xl bg-slate-950 text-emerald-400 overflow-x-auto text-[11px] leading-relaxed border border-slate-800">
                {formattedJson}
              </pre>
            </div>
          )}

          {activeTab === 'references' && (
            <div className="space-y-3 font-sans">
              <p className="text-xs text-slate-600">
                每个 Character ID 独立绑定原始照片、Face Crop、Person Mask 和 Identity
                Embedding：
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {characterAssets.map((asset) => (
                  <div
                    key={asset.id}
                    className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center gap-3"
                  >
                    <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-300 bg-white flex-shrink-0">
                      <img
                        src={asset.faceCrop || asset.sourceImage}
                        alt={asset.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs font-bold px-1.5 py-0.2 rounded bg-slate-900 text-white">
                          {asset.id}
                        </span>
                        <span className="font-bold text-xs text-slate-900">
                          {asset.name}
                        </span>
                      </div>
                      <div className="text-[11px] text-emerald-700 font-semibold mt-0.5 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        <span>Identity Locked ✓</span>
                      </div>
                      <div className="text-[10px] text-slate-400 truncate mt-0.5">
                        face_crop: 256x256 · Embedding: Active
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'flow' && (
            <div className="font-sans text-xs space-y-4">
              <div className="p-4 rounded-xl bg-slate-900 text-slate-200 leading-relaxed space-y-2 font-mono text-[11px]">
                <div>用户上传照片</div>
                <div className="text-slate-500 pl-4">↓ Person Detection + Face Detection</div>
                <div>建立 Character ID (P01, P02, P03) [Identity Locked]</div>
                <div className="text-slate-500 pl-4">↓ 2D 画布编排 (X, Y, Scale, Depth, Pose)</div>
                <div>生成 Scene Blueprint (结构化机器蓝图)</div>
                <div className="text-slate-500 pl-4">↓ 绑定 Reference Pack</div>
                <div>第一阶段: 构图草图生成 (Scene Draft)</div>
                <div className="text-slate-500 pl-4">↓ 第二阶段: 正式渲染 (Final Render)</div>
                <div>Identity Evaluation (自动比对原始人脸)</div>
                <div className="text-emerald-400 pl-4">
                  ├─ PASS (≥75%): 验证通过，交付最终图片
                </div>
                <div className="text-amber-400 pl-4">
                  └─ FAIL (&lt;75%): 自动触发局部 Inpainting 修正
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50 flex justify-end">
          <button
            type="button"
            id="close-blueprint-footer-btn"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold"
          >
            完成
          </button>
        </div>
      </div>
    </div>
  );
};
