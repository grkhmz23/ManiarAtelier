export type ProductSize = "XS" | "S" | "M" | "L" | "XL";
export type ProductGender = "men" | "women";
export type ProductCategory = "coats" | "kaftans" | "djellabas" | "gilets" | "skirts" | "sets" | "shirts" | "jackets";

export type Product = {
  id: string;
  name: string;
  priceEUR: number;
  image: string;
  images: string[];
  badge?: string;
  description: string;
  materials: string[];
  sizes: ProductSize[];
  gender: ProductGender;
  category: ProductCategory;
};

export const CATALOG: Product[] = [
  // MEN
  {
    id: "men1",
    name: "Atlas Formal Set",
    priceEUR: 289,
    image: "/images/men/men1/1768391131209.jpg",
    images: [
      "/images/men/men1/1768391131209.jpg",
      "/images/men/men1/1768482382785.jpg",
      "/images/men/men1/1768392578012.jpg",
      "/images/men/men1/1768392335633.jpg",
      "/images/men/men1/1768482543569.jpg",
    ],
    badge: "New",
    description: "A refined formal set inspired by Atlas evenings. Structured shoulders with modern ceremonial elegance.",
    materials: ["Premium wool blend", "Satin lining", "Hand-finished seams"],
    sizes: ["S", "M", "L", "XL"],
    gender: "men",
    category: "sets",
  },
  {
    id: "men2",
    name: "Noir Gold Djellaba",
    priceEUR: 345,
    image: "/images/men/men2/1768408725427.jpg",
    images: [
      "/images/men/men2/1768408725427.jpg",
      "/images/men/men2/1768409850829.jpg",
      "/images/men/men2/1768409707359.jpg",
      "/images/men/men2/1768409160889.jpg",
    ],
    badge: "Signature",
    description: "Deep noir with gold accents. Traditional geometry meets watchmaker-like precision.",
    materials: ["Wool twill", "Gold-thread detailing", "Reinforced cuffs"],
    sizes: ["S", "M", "L", "XL"],
    gender: "men",
    category: "djellabas",
  },
  {
    id: "men3",
    name: "Royal Ceremony Coat",
    priceEUR: 395,
    image: "/images/men/men3/1768743527500.jpg",
    images: [
      "/images/men/men3/1768743527500.jpg",
      "/images/men/men3/1768743776491.jpg",
      "/images/men/men3/1768744142223.jpg",
      "/images/men/men3/1768743687699.jpg",
    ],
    badge: "Limited",
    description: "A statement piece for royal occasions. Crisp proportions and commanding presence.",
    materials: ["Atlas wool", "Silk lining", "Brass buttons"],
    sizes: ["M", "L", "XL"],
    gender: "men",
    category: "coats",
  },
  {
    id: "men4",
    name: "Desert Gilet",
    priceEUR: 189,
    image: "/images/men/men4/1768765690790.jpg",
    images: [
      "/images/men/men4/1768765690790.jpg",
      "/images/men/men4/1768765447765.jpg",
      "/images/men/men4/1768763785463.jpg",
    ],
    description: "Tailored gilet with precise proportions. Clean lines for effortless layering.",
    materials: ["Wool blend", "Satin back panel", "Metallic buckle"],
    sizes: ["S", "M", "L", "XL"],
    gender: "men",
    category: "gilets",
  },
  // WOMEN
  {
    id: "women1",
    name: "Emerald Silk Kaftan",
    priceEUR: 275,
    image: "/images/women/women1/1768331243184.jpg",
    images: [
      "/images/women/women1/1768331243184.jpg",
      "/images/women/women1/1768389903323.jpg",
      "/images/women/women1/1768339207662.jpg",
      "/images/women/women1/1768338944749.jpg",
      "/images/women/women1/1768333163527.jpg",
    ],
    badge: "New",
    description: "A fluid kaftan in luminous emerald. Catches light like polished brass on a vintage dial.",
    materials: ["Satin weave", "Cotton piping", "Hidden placket"],
    sizes: ["XS", "S", "M", "L"],
    gender: "women",
    category: "kaftans",
  },
  {
    id: "women2",
    name: "Golden Hour Set",
    priceEUR: 320,
    image: "/images/women/women2/1768406855910.jpg",
    images: [
      "/images/women/women2/1768406855910.jpg",
      "/images/women/women2/1768481356523.jpg",
      "/images/women/women2/1768407315872.jpg",
      "/images/women/women2/1768333757118.jpg",
      "/images/women/women2/1768406993781.jpg",
    ],
    badge: "Signature",
    description: "Cinematic gold tones with architectural texture. Made for evening movement.",
    materials: ["Cotton-silk blend", "Matte buttons", "Hand-pressed pleats"],
    sizes: ["S", "M", "L"],
    gender: "women",
    category: "sets",
  },
  {
    id: "women3",
    name: "Marrakesh Night Dress",
    priceEUR: 265,
    image: "/images/women/women3/1768558231369.jpg",
    images: [
      "/images/women/women3/1768558231369.jpg",
      "/images/women/women3/1768738783335.jpg",
      "/images/women/women3/1768762296182.jpg",
      "/images/women/women3/1768762520709.jpg",
    ],
    badge: "Atelier",
    description: "Flowing silhouette with Moroccan heritage details. Graceful power in motion.",
    materials: ["Mixed textiles", "Hand-finished edges", "Signature detailing"],
    sizes: ["XS", "S", "M", "L"],
    gender: "women",
    category: "kaftans",
  },
  {
    id: "women4",
    name: "Ivory Elegance",
    priceEUR: 245,
    image: "/images/women/women4/1768766326888.jpg",
    images: [
      "/images/women/women4/1768766326888.jpg",
      "/images/women/women4/1768766522888.jpg",
      "/images/women/women4/1768766075666.jpg",
      "/images/women/women4/1768766183645.jpg",
      "/images/women/women4/1768766289530.jpg",
    ],
    description: "Refined ivory with soft structure. Balances texture with bright, silent presence.",
    materials: ["Cotton poplin", "Inner lining", "Hidden zipper"],
    sizes: ["XS", "S", "M", "L"],
    gender: "women",
    category: "skirts",
  },
];

export function getProductsByGender(gender: ProductGender): Product[] {
  return CATALOG.filter((p) => p.gender === gender);
}

export function getCategoriesForGender(gender: ProductGender): ProductCategory[] {
  const products = getProductsByGender(gender);
  return [...new Set(products.map((p) => p.category))];
}

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  coats: "Coats",
  kaftans: "Kaftans",
  djellabas: "Djellabas",
  gilets: "Gilets",
  skirts: "Skirts",
  sets: "Sets",
  shirts: "Shirts",
  jackets: "Jackets",
};

export const SIZE_ORDER: ProductSize[] = ["XS", "S", "M", "L", "XL"];

export const PRICE_RANGES = [
  { id: "all", label: "All Prices", min: 0, max: Infinity },
  { id: "under-250", label: "Under €250", min: 0, max: 249 },
  { id: "250-350", label: "€250 - €350", min: 250, max: 350 },
  { id: "over-350", label: "Over €350", min: 351, max: Infinity },
] as const;

export type PriceRangeId = typeof PRICE_RANGES[number]["id"];

export function formatEUR(amount: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
}
