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
    backgroundImage: "/images/preset-paris-street.png",
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
    backgroundImage: "/images/preset-beach-picnic.png",
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

// Each thumbnail now carries its own cast and composition rather than reusing a generic family.
const cloneCharacters = (characters: CharacterAsset[]) => characters.map((character) => ({ ...character }));
const makePreset = (
  base: PresetPackage,
  name: string,
  description: string,
  backgroundImage: string,
  background: string,
  composition: { focus: string; recommendedArea: string; framing: string },
  characters: CharacterAsset[],
  sceneCharacters: SceneBlueprint['characters']
): PresetPackage => ({
  name,
  description,
  characters: cloneCharacters(characters),
  blueprint: {
    ...base.blueprint,
    title: name,
    backgroundImage,
    background,
    composition,
    characters: sceneCharacters,
  },
});

const parisCast = [PRESET_FAMILY_PARIS.characters[0], PRESET_FAMILY_PARIS.characters[1], PRESET_FAMILY_PARIS.characters[2]];
const beachCast = [PRESET_FRIENDS_BEACH.characters[0], PRESET_FRIENDS_BEACH.characters[1]];

export const PRESET_PARIS_STREET = makePreset(
  PRESET_FAMILY_PARIS, '巴黎街角漫游', '一家三口沿塞纳河步道慢慢走，建筑留给背景呼吸。', '/images/preset-paris-street.png',
  '巴黎左岸街角咖啡馆与塞纳河晨光，右侧步道是人物的自然站位。',
  { focus: '左侧咖啡馆立面与街角座椅', recommendedArea: '右侧河岸步道，避开左侧建筑密集区', framing: '一家三口右侧中景，爸爸妈妈错位站立，宝宝由妈妈牵手' },
  parisCast,
  [
    { id: 'P01', x: 0.67, y: 0.68, scale: 0.82, depth: 2, posePreset: 'walking', actionPrompt: '爸爸沿河岸步道缓慢行走，回头看向家人', flipX: true, rotation: -2 },
    { id: 'P02', x: 0.82, y: 0.7, scale: 0.78, depth: 2, posePreset: 'holding_child', actionPrompt: '妈妈牵着宝宝的手，面向镜头自然微笑', flipX: false, rotation: 2 },
    { id: 'P03', x: 0.75, y: 0.77, scale: 0.42, depth: 3, posePreset: 'holding_hands', actionPrompt: '宝宝站在父母之间迈着小步，抬头看向妈妈', flipX: true, rotation: 0 },
  ]
);

export const PRESET_BEACH_PICNIC = makePreset(
  PRESET_FRIENDS_BEACH, '海边野餐闺蜜组', '两位闺蜜坐在野餐垫左右，藤篮与海面保持完整。', '/images/preset-beach-picnic.png',
  '地中海海边野餐，粉紫晚霞、亚麻野餐垫、藤编篮与远处海浪。',
  { focus: '右下藤编篮与海平线', recommendedArea: '左下至画面中部的野餐垫，避开藤篮', framing: '双人低机位坐姿，左右错位形成自然三角构图' },
  beachCast,
  [
    { id: 'P01', x: 0.3, y: 0.73, scale: 0.78, depth: 3, posePreset: 'sitting', actionPrompt: '坐在野餐垫左侧，双手端起饮料，侧头和好友聊天', flipX: false, rotation: 3 },
    { id: 'P02', x: 0.52, y: 0.7, scale: 0.74, depth: 3, posePreset: 'sitting', actionPrompt: '坐在野餐垫中部偏右，屈膝扶住草帽，朝向镜头微笑', flipX: true, rotation: -3 },
  ]
);

export const PRESET_KYOTO_AUTUMN = makePreset(
  PRESET_FAMILY_PARIS, '京都秋日漫步', '亲子沿红枫小径向古寺走去，留出寺门的视觉终点。', '/images/preset-kyoto-autumn.png',
  '京都古寺红枫小径，秋日晨光与安静石板路。',
  { focus: '道路尽头的古寺门与红枫拱廊', recommendedArea: '画面下半部中央道路两侧', framing: '亲子纵深排列，主角偏下、寺门保持无遮挡' },
  [parisCast[1], parisCast[2]],
  [
    { id: 'P02', x: 0.43, y: 0.72, scale: 0.72, depth: 2, posePreset: 'walking', actionPrompt: '妈妈沿石板路向寺门走去，回头等待孩子', flipX: false, rotation: -2 },
    { id: 'P03', x: 0.57, y: 0.79, scale: 0.42, depth: 3, posePreset: 'holding_hands', actionPrompt: '宝宝牵着妈妈的手走在道路中央，抬头看红叶', flipX: true, rotation: 2 },
  ]
);

export const PRESET_ALPS_TRIP = makePreset(
  PRESET_FAMILY_PARIS, '阿尔卑斯湖畔', '一家人在木屋草坡前远眺雪山，人物缩小以保留壮阔尺度。', '/images/preset-alps-trip.png',
  '瑞士雪山湖畔木屋，野花、清澈湖面与柔和日光。',
  { focus: '右侧湖面与雪山层叠远景', recommendedArea: '左下木屋旁草坡', framing: '小比例家庭远景，沿草坡形成横向队列' },
  parisCast,
  [
    { id: 'P01', x: 0.2, y: 0.76, scale: 0.48, depth: 2, posePreset: 'standing', actionPrompt: '爸爸站在木屋旁指向远处雪山', flipX: false, rotation: -3 },
    { id: 'P02', x: 0.34, y: 0.77, scale: 0.46, depth: 2, posePreset: 'standing', actionPrompt: '妈妈站在爸爸身旁，手搭在孩子肩上', flipX: true, rotation: 2 },
    { id: 'P03', x: 0.29, y: 0.83, scale: 0.28, depth: 3, posePreset: 'held', actionPrompt: '宝宝被妈妈轻轻抱起，望向湖面', flipX: false, rotation: 0 },
  ]
);

export const PRESET_ISLAND_VACATION = makePreset(
  PRESET_FRIENDS_BEACH, '海岛度假日', '一对旅伴在躺椅旁迎着海风，海湾作为宽阔背景。', '/images/preset-island-vacation.png',
  '热带海岛蓝绿色海湾，棕榈树影与条纹沙滩椅。',
  { focus: '蓝绿色海湾与棕榈树影', recommendedArea: '左下躺椅旁的沙滩前景', framing: '双人半身合影，错开海平线并保留躺椅道具' },
  beachCast,
  [
    { id: 'P01', x: 0.24, y: 0.78, scale: 0.7, depth: 3, posePreset: 'sitting', actionPrompt: '坐在条纹躺椅边缘，戴草帽望向海湾', flipX: false, rotation: -2 },
    { id: 'P02', x: 0.48, y: 0.75, scale: 0.7, depth: 3, posePreset: 'standing', actionPrompt: '站在躺椅后方向好友伸手，迎着海风微笑', flipX: true, rotation: 3 },
  ]
);

export const PRESET_TOKYO_NIGHT = makePreset(
  PRESET_FRIENDS_BEACH, '东京霓虹夜行', '朋友在巷道下方短暂停留，让两侧霓虹形成引导线。', '/images/preset-tokyo-night.png',
  '雨后东京霓虹小巷，湿润路面反射彩色灯光。',
  { focus: '巷道中心透视消失点与招牌光线', recommendedArea: '画面下方湿润道路，避免遮挡招牌', framing: '一前一后小比例行走，形成霓虹纵深' },
  beachCast,
  [
    { id: 'P01', x: 0.46, y: 0.79, scale: 0.62, depth: 3, posePreset: 'walking', actionPrompt: '走在湿润巷道中央，回头看向身后的霓虹', flipX: false, rotation: -2 },
    { id: 'P02', x: 0.62, y: 0.75, scale: 0.52, depth: 2, posePreset: 'looking_back', actionPrompt: '落后半步回望镜头，手里提着透明雨伞', flipX: true, rotation: 2 },
  ]
);

export const PRESET_PRAIRIE_FAMILY = makePreset(
  PRESET_FAMILY_PARIS, '薰衣草草原家庭', '一家三口在野餐桌边分享日落，紫色花田作为层次背景。', '/images/preset-prairie-family.png',
  '日落薰衣草草原与远山，金色逆光和户外野餐桌。',
  { focus: '中央花田小路与右下野餐桌', recommendedArea: '右下桌边和中央小路', framing: '家庭小组靠近道具，宝宝居中形成稳定三角构图' },
  parisCast,
  [
    { id: 'P01', x: 0.67, y: 0.75, scale: 0.65, depth: 2, posePreset: 'standing', actionPrompt: '爸爸站在野餐桌左侧，手扶桌沿望向家人', flipX: false, rotation: -2 },
    { id: 'P02', x: 0.83, y: 0.76, scale: 0.62, depth: 2, posePreset: 'sitting', actionPrompt: '妈妈坐在桌边，伸手接过宝宝递来的花束', flipX: true, rotation: 2 },
    { id: 'P03', x: 0.75, y: 0.84, scale: 0.38, depth: 3, posePreset: 'holding_hands', actionPrompt: '宝宝站在桌前捧着一小束薰衣草', flipX: false, rotation: 0 },
  ]
);

export const PRESET_STUDIO_PORTRAIT = makePreset(
  PRESET_FAMILY_PARIS, '复古暖调影棚', '单人坐在扶手椅上，窗光与干花成为肖像的安静陪衬。', '/images/preset-studio-portrait.png',
  '陶土色复古影棚、扶手椅、干花与窗边柔光。',
  { focus: '左侧窗光与右下扶手椅', recommendedArea: '右下扶手椅或椅旁，避开左下花瓶', framing: '单人三分之二肖像，侧身受光、背景保留呼吸' },
  [PRESET_FAMILY_PARIS.characters[1]],
  [
    { id: 'P02', x: 0.72, y: 0.76, scale: 0.82, depth: 3, posePreset: 'sitting', actionPrompt: '坐在复古扶手椅中，身体侧向窗光，双手自然放在膝上', flipX: false, rotation: -2 },
  ]
);

export const ALL_PRESETS = [
  PRESET_FAMILY_PARIS, PRESET_BEACH_PICNIC, PRESET_PARIS_STREET, PRESET_KYOTO_AUTUMN,
  PRESET_ALPS_TRIP, PRESET_ISLAND_VACATION, PRESET_TOKYO_NIGHT, PRESET_PRAIRIE_FAMILY, PRESET_STUDIO_PORTRAIT,
];
