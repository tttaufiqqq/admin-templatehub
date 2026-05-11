import { LUMINA_ASSETS, type LuminaProductImageKey } from "@/utils/lumina-assets";

function normalizePublicAssetPath(path: string) {
  const trimmedPath = path.trim();

  if (trimmedPath.startsWith("/")) {
    return trimmedPath;
  }

  if (trimmedPath.startsWith("public/")) {
    return `/${trimmedPath.slice("public/".length)}`;
  }

  return `/${trimmedPath.replace(/^\.?\//, "")}`;
}

export function resolvePublicImagePath(
  previewImagePath: string | null | undefined,
  fallbackKey: LuminaProductImageKey,
) {
  const normalizedPreviewPath = previewImagePath?.trim();

  if (normalizedPreviewPath) {
    return normalizePublicAssetPath(normalizedPreviewPath);
  }

  return LUMINA_ASSETS.products[fallbackKey];
}
