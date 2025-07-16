// Notification Types
export interface NotificationInput {
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  duration?: number;
}

export interface NotificationProps extends NotificationInput {
  id: string;
  onClose: () => void;
}

// components/Landing/types.ts
export interface Car {
  _id: string;
  images: string[];
  price: number;
  brand: string;
  model: string;
  year: number;
  category?: string;
  condition?: string;
  transmission?: string;
  fuelType?: string;
  mileage?: number;
  engineSize?: string;
  cylinders?: number;
  color?: string;
  doors?: number;
  chassisNumber?: string;
  bodyType?: string;
  description?: string;
  isFeatured?: boolean;
  createdAt?: Date;
}

export interface SliderImage {
  _id: string;
  imageUrl: string;
  caption?: string;
  isActive?: boolean;
  order?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type SliderSettings = {
  autoplay?: boolean;
  autoplayDelay?: number;
  loop?: boolean;
  navigation?: boolean;
  pagination?: boolean;
  effect?: "slide" | "fade" | "cube" | "coverflow" | "flip";
};

// User and Auth Types
export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  isLoading: boolean;
}

export type AuthAction =
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; payload: { user: User; token: string } }
  | { type: "LOGIN_FAILURE" }
  | { type: "LOGOUT" }
  | { type: "SET_LOADING"; payload: boolean };

export interface AuthContextType {
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// App Types
export interface Company {
  logo: string;
  name: string;
  address?: string;
  email?: string;
  phone?: string;
  currency: "CHF" | "USD" | "EGP";
  language: "it" | "en" | "gr" | "ar";
  watermark?: string;
  showNotes?: boolean;
  showTerms?: boolean;
  taxRate?: number;
}

export interface Client {
  _id: string;
  id?: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  archived?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  discount: number;
  price: number;
  archived?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface InvoiceItem {
  id: string; // Can keep 'id' if not stored in DB
  name: string;
  description: string;
  price: number;
  quantity: number;
  amount: number;
  discount: number;
}

export interface InvoiceClient {
  _id: string;
  id: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
}

export interface Invoice {
  _id?: string;
  userId?: string;
  number: string;
  date: string;
  client: InvoiceClient;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  paid: boolean; // Changed from status to simple boolean
  notes?: string;
  terms?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AppState {
  company: Company;
  clients: Client[];
  products: Product[];
  invoices: Invoice[];
}

export type AppAction =
  | { type: "UPDATE_COMPANY"; payload: Company }
  | { type: "ADD_CLIENT"; payload: Client }
  | { type: "ADD_PRODUCT"; payload: Product }
  | { type: "ADD_INVOICE"; payload: Invoice }
  | { type: "UPDATE_CLIENT"; payload: Client }
  | { type: "UPDATE_PRODUCT"; payload: Product }
  | { type: "UPDATE_INVOICE"; payload: Invoice }
  | { type: "ARCHIVE_CLIENT"; payload: string }
  | { type: "UNARCHIVE_CLIENT"; payload: string }
  | { type: "ARCHIVE_PRODUCT"; payload: string }
  | { type: "UNARCHIVE_PRODUCT"; payload: string }
  | { type: "LOAD_DATA"; payload: AppState }
  | { type: "SET_CLIENTS"; payload: Client[] }
  | { type: "SET_PRODUCTS"; payload: Product[] }
  | { type: "SET_INVOICES"; payload: Invoice[] };

export interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  loadUserData: () => Promise<void>;
  saveInvoice: (invoice: Partial<Invoice>) => Promise<boolean>;
  updateInvoice: (invoice: Partial<Invoice>) => Promise<boolean>;
}

// Language Types
export interface LanguageContextType {
  t: (key: string) => string;
  isRTL: boolean;
  language: "it" | "en" | "gr" | "ar";
  setLanguage: (lang: "it" | "en" | "gr" | "ar") => void;
}

// Notification Context Type
export interface NotificationContextType {
  notifications: NotificationProps[];
  addNotification: (notification: NotificationInput) => string;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
  showSuccess: (title: string, message?: string, duration?: number) => string;
  showError: (title: string, message?: string, duration?: number) => string;
  showWarning: (title: string, message?: string, duration?: number) => string;
  showInfo: (title: string, message?: string, duration?: number) => string;
}
