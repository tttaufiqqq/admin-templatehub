import { type LuminaProductImageKey } from "@/utils/lumina-assets";
import { resolvePublicImagePath } from "@/utils/resolve-public-image-path";

const DEFAULT_PRODUCT_IMAGE_ORDER: LuminaProductImageKey[] = [
  "pendant",
  "chair",
  "stool",
  "vase",
];

const SEEDED_PRODUCT_IMAGE_MAP: Record<string, LuminaProductImageKey> = {
  "budget-command-center": "pendant",
  "client-launch-kit": "chair",
  "deep-study-system": "stool",
  "ops-control-pack": "vase",
};

function hashText(value: string) {
  let hash = 0;

  for (const character of value) {
    hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  }

  return hash;
}

function resolveFallbackKey(input: {
  slug: string;
  productId?: string;
  fallbackIndex?: number;
}) {
  const mappedKey = SEEDED_PRODUCT_IMAGE_MAP[input.slug];

  if (mappedKey) {
    return mappedKey;
  }

  if (typeof input.fallbackIndex === "number") {
    return DEFAULT_PRODUCT_IMAGE_ORDER[
      input.fallbackIndex % DEFAULT_PRODUCT_IMAGE_ORDER.length
    ]!;
  }

  const stableHash = hashText(`${input.slug}:${input.productId ?? input.slug}`);

  return DEFAULT_PRODUCT_IMAGE_ORDER[stableHash % DEFAULT_PRODUCT_IMAGE_ORDER.length]!;
}

export function resolveStorefrontImageUrl(input: {
  previewImagePath: string | null | undefined;
  slug: string;
  productId?: string;
  fallbackIndex?: number;
}) {
  return resolvePublicImagePath(
    input.previewImagePath,
    resolveFallbackKey(input),
  );
}
