// Service API pour communiquer avec le backend NestJS
const API_URL = 'http://localhost:3001/api';

// Fonction utilitaire pour les requêtes HTTP
async function fetchApi(endpoint: string, options: RequestInit = {}) {
  // Récupérer le token d'authentification depuis le localStorage
  const token = localStorage.getItem('token');
  
  // Configuration par défaut des requêtes
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
  
  // Fusionner les options par défaut avec les options fournies
  const fetchOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...(options.headers || {}),
    },
  };
  
  try {
    const response = await fetch(`${API_URL}${endpoint}`, fetchOptions);
    
    // Vérifier si la réponse est OK (status 200-299)
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Erreur ${response.status}: ${response.statusText}`);
    }
    
    // Vérifier si la réponse est vide
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }
    
    return response.text();
  } catch (error) {
    console.error('Erreur API:', error);
    throw error;
  }
}

// Types pour les données utilisateur
interface UserRegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
}

interface UserUpdateData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  isAvailable?: boolean;
}

// Service d'authentification
export const authApi = {
  // Connexion d'un utilisateur
  login: async (email: string, password: string) => {
    const response = await fetchApi('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    // Stocker le token et les informations utilisateur
    localStorage.setItem('token', response.access_token);
    localStorage.setItem('user', JSON.stringify(response.user));
    localStorage.setItem('isLoggedIn', 'true');
    
    return response;
  },
  
  // Inscription d'un utilisateur
  register: async (userData: UserRegistrationData) => {
    const response = await fetchApi('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    // Stocker le token et les informations utilisateur
    localStorage.setItem('token', response.access_token);
    localStorage.setItem('user', JSON.stringify(response.user));
    localStorage.setItem('isLoggedIn', 'true');
    
    return response;
  },
  
  // Déconnexion utilisateur
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.setItem('isLoggedIn', 'false');
  },
  
  // Récupérer le profil utilisateur
  getProfile: async () => {
    return fetchApi('/auth/profile');
  },
  
  // Vérifier si l'utilisateur est connecté
  isAuthenticated: (): boolean => {
    return localStorage.getItem('isLoggedIn') === 'true';
  },
  
  // Récupérer les informations de l'utilisateur connecté
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
};

// Service de gestion des utilisateurs
export const usersApi = {
  // Récupérer tous les utilisateurs (admin seulement)
  getAll: async () => {
    return fetchApi('/users');
  },
  
  // Récupérer un utilisateur par son ID
  getById: async (id: number) => {
    return fetchApi(`/users/${id}`);
  },
  
  // Mettre à jour un utilisateur
  update: async (id: number, userData: UserUpdateData) => {
    return fetchApi(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(userData),
    });
  },
  
  // Supprimer un utilisateur (admin seulement)
  delete: async (id: number) => {
    return fetchApi(`/users/${id}`, {
      method: 'DELETE',
    });
  },
  
  // Mettre à jour la disponibilité d'un vendeur
  updateAvailability: async (id: number, isAvailable: boolean) => {
    return fetchApi(`/users/${id}/availability`, {
      method: 'PATCH',
      body: JSON.stringify({ isAvailable }),
    });
  },
  
  // Récupérer tous les vendeurs
  getVendors: async () => {
    return fetchApi('/users/vendors');
  },
};

// Service de gestion des produits
export const productsApi = {
  // Récupérer tous les produits
  getAll: async (options: { featured?: boolean; categoryId?: number; vendorId?: number } = {}) => {
    const params = new URLSearchParams();
    
    if (options.featured !== undefined) {
      params.append('featured', options.featured.toString());
    }
    
    if (options.categoryId) {
      params.append('categoryId', options.categoryId.toString());
    }
    
    if (options.vendorId) {
      params.append('vendorId', options.vendorId.toString());
    }
    
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return fetchApi(`/products${queryString}`);
  },
  
  // Récupérer un produit par son ID
  getById: async (id: number) => {
    return fetchApi(`/products/${id}`);
  },
  
  // Rechercher des produits
  search: async (query: string) => {
    return fetchApi(`/products/search?query=${encodeURIComponent(query)}`);
  },
  
  // Récupérer les produits mis en avant
  getFeatured: async () => {
    return fetchApi('/products/featured');
  },
  
  // Récupérer les produits par catégorie
  getByCategory: async (categoryId: number) => {
    return fetchApi(`/products/category/${categoryId}`);
  },
  
  // Récupérer les produits par vendeur
  getByVendor: async (vendorId: number) => {
    return fetchApi(`/products/vendor/${vendorId}`);
  },
  
  // Créer un nouveau produit (vendeur seulement)
  create: async (productData: ProductData): Promise<any> => {
    return fetchApi('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  },
  
  // Mettre à jour un produit (vendeur seulement)
  update: async (id: number, productData: ProductData): Promise<any> => {
    return fetchApi(`/products/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(productData),
    });
  },
  
  // Supprimer un produit (vendeur seulement)
  delete: async (id: number) => {
    return fetchApi(`/products/${id}`, {
      method: 'DELETE',
    });
  },
};

// Service de gestion des catégories
export const categoriesApi = {
  // Récupérer toutes les catégories
  getAll: async () => {
    return fetchApi('/categories');
  },
  
  // Récupérer une catégorie par son ID
  getById: async (id: number) => {
    return fetchApi(`/categories/${id}`);
  },
  
  // Récupérer une catégorie par son slug
  getBySlug: async (slug: string) => {
    return fetchApi(`/categories/slug/${slug}`);
  },
  
  // Créer une nouvelle catégorie (admin seulement)
  create: async (categoryData: any) => {
    return fetchApi('/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  },
  
  // Mettre à jour une catégorie (admin seulement)
  update: async (id: number, categoryData: any) => {
    return fetchApi(`/categories/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(categoryData),
    });
  },
  
  // Supprimer une catégorie (admin seulement)
  delete: async (id: number) => {
    return fetchApi(`/categories/${id}`, {
      method: 'DELETE',
    });
  },
};

// Types pour les données de panier
interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    price: number;
    mainImage?: string;
    stock: number;
  };
}

interface Cart {
  id: number;
  userId: number;
  items: CartItem[];
  total: number;
  itemCount: number;
}

// Service de gestion du panier
export const cartApi = {
  // Récupérer le panier de l'utilisateur connecté
  getCart: async (): Promise<Cart> => {
    return fetchApi('/cart');
  },
  
  // Ajouter un produit au panier
  addToCart: async (productId: number, quantity: number): Promise<Cart> => {
    return fetchApi('/cart/items', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });
  },
  
  // Mettre à jour la quantité d'un produit dans le panier
  updateCartItem: async (itemId: number, quantity: number): Promise<Cart> => {
    return fetchApi(`/cart/items/${itemId}`, {
      method: 'PATCH',
      body: JSON.stringify({ quantity }),
    });
  },
  
  // Supprimer un produit du panier
  removeCartItem: async (itemId: number): Promise<Cart> => {
    return fetchApi(`/cart/items/${itemId}`, {
      method: 'DELETE',
    });
  },
  
  // Vider le panier
  clearCart: async (): Promise<void> => {
    return fetchApi('/cart', {
      method: 'DELETE',
    });
  },
  
  // Récupérer le total du panier
  getCartTotal: async (): Promise<{ total: number; itemCount: number }> => {
    return fetchApi('/cart/total');
  },
  
  // Vérifier si un produit est dans le panier
  isInCart: async (productId: number): Promise<boolean> => {
    const cart = await fetchApi('/cart');
    return cart.items.some((item: CartItem) => item.productId === productId);
  },
  
  // Récupérer la quantité d'un produit dans le panier
  getItemQuantity: async (productId: number): Promise<number> => {
    const cart = await fetchApi('/cart');
    const item = cart.items.find((item: CartItem) => item.productId === productId);
    return item ? item.quantity : 0;
  },
};

// Types pour les données de commande
interface OrderItem {
  id: number;
  productId: number;
  quantity: number;
  price: number;
  product: {
    id: number;
    name: string;
    mainImage?: string;
  };
}

interface OrderAddress {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
}

interface OrderData {
  shippingAddress: OrderAddress;
  paymentMethod: string;
  items?: OrderItem[];
  note?: string;
}

interface Order {
  id: number;
  orderNumber: string;
  userId: number;
  items: OrderItem[];
  total: number;
  status: string;
  shippingAddress: OrderAddress;
  paymentMethod: string;
  paymentId?: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

interface OrderStatusData {
  status: string;
}

interface OrderUpdateData {
  status?: string;
  paymentId?: string;
  shippingAddress?: OrderAddress;
  paymentMethod?: string;
  note?: string;
}

// Service de gestion des commandes
export const ordersApi = {
  // Récupérer toutes les commandes (admin/vendeur seulement)
  getAll: async (): Promise<Order[]> => {
    return fetchApi('/orders');
  },
  
  // Récupérer les commandes de l'utilisateur connecté
  getMyOrders: async (): Promise<Order[]> => {
    return fetchApi('/orders/my-orders');
  },
  
  // Récupérer une commande par son ID
  getById: async (id: number): Promise<Order> => {
    return fetchApi(`/orders/${id}`);
  },
  
  // Récupérer une commande par son numéro
  getByOrderNumber: async (orderNumber: string): Promise<Order> => {
    return fetchApi(`/orders/number/${orderNumber}`);
  },
  
  // Créer une nouvelle commande
  create: async (orderData: OrderData): Promise<Order> => {
    return fetchApi('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },
  
  // Mettre à jour une commande
  update: async (id: number, orderData: OrderUpdateData): Promise<Order> => {
    return fetchApi(`/orders/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(orderData),
    });
  },
  
  // Mettre à jour le statut d'une commande (admin/vendeur seulement)
  updateStatus: async (id: number, status: string): Promise<Order> => {
    const statusData: OrderStatusData = { status };
    return fetchApi(`/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(statusData),
    });
  },
  
  // Marquer une commande comme payée
  markAsPaid: async (id: number, paymentId: string): Promise<Order> => {
    return fetchApi(`/orders/${id}/pay`, {
      method: 'PATCH',
      body: JSON.stringify({ paymentId }),
    });
  },
  
  // Annuler une commande
  cancelOrder: async (id: number, reason?: string): Promise<Order> => {
    return fetchApi(`/orders/${id}/cancel`, {
      method: 'PATCH',
      body: JSON.stringify({ reason }),
    });
  },
  
  // Créer une commande à partir du panier
  createFromCart: async (orderData: OrderData): Promise<Order> => {
    // Ajouter un indicateur pour utiliser le panier actuel
    const orderWithCartFlag = {
      ...orderData,
      useCart: true
    };
    
    return fetchApi('/orders/from-cart', {
      method: 'POST',
      body: JSON.stringify(orderWithCartFlag),
    });
  },
  
  // Vérifier la disponibilité des produits dans une commande
  checkAvailability: async (items: { productId: number; quantity: number }[]): Promise<{ 
    available: boolean; 
    unavailableItems?: { 
      productId: number; 
      name: string; 
      requestedQuantity: number; 
      availableQuantity: number 
    }[] 
  }> => {
    return fetchApi('/orders/check-availability', {
      method: 'POST',
      body: JSON.stringify({ items }),
    });
  },
  
  // Calculer les frais de livraison
  calculateShipping: async (address: OrderAddress): Promise<{ 
    shippingCost: number; 
    estimatedDelivery: { min: number; max: number } 
  }> => {
    return fetchApi('/orders/calculate-shipping', {
      method: 'POST',
      body: JSON.stringify({ address }),
    });
  },
};

// Service de gestion des messages
export const messagesApi = {
  // Récupérer les conversations de l'utilisateur connecté
  getConversations: async () => {
    return fetchApi('/messages/conversations');
  },
  
  // Récupérer les messages d'une conversation
  getConversation: async (conversationId: string) => {
    return fetchApi(`/messages/conversation/${conversationId}`);
  },
  
  // Envoyer un message
  sendMessage: async (receiverId: number, content: string, conversationId?: string) => {
    return fetchApi('/messages', {
      method: 'POST',
      body: JSON.stringify({ receiverId, content, conversationId }),
    });
  },
  
  // Marquer une conversation comme lue
  markConversationAsRead: async (conversationId: string) => {
    return fetchApi(`/messages/conversation/${conversationId}/read`, {
      method: 'PATCH',
    });
  },
  
  // Marquer un message comme lu
  markAsRead: async (messageId: number) => {
    return fetchApi(`/messages/${messageId}/read`, {
      method: 'PATCH',
    });
  },
};

// Types pour les données
interface ProductData {
  name: string;
  description?: string;
  price: number;
  stock: number;
  categoryId: number;
  mainImage?: string;
  featured?: boolean;
  isActive?: boolean;
  vendorId?: number;
}

// Service de gestion de l'espace vendeur
export const vendorApi = {
  // Mettre à jour la disponibilité du vendeur
  updateAvailability: async (isAvailable: boolean) => {
    const user = authApi.getCurrentUser();
    if (!user) throw new Error('Utilisateur non connecté');
    
    return usersApi.updateAvailability(user.id, isAvailable);
  },
  
  // Récupérer les produits du vendeur
  getMyProducts: async () => {
    const user = authApi.getCurrentUser();
    if (!user) throw new Error('Utilisateur non connecté');
    
    return fetchApi(`/products/vendor/${user.id}`);
  },
  
  // Récupérer les commandes du vendeur
  getMyOrders: async () => {
    const user = authApi.getCurrentUser();
    if (!user) throw new Error('Utilisateur non connecté');
    
    return fetchApi(`/orders/vendor/${user.id}`);
  },
  
  // Récupérer les statistiques du vendeur
  getStats: async () => {
    const user = authApi.getCurrentUser();
    if (!user) throw new Error('Utilisateur non connecté');
    
    return fetchApi(`/users/${user.id}/stats`);
  },
  
  // Ajouter un produit
  addProduct: async (productData: ProductData) => {
    const user = authApi.getCurrentUser();
    if (!user) throw new Error('Utilisateur non connecté');
    
    // Ajouter l'ID du vendeur au produit
    const productWithVendorId = {
      ...productData,
      vendorId: user.id
    };
    
    return productsApi.create(productWithVendorId);
  },
  
  // Mettre à jour un produit
  updateProduct: async (id: number, productData: ProductData) => {
    const user = authApi.getCurrentUser();
    if (!user) throw new Error('Utilisateur non connecté');
    
    return productsApi.update(id, productData);
  },
  
  // Supprimer un produit
  deleteProduct: async (id: number) => {
    const user = authApi.getCurrentUser();
    if (!user) throw new Error('Utilisateur non connecté');
    
    return productsApi.delete(id);
  },
  
  // Mettre à jour le statut d'une commande
  updateOrderStatus: async (id: number, status: string) => {
    const user = authApi.getCurrentUser();
    if (!user) throw new Error('Utilisateur non connecté');
    
    return ordersApi.updateStatus(id, status);
  },
};

// Exporter tous les services API
export const api = {
  auth: authApi,
  users: usersApi,
  products: productsApi,
  categories: categoriesApi,
  cart: cartApi,
  orders: ordersApi,
  messages: messagesApi,
  vendor: vendorApi,
};
