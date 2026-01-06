
import { Product } from './types';

export const COLORS = {
  primary: '#2563eb', // Blue-600
  secondary: '#1d4ed8', // Blue-700
  accent: '#eff6ff', // Blue-50
  white: '#ffffff',
  slate: '#64748b'
};

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Aviator Classic',
    brand: 'Luxottica',
    price: 11250,
    category: 'Sunglasses',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=800',
    description: 'The quintessence of heritage cool. Originally crafted for aviators in 1937, the Aviator Classic blends iconic teardrop styling with exceptional performance. Featuring gold-plated metal construction and high-definition polarized lenses.',
    features: ['UV400 Protection', 'Polarized Lenses', 'Gold-plated frame'],
    colors: ['Gold', 'Silver', 'Gunmetal'],
    stock: 12
  },
  {
    id: '2',
    name: 'Minimalist Frame',
    brand: 'Zenith',
    price: 8400,
    category: 'Optical',
    image: 'https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&q=80&w=800',
    description: 'Redefine your professional aesthetic with Zenith’s architecturally inspired frames. Engineered for the modern digital workspace with premium Italian acetate.',
    features: ['Blue Light Filter', 'Ultra-light Acetate', 'Ergonomic Bridge'],
    colors: ['Black', 'Navy', 'Crystal Clear'],
    stock: 4
  },
  {
    id: '3',
    name: 'Cat-Eye Elegance',
    brand: 'Vogue',
    price: 14200,
    category: 'Optical',
    image: 'https://images.unsplash.com/photo-1511499767390-90342f5673a7?auto=format&fit=crop&q=80&w=800',
    description: 'A masterpiece of vintage-modern fusion. These frames offer a seductive cat-eye silhouette that lifts and defines facial features.',
    features: ['Spring Hinges', 'Premium Acetate', 'Anti-Reflective Coating'],
    colors: ['Tortoise', 'Ruby', 'Obsidian'],
    stock: 8
  },
  {
    id: '4',
    name: 'Executive Round',
    brand: 'Titan',
    price: 18500,
    category: 'Optical',
    image: 'https://images.unsplash.com/photo-1509695507497-903c140c43b0?auto=format&fit=crop&q=80&w=800',
    description: 'Where surgical-grade precision meets high-fashion artistry. The Executive Round is meticulously forged from pure titanium.',
    features: ['Pure Titanium', 'Nickel Free', 'Scratch Resistant'],
    colors: ['Rose Gold', 'Matte Black', 'Brushed Steel'],
    stock: 2
  },
  {
    id: '5',
    name: 'Active Sports Wrap',
    brand: 'Endurance',
    price: 6800,
    category: 'Sunglasses',
    image: 'https://images.unsplash.com/photo-1512101176959-c557f3516787?auto=format&fit=crop&q=80&w=800',
    description: 'High-octane protection for the extreme athlete. Designed with a wraparound curvature that maximizes peripheral coverage.',
    features: ['Impact Resistant', 'Hydrophobic Coating', 'Non-slip Nosepads'],
    colors: ['Electric Blue', 'Neon Orange', 'Black'],
    stock: 15
  },
  {
    id: '6',
    name: 'Daily Soft Contact',
    brand: 'Acuvue',
    price: 2450,
    category: 'Contact Lenses',
    image: 'https://images.unsplash.com/photo-1617347454431-f49d7ff5c3b1?auto=format&fit=crop&q=80&w=800',
    description: 'Experience the sensation of wearing nothing at all. Premium daily disposables infused with moisturizing technology.',
    features: ['UV Blocking', 'Moisturizing Agent', 'Breathable Material'],
    colors: ['Clear'],
    stock: 25
  }
];
