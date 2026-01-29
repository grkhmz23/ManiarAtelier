export interface Product {
  id: number;
  name: string;
  category: 'men' | 'women';
  price: number;
  image: string;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Classic Atelier Jacket",
    category: "men",
    price: 120.00,
    image: "/images/hero-1.jpg"
  },
  {
    id: 2,
    name: "Modern Slim T-Shirt",
    category: "men",
    price: 45.00,
    image: "/images/hero-2.png" 
  },
  {
    id: 3,
    name: "Evening Silk Dress",
    category: "women",
    price: 180.00,
    image: "/images/hero-2.png"
  },
  {
    id: 4,
    name: "Urban Crop Top",
    category: "women",
    price: 35.00,
    image: "/images/hero-1.jpg"
  }
];
