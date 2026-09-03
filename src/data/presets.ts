import { CharacterAsset, SceneBlueprint } from '../types';

// Helper to generate elegant vector portrait data URLs
function createSvgAvatar(
  bg: string,
  hairColor: string,
  skinColor: string,
  shirtColor: string,
  hairStyle: 'short' | 'long' | 'baby',
  features: string
): string {
  let hairSvg = '';
  if (hairStyle === 'short') {
    hairSvg = `<path d="M28,45 C28,24 45,16 64,16 C83,16 100,24 100,45 C100,32 84,24 64,24 C44,24 28,32 28,45 Z" fill="${hairColor}"/>
               <path d="M28,45 C24,52 24,62 26,68 C30,68 32,56 34,48 Z" fill="${hairColor}"/>
               <path d="M100,45 C104,52 104,62 102,68 C98,68 96,56 94,48 Z" fill="${hairColor}"/>`;
  } else if (hairStyle === 'long') {
    hairSvg = `<path d="M24,55 C24,22 42,14 64,14 C86,14 104,22 104,55 C106,75 102,96 98,110 C92,94 92,72 90,60 C90,40 80,24 64,24 C48,24 38,40 38,60 C36,72 36,94 30,110 C26,96 22,75 24,55 Z" fill="${hairColor}"/>`;
  } else {
    // baby curl
    hairSvg = `<path d="M58,22 Q64,14 70,22 Q66,20 62,22 Z" fill="${hairColor}"/>`;
  }

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="256" height="256">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${bg}" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="${bg}" stop-opacity="0.4"/>
    </linearGradient>
  </defs>
  <rect width="128" height="128" rx="28" fill="url(#bgGrad)"/>
  <!-- Body/Shirt -->
  <path d="M20,128 C20,95 42,88 64,88 C86,88 108,95 108,128 Z" fill="${shirtColor}"/>
  <!-- Neck -->
  <rect x="54" y="68" width="20" height="24" rx="4" fill="${skinColor}"/>
  <!-- Face -->
  <ellipse cx="64" cy="54" rx="26" ry="28" fill="${skinColor}"/>
  <!-- Hair -->
  ${hairSvg}
  <!-- Eyes -->
  <circle cx="53" cy="52" r="3.5" fill="#242426"/>
  <circle cx="75" cy="52" r="3.5" fill="#242426"/>
  <circle cx="54.5" cy="50.5" r="1.2" fill="#FFFFFF"/>
  <circle cx="76.5" cy="50.5" r="1.2" fill="#FFFFFF"/>
  <!-- Eyebrows -->
  <path d="M47,45 Q54,42 59,45" stroke="${hairColor}" stroke-width="2.5" stroke-linecap="round" fill="none"/>
  <path d="M69,45 Q74,42 81,45" stroke="${hairColor}" stroke-width="2.5" stroke-linecap="round" fill="none"/>
  <!-- Smile -->
  <path d="M56,66 Q64,72 72,66" stroke="#C45656" stroke-width="2.2" stroke-linecap="round" fill="none"/>
  <!-- Extras -->
  ${features}
</svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export interface PresetPackage {
  name: string;
  description: string;
  characters: CharacterAsset[];
  blueprint: SceneBlueprint;
}

// Preset 1: The user's exact case study — Paris Family Trip (爸爸、妈妈、宝宝)
export const PRESET_FAMILY_PARIS: PresetPackage = {
  name: "巴黎旅行家庭 (爸爸、妈妈、宝宝)",
  description: "经典案例：爸爸站在左侧，妈妈在右侧，宝宝居中抱起，埃菲尔铁塔黄金时刻",
  characters: [
    {
      id: "P01",
      name: "爸爸",
      role: "父亲 / 男主角",
      isLocked: true,
      genderAge: "32岁 / 成年男性",
      description: "利落短黑发，温和面容，穿着藏蓝色休闲西装夹克",
      sourceImage: createSvgAvatar(
        "#2563EB",
        "#1E293B",
        "#FDDCB5",
        "#1E3A8A",
        "short",
        `<path d="M52,60 Q64,64 76,60" stroke="#E2A676" stroke-width="1.8" fill="none"/>`
      ),
      faceCrop: createSvgAvatar(
        "#3B82F6",
        "#1E293B",
        "#FDDCB5",
        "#1E3A8A",
        "short",
        `<path d="M52,60 Q64,64 76,60" stroke="#E2A676" stroke-width="1.8" fill="none"/>`
      ),
      box2d: [120, 200, 880, 520],
      faceBox: [140, 260, 360, 460],
    },
    {
      id: "P02",
      name: "妈妈",
      role: "母亲 / 女主角",
      isLocked: true,
      genderAge: "30岁 / 成年女性",
      description: "栗色微卷长发，优雅笑容，浅米色法式风衣与丝巾",
      sourceImage: createSvgAvatar(
        "#EC4899",
        "#451A03",
        "#FFE4C4",
        "#D97706",
        "long",
        `<circle cx="48" cy="62" r="4" fill="#F472B6" opacity="0.4"/>
         <circle cx="80" cy="62" r="4" fill="#F472B6" opacity="0.4"/>`
      ),
      faceCrop: createSvgAvatar(
        "#F43F5E",
        "#451A03",
        "#FFE4C4",
        "#D97706",
        "long",
        `<circle cx="48" cy="62" r="4" fill="#F472B6" opacity="0.4"/>
         <circle cx="80" cy="62" r="4" fill="#F472B6" opacity="0.4"/>`
      ),
      box2d: [140, 500, 880, 800],
      faceBox: [160, 560, 380, 740],
    },
    {
      id: "P03",
      name: "宝宝",
      role: "幼儿 / 萌宝",
      isLocked: true,
      genderAge: "2岁 / 幼童",
      description: "圆脸大眼睛，头顶小胎发，穿着黄色连帽背带裤",
      sourceImage: createSvgAvatar(
        "#10B981",
        "#78350F",
        "#FED7AA",
        "#F59E0B",
        "baby",
        `<circle cx="46" cy="62" r="6" fill="#FB7185" opacity="0.45"/>
         <circle cx="82" cy="62" r="6" fill="#FB7185" opacity="0.45"/>`
      ),
      faceCrop: createSvgAvatar(
        "#34D399",
        "#78350F",
        "#FED7AA",
        "#F59E0B",
        "baby",
        `<circle cx="46" cy="62" r="6" fill="#FB7185" opacity="0.45"/>
         <circle cx="82" cy="62" r="6" fill="#FB7185" opacity="0.45"/>`
      ),
      box2d: [300, 380, 750, 620],
      faceBox: [320, 420, 500, 580],
    },
  ],
  blueprint: {
    version: "1.0",
    title: "巴黎铁塔家庭旅行纪念",
    aspectRatio: "16:9",
    background: "巴黎埃菲尔铁塔远景，战神广场下午黄金时刻草坪，法式秋季梧桐树叶落，阳光柔和斑驳",
    lighting: "黄金时刻夕阳侧逆光，温暖柔和发丝轮廓光",
    camera: "35mm 徕卡胶片镜头，视平线真实纪实构图，中景半全身，背景微虚化",
    style: "真实旅行胶片摄影风格，自然肤色质感，真实衣褶与环境光影融合",
    characters: [
      {
        id: "P01",
        x: 0.32,
        y: 0.52,
        scale: 1.0,
        depth: 2,
        posePreset: "standing",
        actionPrompt: "左手自然插在风衣口袋，右手轻扶宝宝小脚，身体微侧向中心，眼神充满宠溺",
        flipX: false,
        rotation: 2,
      },
      {
        id: "P02",
        x: 0.68,
        y: 0.54,
        scale: 0.95,
        depth: 2,
        posePreset: "standing",
        actionPrompt: "侧身面向家庭中心，双手轻揽，脸上洋溢着灿烂温暖的笑容",
        flipX: true,
        rotation: -2,
      },
      {
        id: "P03",
        x: 0.50,
        y: 0.68,
        scale: 0.55,
        depth: 3,
        posePreset: "held",
        actionPrompt: "被爸爸高高抱在怀中，双手伸向天空欢笑，头戴可爱贝雷帽",
        flipX: false,
        rotation: 0,
      },
    ],
  },
};

// Preset 2: Friends Picnic
export const PRESET_FRIENDS_BEACH: PresetPackage = {
  name: "海边野餐闺蜜组 (莉亚 & 艾米)",
  description: "海风拂面的沙滩野餐，白裙与草帽，并肩欢笑",
  characters: [
    {
      id: "P01",
      name: "莉亚",
      role: "好友 A",
      isLocked: true,
      genderAge: "25岁 / 年轻女性",
      description: "黑长直发，清秀面庞，米白色亚麻吊带裙",
      sourceImage: createSvgAvatar(
        "#8B5CF6",
        "#111827",
        "#FFEDD5",
        "#E0E7FF",
        "long",
        `<path d="M50,65 Q64,70 78,65" stroke="#E11D48" stroke-width="2" fill="none"/>`
      ),
      faceCrop: createSvgAvatar(
        "#8B5CF6",
        "#111827",
        "#FFEDD5",
        "#E0E7FF",
        "long",
        `<path d="M50,65 Q64,70 78,65" stroke="#E11D48" stroke-width="2" fill="none"/>`
      ),
    },
    {
      id: "P02",
      name: "艾米",
      role: "好友 B",
      isLocked: true,
      genderAge: "24岁 / 年轻女性",
      description: "金棕短卷发，活泼灵动，淡蓝色碎花衬衫",
      sourceImage: createSvgAvatar(
        "#06B6D4",
        "#B45309",
        "#FEF3C7",
        "#BAE6FD",
        "short",
        `<circle cx="48" cy="62" r="5" fill="#F43F5E" opacity="0.4"/>
         <circle cx="80" cy="62" r="5" fill="#F43F5E" opacity="0.4"/>`
      ),
      faceCrop: createSvgAvatar(
        "#06B6D4",
        "#B45309",
        "#FEF3C7",
        "#BAE6FD",
        "short",
        `<circle cx="48" cy="62" r="5" fill="#F43F5E" opacity="0.4"/>
         <circle cx="80" cy="62" r="5" fill="#F43F5E" opacity="0.4"/>`
      ),
    },
  ],
  blueprint: {
    version: "1.0",
    title: "海滨黄昏闺蜜野餐",
    aspectRatio: "16:9",
    background: "加州沿海沙滩，傍晚粉紫晚霞，白色野餐垫，竹编野餐篮与草莓红酒杯",
    lighting: "海边日落晚霞暖调，背光漫反射柔光",
    camera: "50mm 大光圈人像镜头，低角度平视拍摄",
    style: "日系复古胶片感，自然柔焦颗粒，电影感清新色调",
    characters: [
      {
        id: "P01",
        x: 0.38,
        y: 0.58,
        scale: 1.0,
        depth: 2,
        posePreset: "sitting",
        actionPrompt: "盘坐在野餐垫上，双手端着饮品杯，转头看向身旁好友欢笑",
        flipX: false,
        rotation: 4,
      },
      {
        id: "P02",
        x: 0.62,
        y: 0.56,
        scale: 0.98,
        depth: 2,
        posePreset: "sitting",
        actionPrompt: "侧坐屈膝，一只手扶着草帽，微风吹拂发丝，面向镜头甜美微笑",
        flipX: true,
        rotation: -3,
      },
    ],
  },
};

export const ALL_PRESETS = [PRESET_FAMILY_PARIS, PRESET_FRIENDS_BEACH];
