export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar: string;
  joinDate: string;
  isVerified: boolean;
  stats: {
    totalOrders: number;
    wishlistItems: number;
    totalSpent: number;
  };
  recentOrders: Order[];
  reviews: Review[];
  recentActivity: Activity[];
}

export interface Order {
  id: string;
  date: string;
  status: 'En attente' | 'En cours' | 'Livré' | 'Annulé';
  total: number;
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export interface Review {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  rating: number;
  comment: string;
  date: string;
  response?: string;
}

export interface Activity {
  type: 'order' | 'review' | 'wishlist' | 'login';
  description: string;
  date: string;
  link?: string;
}
