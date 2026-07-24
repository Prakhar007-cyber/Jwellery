import bcrypt from "bcryptjs";
import { connectDB } from "./db";
import { Product } from "./models/Product";
import { User } from "./models/User";
import { IMAGES, img } from "./images";

/*
  Seed data + seedDatabase().
  ------------------------------------------------------------
  Used by the CLI script (`npm run seed`) and by the dev
  auto-seed (when running on the in-memory MongoDB). Products
  use verified Unsplash photography from src/lib/images.ts.
*/

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

// [primary, alternate] image pairs — alternate shows on card hover.
const p = (id: string) => img(id, 900);

type SeedProduct = {
  name: string;
  price: number;
  compareAtPrice?: number;
  category: string;
  collection: string;
  material: string;
  stone: string;
  images: string[];
  sizes?: string[];
  stock: number;
  featured?: boolean;
  newArrival?: boolean;
  bestSeller?: boolean;
  shortDescription: string;
  description: string;
};

const RING_SIZES = ["48", "50", "52", "54", "56"];

export const seedProducts: SeedProduct[] = [
  // ---------------- RINGS ----------------
  {
    name: "Celeste Diamond Ring",
    price: 4200,
    compareAtPrice: 4800,
    category: "rings",
    collection: "celeste",
    material: "18K White Gold",
    stone: "Lab-Grown Diamond",
    images: [p(IMAGES.ringDiamondDark), p(IMAGES.ringBoxWood)],
    sizes: RING_SIZES,
    stock: 8,
    featured: true,
    bestSeller: true,
    shortDescription: "A brilliant halo solitaire born from light.",
    description:
      "The Celeste solitaire centres a hand-selected brilliant-cut diamond within a delicate halo of pavé stones. Set in 18K white gold and finished by hand in the ÉLANORA atelier, it is designed to catch light from every angle.",
  },
  {
    name: "Amara Solitaire",
    price: 5600,
    category: "rings",
    collection: "eternal",
    material: "Platinum",
    stone: "Lab-Grown Diamond",
    images: [p(IMAGES.ringBoxWood), p(IMAGES.ringDiamondDark)],
    sizes: RING_SIZES,
    stock: 5,
    featured: true,
    shortDescription: "A timeless platinum solitaire.",
    description:
      "Amara is our purest expression of the solitaire — a single radiant stone raised on a slender platinum band. Understated, enduring, and made to be worn for a lifetime.",
  },
  {
    name: "Aurora Gemstone Ring",
    price: 2350,
    category: "rings",
    collection: "aurora",
    material: "18K White Gold",
    stone: "Amethyst & Citrine",
    images: [p(IMAGES.ringFlowerGem), p(IMAGES.ringsGemstone)],
    sizes: RING_SIZES,
    stock: 12,
    newArrival: true,
    shortDescription: "A blossom of colour in white gold.",
    description:
      "Inspired by first light, the Aurora ring arranges amethyst and citrine petals around a diamond centre. A joyful, colourful piece with serious craftsmanship.",
  },
  {
    name: "Seraphine Rose Ring",
    price: 3100,
    category: "rings",
    collection: "aurora",
    material: "18K Rose Gold",
    stone: "Pink Sapphire",
    images: [p(IMAGES.ringPinkRoseGold), p(IMAGES.ringsGemstone)],
    sizes: RING_SIZES,
    stock: 9,
    bestSeller: true,
    shortDescription: "A cushion pink sapphire in warm rose gold.",
    description:
      "A cushion-cut pink sapphire framed by a diamond halo and carried on a pavé rose-gold band. Romance, engineered.",
  },
  {
    name: "Étoile Stackable Rings",
    price: 1450,
    category: "rings",
    collection: "solstice",
    material: "18K Yellow Gold",
    stone: "Moonstone",
    images: [p(IMAGES.ringsGemstone), p(IMAGES.ringFlowerGem)],
    sizes: RING_SIZES,
    stock: 18,
    newArrival: true,
    shortDescription: "Delicate stacking rings, sold as a pair.",
    description:
      "Two slender bands set with cabochon moonstones, designed to be worn together or apart. The beginning of a collection you build over time.",
  },
  {
    name: "Nova Signet Ring",
    price: 1890,
    category: "rings",
    collection: "solstice",
    material: "18K Yellow Gold",
    stone: "None",
    images: [p(IMAGES.ringBoxWood), p(IMAGES.ringsGemstone)],
    sizes: RING_SIZES,
    stock: 14,
    shortDescription: "A modern signet in warm yellow gold.",
    description:
      "A contemporary take on the classic signet — a smooth polished face on a substantial yellow-gold band. Quietly confident.",
  },

  // ---------------- NECKLACES ----------------
  {
    name: "Seraphine Pearl Necklace",
    price: 2650,
    category: "necklaces",
    collection: "celeste",
    material: "18K White Gold",
    stone: "Freshwater Pearl",
    images: [p(IMAGES.necklacePearlBox), p(IMAGES.modelNecklacesBlouse)],
    stock: 10,
    featured: true,
    shortDescription: "A strand of luminous freshwater pearls.",
    description:
      "A graduated strand of hand-knotted freshwater pearls finished with a diamond-set white-gold clasp. A modern heirloom.",
  },
  {
    name: "Luna Pendant Necklace",
    price: 1750,
    category: "necklaces",
    collection: "celeste",
    material: "18K White Gold",
    stone: "Lab-Grown Diamond",
    images: [p(IMAGES.necklaceDiamondPendant), p(IMAGES.modelPendantWhite)],
    stock: 16,
    bestSeller: true,
    newArrival: true,
    shortDescription: "A cushion halo pendant on a fine chain.",
    description:
      "The Luna pendant suspends a diamond cushion halo from a whisper-fine white-gold chain. Effortless day to night.",
  },
  {
    name: "Solstice Gold Pendant",
    price: 1320,
    category: "necklaces",
    collection: "solstice",
    material: "18K Yellow Gold",
    stone: "Topaz",
    images: [p(IMAGES.necklaceGoldPendants), p(IMAGES.modelDelicateNecklace)],
    stock: 20,
    newArrival: true,
    shortDescription: "Layered gold pendants with blue topaz.",
    description:
      "A pair of pendants — a faceted blue topaz and a crescent moon — designed to be layered on warm yellow-gold chains.",
  },
  {
    name: "Amara Layered Chain",
    price: 1980,
    category: "necklaces",
    collection: "eternal",
    material: "18K Yellow Gold",
    stone: "None",
    images: [p(IMAGES.modelLayeredGold), p(IMAGES.necklaceGoldPendants)],
    stock: 13,
    featured: true,
    shortDescription: "An effortless layered gold necklace.",
    description:
      "Two chains of different weights, pre-layered so they fall perfectly. The kind of piece you never take off.",
  },
  {
    name: "Celeste Diamond Rivière",
    price: 6900,
    compareAtPrice: 7600,
    category: "necklaces",
    collection: "celeste",
    material: "18K White Gold",
    stone: "Lab-Grown Diamond",
    images: [p(IMAGES.modelNecklacesBlouse), p(IMAGES.necklaceDiamondPendant)],
    stock: 4,
    featured: true,
    shortDescription: "A continuous line of brilliant diamonds.",
    description:
      "The rivière is the ultimate statement — a graduated line of brilliant-cut diamonds encircling the neck in a single, unbroken sweep of light.",
  },
  {
    name: "Ondine Choker",
    price: 1490,
    category: "necklaces",
    collection: "aurora",
    material: "18K Rose Gold",
    stone: "Freshwater Pearl",
    images: [p(IMAGES.modelDelicateNecklace), p(IMAGES.necklacePearlBox)],
    stock: 15,
    shortDescription: "A delicate pearl-and-chain choker.",
    description:
      "A soft choker of tiny pearls and fine rose-gold chain that sits close to the collarbone. Romantic and modern at once.",
  },

  // ---------------- BRACELETS ----------------
  {
    name: "Étoile Diamond Bracelet",
    price: 3850,
    category: "bracelets",
    collection: "celeste",
    material: "18K White Gold",
    stone: "Lab-Grown Diamond",
    images: [p(IMAGES.braceletDiamondDark), p(IMAGES.modelHandsBracelet)],
    stock: 7,
    featured: true,
    bestSeller: true,
    shortDescription: "A line of diamonds around the wrist.",
    description:
      "A classic tennis bracelet reimagined — a continuous line of claw-set brilliant diamonds on a supple white-gold link.",
  },
  {
    name: "Aurora Rose Bangle",
    price: 2200,
    category: "bracelets",
    collection: "aurora",
    material: "18K Rose Gold",
    stone: "Lab-Grown Diamond",
    images: [p(IMAGES.braceletRoseGold), p(IMAGES.modelHandsBracelet)],
    stock: 11,
    newArrival: true,
    shortDescription: "A pavé eternity bangle in rose gold.",
    description:
      "Rows of pavé diamonds wrap this rose-gold bangle in a soft, continuous shimmer. Designed to stack or stand alone.",
  },
  {
    name: "Solstice Chain Bracelet",
    price: 1290,
    category: "bracelets",
    collection: "solstice",
    material: "18K Yellow Gold",
    stone: "None",
    images: [p(IMAGES.braceletGoldChain), p(IMAGES.modelGoldBangles)],
    stock: 22,
    bestSeller: true,
    shortDescription: "A bold polished gold chain.",
    description:
      "Substantial, sculptural links in warm yellow gold. The Solstice chain is made to be seen.",
  },
  {
    name: "Amara Gold Cuff",
    price: 1680,
    category: "bracelets",
    collection: "eternal",
    material: "18K Yellow Gold",
    stone: "None",
    images: [p(IMAGES.modelGoldBangles), p(IMAGES.braceletGoldChain)],
    stock: 9,
    newArrival: true,
    shortDescription: "A smooth architectural gold cuff.",
    description:
      "A clean, open cuff in polished yellow gold — architectural, weighty and endlessly wearable.",
  },

  // ---------------- EARRINGS ----------------
  {
    name: "Luna Pearl Earrings",
    price: 1150,
    category: "earrings",
    collection: "celeste",
    material: "18K White Gold",
    stone: "Freshwater Pearl",
    images: [p(IMAGES.earringsGoldHoops2), p(IMAGES.earringsGoldHoops)],
    stock: 17,
    newArrival: true,
    shortDescription: "Delicate gold hoops with a soft finish.",
    description:
      "Sculpted, twisting hoops finished in a soft brushed gold. Light on the ear, lovely on everyone.",
  },
  {
    name: "Solstice Gold Hoops",
    price: 980,
    category: "earrings",
    collection: "solstice",
    material: "18K Yellow Gold",
    stone: "None",
    images: [p(IMAGES.earringsGoldHoops), p(IMAGES.earringsGoldHoops2)],
    stock: 25,
    bestSeller: true,
    featured: true,
    shortDescription: "The everyday gold hoop, perfected.",
    description:
      "A chunky, hand-polished gold hoop with a smooth continuous profile. The one pair you'll reach for daily.",
  },
  {
    name: "Aurora Sapphire Drops",
    price: 2750,
    category: "earrings",
    collection: "aurora",
    material: "18K White Gold",
    stone: "Blue Sapphire",
    images: [p(IMAGES.earringsSapphire), p(IMAGES.earringsGoldHoops2)],
    stock: 6,
    featured: true,
    shortDescription: "Sapphire drops framed in diamonds.",
    description:
      "Pear-cut blue sapphires suspended within a frame of baguette and brilliant diamonds. Red-carpet worthy.",
  },
  {
    name: "Étoile Diamond Studs",
    price: 1980,
    category: "earrings",
    collection: "celeste",
    material: "18K White Gold",
    stone: "Lab-Grown Diamond",
    images: [p(IMAGES.earringsGoldHoops2), p(IMAGES.earringsSapphire)],
    stock: 14,
    bestSeller: true,
    shortDescription: "Classic brilliant diamond studs.",
    description:
      "A matched pair of brilliant-cut diamonds in a four-claw white-gold setting. The definition of a wardrobe essential.",
  },

  // ---------------- WEDDING ----------------
  {
    name: "Eternal Wedding Band",
    price: 2450,
    category: "wedding",
    collection: "eternal",
    material: "Platinum",
    stone: "Lab-Grown Diamond",
    images: [p(IMAGES.ringBoxWood), p(IMAGES.ringDiamondDark)],
    sizes: RING_SIZES,
    stock: 10,
    featured: true,
    bestSeller: true,
    shortDescription: "A full-eternity platinum diamond band.",
    description:
      "A continuous circle of claw-set diamonds in platinum — a full eternity band symbolising a love without end.",
  },
  {
    name: "Éternité Bridal Set",
    price: 5900,
    category: "wedding",
    collection: "eternal",
    material: "18K Yellow Gold",
    stone: "Ruby & Gold",
    images: [p(IMAGES.necklaceGoldSet), p(IMAGES.modelLayeredGold)],
    stock: 4,
    featured: true,
    shortDescription: "A ceremonial gold necklace and earring set.",
    description:
      "An ornate gold necklace and matching earrings set with rubies — crafted for the most important day, and every anniversary after.",
  },
  {
    name: "Promise Solitaire Ring",
    price: 4600,
    category: "wedding",
    collection: "eternal",
    material: "18K White Gold",
    stone: "Lab-Grown Diamond",
    images: [p(IMAGES.ringDiamondDark), p(IMAGES.ringBoxWood)],
    sizes: RING_SIZES,
    stock: 6,
    featured: true,
    newArrival: true,
    shortDescription: "The engagement ring, distilled.",
    description:
      "A brilliant solitaire raised on a fine pavé band — our most-requested proposal ring, hand-set to order.",
  },
];

export async function seedDatabase() {
  await connectDB();

  // Reset products so re-running the seed gives a clean, known state.
  await Product.deleteMany({});
  const withSlugs = seedProducts.map((prod) => ({ ...prod, slug: slugify(prod.name) }));
  await Product.insertMany(withSlugs);

  // Create an admin + demo customer if they don't already exist.
  const adminEmail = "admin@elanora.com";
  if (!(await User.findOne({ email: adminEmail }))) {
    await User.create({
      name: "ÉLANORA Admin",
      email: adminEmail,
      passwordHash: await bcrypt.hash("admin1234", 10),
      role: "admin",
    });
  }

  const demoEmail = "demo@elanora.com";
  if (!(await User.findOne({ email: demoEmail }))) {
    await User.create({
      name: "Élise Moreau",
      email: demoEmail,
      passwordHash: await bcrypt.hash("demo1234", 10),
      role: "customer",
    });
  }

  return { products: withSlugs.length };
}
