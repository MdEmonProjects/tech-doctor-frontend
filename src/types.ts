export interface Product {
  id: string;
  slug?: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  specs: string;
  inStock: boolean;
  badge?: 'Best Seller' | 'New' | 'Save 20%' | 'Hot Deal' | 'Certified Refurbished';
  image: string;
  description: string;
  colors?: string[];
  features?: string[];
  warrantyMonths?: number;
  warranty?: string;
  images?: string[];
  specifications?: { title: string; rows: { label: string; value: string }[] }[];
  model?: string;
  sku?: string;
  stockStatus?: string;
  isFeatured?: boolean;
  quantity?: number;
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  count: number;
  image: string;
  description: string;
}

export interface RepairService {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  estimatedTime: string;
  startingPrice: number;
  warranty: string;
  iconName: string;
  popularIssues: string[];
  supportedBrands: string[];
}

export interface RepairBookingRequest {
  id?: string;
  deviceBrand: string;
  deviceModel: string;
  repairType: string;
  preferredDate: string;
  preferredTime: string;
  serviceMode: 'in-store' | 'mail-in' | 'courier-pickup';
  name: string;
  phone: string;
  email: string;
  notes: string;
  estimatedPrice?: number;
  status?: 'pending' | 'confirmed';
}

export interface CustomerReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  device: string;
  serviceOrProduct: string;
  comment: string;
  verified: boolean;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'repairs' | 'products' | 'warranty' | 'store';
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  description: string;
  type: 'success' | 'info' | 'warning';
}

export interface RepairTrackingStep {
  name: string;
  status: 'completed' | 'in-progress' | 'pending';
  timestamp?: string;
  detail: string;
}

export interface RepairTrackingTicket {
  ticketId: string;
  customerName: string;
  device: string;
  imeiSnippet: string;
  serviceRequested: string;
  dateReceived: string;
  estimatedCompletion: string;
  currentStep: number;
  totalSteps: number;
  statusTitle: string;
  statusBadge: 'Received' | 'In Diagnostics' | 'Under Precision Repair' | 'Quality Control' | 'Ready for Pickup' | 'Shipped';
  technician: {
    name: string;
    role: string;
    avatar: string;
  };
  steps: RepairTrackingStep[];
  diagnostics: {
    batteryHealthOriginal?: string;
    batteryHealthNew?: string;
    displayTrueTonePreserved?: boolean;
    waterProofSealPressure?: string;
    technicianNotes: string;
  };
  totalCost: number;
  warrantyPeriod: string;
}

export interface TradeInDeviceOption {
  id: string;
  brand: 'Apple' | 'Samsung' | 'Google' | 'OnePlus';
  name: string;
  storages: { size: string; baseValue: number }[];
  image: string;
}

