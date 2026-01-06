
export interface Product {
  id: string;
  name: string;
  category: string;
  stock: number;
  price: number;
  supplier?: string;
  description?: string;
  frame_type?: string;
  lens_type?: string;
  color?: string;
  size?: string;
  image?: string;
  brand?: string;
  features?: string[];
  colors?: string[];
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface AppointmentData {
  name: string;
  email: string;
  phone: string;
  date: string;
  service: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}
