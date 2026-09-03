import { CharacterAsset, SceneBlueprint, SceneCharacter } from '../types';

export async function rasterizeDataUrlToPng(dataUrl: string, size = 256): Promise<string> {
  if (!dataUrl) return '';
  // If already clean raster base64
  if (
    dataUrl.startsWith('data:image/png;base64,') ||
    dataUrl.startsWith('data:image/jpeg;base64,') ||
    dataUrl.startsWith('data:image/webp;base64,')
  ) {
    return dataUrl;
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, size, size);
          resolve(canvas.toDataURL('image/png'));
          return;
        }
      } catch (e) {
        console.warn('Rasterize canvas error:', e);
      }
      resolve(dataUrl);
    };
    img.onerror = () => {
      resolve(dataUrl);
    };
    img.src = dataUrl;
  });
}

export async function prepareAssetsForGeneration(assets: CharacterAsset[]): Promise<CharacterAsset[]> {
  return Promise.all(
    assets.map(async (asset) => {
      const faceCrop = asset.faceCrop ? await rasterizeDataUrlToPng(asset.faceCrop) : '';
      const sourceImage = asset.sourceImage ? await rasterizeDataUrlToPng(asset.sourceImage) : faceCrop;
      return {
        ...asset,
        faceCrop: faceCrop || sourceImage,
        sourceImage: sourceImage || faceCrop,
      };
    })
  );
}

export function cropImageToFace(
  imgElement: HTMLImageElement,
  faceBox: [number, number, number, number] // [ymin, xmin, ymax, xmax] 0-1000
): string {
  const [ymin, xmin, ymax, xmax] = faceBox;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const origW = imgElement.naturalWidth || imgElement.width || 500;
  const origH = imgElement.naturalHeight || imgElement.height || 500;

  // Add 20% margin around face
  const w = ((xmax - xmin) / 1000) * origW;
  const h = ((ymax - ymin) / 1000) * origH;
  const cx = ((xmin + xmax) / 2000) * origW;
  const cy = ((ymin + ymax) / 2000) * origH;

  const cropSize = Math.max(w, h) * 1.35;
  const sx = Math.max(0, cx - cropSize / 2);
  const sy = Math.max(0, cy - cropSize / 2);
  const sw = Math.min(origW - sx, cropSize);
  const sh = Math.min(origH - sy, cropSize);

  canvas.width = 256;
  canvas.height = 256;

  ctx.drawImage(imgElement, sx, sy, sw, sh, 0, 0, 256, 256);
  return canvas.toDataURL('image/jpeg', 0.92);
}

// Generate the high-fidelity composite image (for Stage 1 draft or fallback visual rendering)
export async function renderSceneComposite(
  blueprint: SceneBlueprint,
  characterAssets: CharacterAsset[],
  options: {
    isDraft?: boolean;
    activeRegenCharId?: string | null;
  } = {}
): Promise<string> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Determine canvas aspect ratio dimensions
  let width = 1280;
  let height = 720;
  if (blueprint.aspectRatio === '4:3') {
    width = 1024;
    height = 768;
  } else if (blueprint.aspectRatio === '1:1') {
    width = 960;
    height = 960;
  } else if (blueprint.aspectRatio === '9:16') {
    width = 720;
    height = 1280;
  }

  canvas.width = width;
  canvas.height = height;

  // Draw background atmosphere
  const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
  if (blueprint.background.includes('巴黎') || blueprint.background.includes('铁塔')) {
    bgGrad.addColorStop(0, '#60A5FA'); // Afternoon sky
    bgGrad.addColorStop(0.45, '#FDE68A'); // Golden sunset horizon
    bgGrad.addColorStop(0.55, '#D97706'); // Warm tree line
    bgGrad.addColorStop(1, '#78350F'); // Rich ground
  } else if (blueprint.background.includes('海') || blueprint.background.includes('沙滩')) {
    bgGrad.addColorStop(0, '#C084FC'); // Twilight violet
    bgGrad.addColorStop(0.45, '#F472B6'); // Pink glow
    bgGrad.addColorStop(0.65, '#38BDF8'); // Azure ocean
    bgGrad.addColorStop(1, '#FDE68A'); // Warm golden sand
  } else {
    bgGrad.addColorStop(0, '#1E293B');
    bgGrad.addColorStop(0.5, '#334155');
    bgGrad.addColorStop(1, '#0F172A');
  }

  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Draw environmental silhouettes if landmark mentioned
  if (blueprint.background.includes('铁塔')) {
    ctx.save();
    ctx.fillStyle = 'rgba(67, 56, 202, 0.25)';
    // Eiffel Tower silhouette in distance
    const towerX = width * 0.5;
    const towerY = height * 0.55;
    ctx.beginPath();
    ctx.moveTo(towerX - 45, towerY);
    ctx.lineTo(towerX - 5, towerY - 240);
    ctx.lineTo(towerX + 5, towerY - 240);
    ctx.lineTo(towerX + 45, towerY);
    ctx.closePath();
    ctx.fill();

    // Spire
    ctx.beginPath();
    ctx.moveTo(towerX, towerY - 240);
    ctx.lineTo(towerX, towerY - 290);
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'rgba(67, 56, 202, 0.35)';
    ctx.stroke();
    ctx.restore();
  }

  // Draw subtle lighting wash
  const lightGrad = ctx.createRadialGradient(
    width * 0.75,
    height * 0.35,
    50,
    width * 0.75,
    height * 0.35,
    width * 0.8
  );
  lightGrad.addColorStop(0, 'rgba(254, 240, 138, 0.4)');
  lightGrad.addColorStop(1, 'rgba(254, 240, 138, 0)');
  ctx.fillStyle = lightGrad;
  ctx.fillRect(0, 0, width, height);

  // Ground contact shadow plane
  const groundGrad = ctx.createLinearGradient(0, height * 0.65, 0, height);
  groundGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
  groundGrad.addColorStop(1, 'rgba(15, 23, 42, 0.55)');
  ctx.fillStyle = groundGrad;
  ctx.fillRect(0, height * 0.65, width, height * 0.35);

  // Sort characters by depth: depth 1 (background) first, depth 3 (foreground) last
  const sortedCharacters = [...blueprint.characters].sort((a, b) => a.depth - b.depth);

  // Helper to load image
  const loadImage = (url: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
  };

  for (const char of sortedCharacters) {
    const asset = characterAssets.find((a) => a.id === char.id);
    if (!asset) continue;

    const charX = char.x * width;
    const charY = char.y * height;
    const baseSize = Math.min(width, height) * 0.42 * char.scale;

    // Contact ground shadow
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(charX, charY + baseSize * 0.48, baseSize * 0.42, baseSize * 0.1, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.32)';
    ctx.fill();
    ctx.restore();

    // Draw character portrait sprite
    const imgSrc = asset.faceCrop || asset.sourceImage;
    if (imgSrc) {
      try {
        const charImg = await loadImage(imgSrc);

        ctx.save();
        ctx.translate(charX, charY);

        if (char.rotation) {
          ctx.rotate((char.rotation * Math.PI) / 180);
        }

        if (char.flipX) {
          ctx.scale(-1, 1);
        }

        // Card / Sprite container with subtle border & shadow
        const cardW = baseSize * 0.85;
        const cardH = baseSize * 0.95;
        const cardR = 24;

        ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
        ctx.shadowBlur = 18;
        ctx.shadowOffsetY = 8;

        // Clip rounded rectangle for the character
        ctx.beginPath();
        ctx.roundRect(-cardW / 2, -cardH / 2, cardW, cardH, cardR);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();

        ctx.save();
        ctx.clip();
        ctx.shadowColor = 'transparent';
        ctx.drawImage(charImg, -cardW / 2, -cardH / 2, cardW, cardH);

        // Highlight rim light on edge
        const rimGrad = ctx.createLinearGradient(-cardW / 2, -cardH / 2, cardW / 2, cardH / 2);
        rimGrad.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
        rimGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0)');
        rimGrad.addColorStop(1, 'rgba(0, 0, 0, 0.2)');
        ctx.fillStyle = rimGrad;
        ctx.fillRect(-cardW / 2, -cardH / 2, cardW, cardH);
        ctx.restore();

        // Border ring
        ctx.lineWidth = 3;
        ctx.strokeStyle = options.activeRegenCharId === char.id ? '#10B981' : '#FFFFFF';
        ctx.stroke();

        ctx.restore();

        // Identity Badge attached to person
        ctx.save();
        ctx.translate(charX, charY + baseSize * 0.54);

        const badgeW = Math.max(100, asset.name.length * 24 + 50);
        const badgeH = 30;

        ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
        ctx.beginPath();
        ctx.roundRect(-badgeW / 2, -badgeH / 2, badgeW, badgeH, 15);
        ctx.fill();

        ctx.strokeStyle = '#38BDF8';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.font = 'bold 13px system-ui, -apple-system, sans-serif';
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${char.id} ${asset.name}`, 0, 0);

        ctx.restore();
      } catch (err) {
        console.error('Failed to draw character image on canvas:', err);
      }
    }
  }

  // Watermark / metadata footer bar
  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.65)';
  ctx.fillRect(0, height - 36, width, 36);

  ctx.font = '12px system-ui, sans-serif';
  ctx.fillStyle = '#CBD5E1';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(
    `2D AI Scene Composer  |  Blueprint: "${blueprint.title}"  |  ${sortedCharacters.length} 人物锁定`,
    20,
    height - 18
  );

  ctx.textAlign = 'right';
  ctx.fillStyle = options.isDraft ? '#F59E0B' : '#10B981';
  ctx.fillText(
    options.isDraft ? 'STAGE 1: 构图草图 (SCENE DRAFT)' : 'STAGE 2: 高精度确定性场景渲染 (FINAL RENDER)',
    width - 20,
    height - 18
  );
  ctx.restore();

  return canvas.toDataURL('image/jpeg', 0.94);
}
