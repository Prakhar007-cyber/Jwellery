/*
  Central image library.
  ------------------------------------------------------------
  Every image below is a hand-picked, verified Unsplash photo
  (luxury jewelry / fashion / bridal). Keeping them in one place
  means the landing page, product seed and auth pages all pull
  from the same consistent, verified set — no broken images.
*/

const BASE = "https://images.unsplash.com/photo-";

// Build an optimized Unsplash URL. Next/Image handles final resizing,
// but we request a sensible width so the source is crisp.
export function img(id: string, w = 1400): string {
  return `${BASE}${id}?auto=format&fit=crop&w=${w}&q=80`;
}

// Named, role-based references used across the UI.
export const IMAGES = {
  // Hero / campaign — cinematic model + jewelry
  heroModelGoldChain: "1633810542706-90e5ff7557be",
  fashionPortraitDark: "1524504388940-b1c1722653e1",

  // Editorial / lifestyle (model wearing jewelry)
  modelPendantWhite: "1611085583191-a3b181a88401",
  modelHandsBracelet: "1596944924616-7b38e7cfac36",
  modelRingsNecklace: "1620656798579-1984d9e87df7",
  modelLayeredGold: "1610694955371-d4a3e0ce4b52",
  modelNecklacesBlouse: "1600721391689-2564bb8055de",
  modelGoldBangles: "1583292650898-7d22cd27ca6f",
  modelDelicateNecklace: "1611652022419-a9419f74343d",

  // Bridal
  weddingCouple: "1519741497674-611481863552",

  // Material / craftsmanship
  goldBars: "1610375461246-83df859d849d",

  // Product photography (also reused in category tiles)
  ringDiamondDark: "1605100804763-247f67b3557e",
  ringFlowerGem: "1602751584552-8ba73aad10e1",
  ringPinkRoseGold: "1603561591411-07134e71a2a9",
  ringBoxWood: "1512163143273-bde0e3cc7407",
  ringsGemstone: "1608042314453-ae338d80c427",
  necklacePearlBox: "1515562141207-7a88fb7ce338",
  necklaceGoldPendants: "1599643478518-a784e5dc4c8f",
  necklaceDiamondPendant: "1589128777073-263566ae5e4d",
  necklaceGoldSet: "1601121141461-9d6647bca1ed",
  earringsSapphire: "1535632066927-ab7c9ab60908",
  earringsGoldHoops: "1617038220319-276d3cfab638",
  earringsGoldHoops2: "1584302179602-e4c3d3fd629d",
  braceletRoseGold: "1611591437281-460bfbe1220a",
  braceletDiamondDark: "1573408301185-9146fe634ad0",
  braceletGoldChain: "1602173574767-37ac01994b2a",
  flatlayGoldMix: "1606760227091-3dd870d97f1d",
} as const;

// Convenience: category → representative image id (for shop-by-category tiles).
export const CATEGORY_IMAGE: Record<string, string> = {
  rings: IMAGES.ringDiamondDark,
  necklaces: IMAGES.modelLayeredGold,
  bracelets: IMAGES.modelGoldBangles,
  earrings: IMAGES.earringsGoldHoops,
  wedding: IMAGES.necklaceGoldSet,
};
