export const LUMINA_ASSETS = {
  hero: "/images/lumina/hero/hero.jpg",
  lookbook: {
    interior: "/images/lumina/lookbook/interior.jpg",
    detail: "/images/lumina/lookbook/detail.jpg",
  },
  craftsmanship: "/images/lumina/craftsmanship/craftsmanship.jpg",
  products: {
    pendant: "/images/lumina/products/pendant.jpg",
    chair: "/images/lumina/products/chair.jpg",
    stool: "/images/lumina/products/stool.jpg",
    vase: "/images/lumina/products/vase.jpg",
  },
} as const;

export type LuminaProductImageKey = keyof typeof LUMINA_ASSETS.products;
