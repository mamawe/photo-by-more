export type PosePreset =
  | 'standing'
  | 'sitting'
  | 'walking'
  | 'holding_child'
  | 'held'
  | 'holding_hands'
  | 'embracing'
  | 'looking_back'
  | 'facing_forward'
  | 'profile'
  | 'back_view';

export interface PosePresetInfo {
  id: PosePreset;
  name: string;
  icon?: string;
  description: string;
}

export const POSE_PRESETS: PosePresetInfo[] = [
  { id: 'standing', name: '站立', description: '自然站立姿势' },
  { id: 'sitting', name: '坐着', description: '坐姿或半倚靠' },
  { id: 'walking', name: '行走', description: '漫步或走动' },
  { id: 'holding_child', name: '抱孩子', description: '双手或单手抱起宝宝/幼童' },
  { id: 'held', name: '被抱在怀中', description: '宝宝/宠物被抱起或依偎' },
  { id: 'holding_hands', name: '牵手', description: '与身侧人物自然牵手' },
  { id: 'embracing', name: '拥抱', description: '与旁边人物依偎或相拥' },
  { id: 'looking_back', name: '回头', description: '身体侧对，转头回望镜头' },
  { id: 'facing_forward', name: '正视镜头', description: '正面对准镜头微笑' },
  { id: 'profile', name: '侧面特写', description: '90度或45度侧颜' },
  { id: 'back_view', name: '背影', description: '背对镜头，强调氛围感' },
];

export interface CharacterAsset {
  id: string; // e.g. 'P01', 'P02'
  name: string; // e.g. '爸爸'
  role: string; // e.g. '父亲 / 男主角'
  sourceImage: string; // base64 or SVG data URL
  faceCrop: string; // avatar thumbnail
  personCutout?: string; // full body sprite
  isLocked: boolean; // Identity Locked
  description?: string;
  genderAge?: string;
  box2d?: [number, number, number, number]; // [ymin, xmin, ymax, xmax] 0-1000
  faceBox?: [number, number, number, number];
}

export interface SceneCharacter {
  id: string; // References CharacterAsset.id
  x: number; // 0.0 to 1.0 (normalized horizontal center)
  y: number; // 0.0 to 1.0 (normalized vertical center/bottom)
  scale: number; // 0.5 to 1.8 (default 1.0)
  depth: number; // 1 (后景), 2 (中景), 3 (前景)
  posePreset: PosePreset;
  actionPrompt: string; // Free text description of action
  flipX: boolean; // Facing direction
  rotation: number; // -30 to +30 deg
}

export type AspectRatioType = '16:9' | '4:3' | '1:1' | '9:16';

export interface SceneBlueprint {
  version: string;
  title: string;
  aspectRatio: AspectRatioType;
  background: string;
  lighting: string;
  camera: string;
  style: string;
  characters: SceneCharacter[];
}

export interface IdentityCheckResult {
  characterId: string;
  characterName: string;
  similarityScore: number; // 0 - 100
  passed: boolean;
  feedback: string;
  detectedAttributes?: string;
}

export interface GenerationResult {
  id: string;
  timestamp: number;
  draftImageUrl?: string;
  finalImageUrl: string;
  blueprintSnapshot: SceneBlueprint;
  identityChecks: Record<string, IdentityCheckResult>;
  assembledPrompt?: string;
  quotaExhausted?: boolean;
  engineNotice?: string;
}
