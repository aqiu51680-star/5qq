
export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAW = 'WITHDRAW',
  COMMISSION = 'COMMISSION',
  ORDER_PRINCIPAL = 'ORDER_PRINCIPAL' // Return principal
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  COMPLETED = 'COMPLETED'
}

export interface BankInfo {
  realName: string;
  accountNumber: string;
  bankName: string;
}

export interface SystemConfig {
  dailyOrderLimit: number;
  commissionRate: number;
  minBalancePercent: number;
  maxBalancePercent: number;
  maintenanceMode: boolean;
}

export interface ContentItem {
  id: string;
  title: string;
  text: string;
  imageUrl?: string;
  section: 'HOME' | 'HELP' | 'GRAB';
}

export interface AppContent {
  bannerUrl: string;
  marqueeText: string;
  eventTitle: string;
  popupEnabled: boolean;
  popupTitle: string;
  popupMessage: string;
  popupImageUrl?: string; 
  introText: string;
  welcomeText: string;
  introImageUrl?: string;
  textColor: string;
  textSize: string;
  logoUrl?: string;
  gettingStartedImage?: string;
  gettingStartedText?: string;
  csLink?: string;
  
  // Grab Page Configuration
  startPageImage?: string; 
  startPageText?: string;  
  startPageTextColor?: string; 
  startPageTextSize?: string; 
  
  // Explicit Grab Page Fields
  grabPageImage?: string;
  grabPageText?: string;
  grabPageTextColor?: string;
  grabPageTextSize?: string;
  
  // Auth UI Configuration
  authBgImage?: string;
  authTitle?: string;
  authSubtitle?: string;
  authPrimaryColor?: string;
  authTitleColor?: string;
  authTitleSize?: string;

  additionalContent: ContentItem[];
  slides: string[];
}

export interface SpecificOrderConfig {
  orderIndex: number;
  amount: number;
  commissionRate: number;
  productName?: string;
  productImage?: string;
}

export interface LevelConfig {
  level: number;
  name: string;
  dailyOrderLimit?: number;
  commissionRate?: number;
  minBalancePercent?: number;
  maxBalancePercent?: number;
  specificOrders?: SpecificOrderConfig[];
  startPageImage?: string;
  startPageText?: string;
}

export interface RegistrationCode {
  id: string;
  code: string;
  status: 'UNUSED' | 'USED' | 'EXPIRED';
  createdAt: number;
  usedBy?: string;
  usedAt?: number;
}

export interface User {
  id: string;
  username: string;
  fullName: string;
  phoneNumber: string;
  password?: string;
  transactionPassword?: string;
  balance: number;
  frozenBalance: number;
  role: Role;
  avatarUrl: string;
  referralCode: string;
  referredBy?: string;
  level: number;
  ordersCompletedToday: number;
  bankInfo?: BankInfo;
  address?: string;
  status: 'ACTIVE' | 'LOCKED';
  createdAt: number;
  ipAddress?: string;
  lastOnline?: number;
  isFake: boolean;
  deviceInfo?: string;
  customDailyOrderLimit?: number;
  customCommissionRate?: number;
  customMinBalancePercent?: number;
  customMaxBalancePercent?: number;
  customMaxOrderAmount?: number;
  customSpecificOrders?: SpecificOrderConfig[];
  isOrderFrozen?: boolean;
  customOrderLoadingTime?: number; 
}

export interface Order {
  id: string;
  userId: string;
  productName: string;
  productImage: string;
  amount: number;
  commission: number;
  status: 'PENDING' | 'COMPLETED';
  timestamp: number;
}

export interface Product {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  createdAt?: number;
}

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  timestamp: number;
  details?: string;
}

export interface Notification {
  message: string;
  type: 'info' | 'alert';
  timestamp: number;
}

export type Currency = 'USD';

export interface AppContextType {
  currentUser: User | null;
  users: User[];
  orders: Order[];
  transactions: Transaction[];
  products: Product[];
  theme: 'light' | 'dark';
  language: 'en' | 'vi' | 'zh';
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  systemConfig: SystemConfig;
  levelConfigs: LevelConfig[];
  registrationCodes: RegistrationCode[];
  appContent: AppContent;
  isLoading: boolean;
  adminNotification: Notification | null;
  clearAdminNotification: () => void;
  
  login: (identifier: string, password: string) => Promise<boolean>;
  register: (data: any) => Promise<boolean>;
  logout: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setLanguage: (lang: 'en' | 'vi' | 'zh') => void;
  formatPrice: (amount: number) => string;
  
  grabOrder: () => Promise<Order>;
  confirmOrder: (orderId: string) => Promise<void>;
  cancelOrder: (orderId: string) => Promise<void>;
  requestDeposit: (amount: number, proof: string) => Promise<void>;
  requestWithdraw: (amount: number, password: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => void;
  bindBank: (data: BankInfo) => void;
  
  updateUser: (userId: string, data: Partial<User>) => void;
  toggleUserType: (userId: string) => void;
  resetUserDailyOrders: (userId: string) => void;
  approveTransaction: (txId: string) => void;
  rejectTransaction: (txId: string) => void;
  createTransaction: (data: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (txId: string) => Promise<void>;
  generateReferralCode: () => string;
  updateSystemConfig: (config: SystemConfig) => void;
  updateLevelConfig: (config: LevelConfig) => void;
  addLevelConfig: (config: LevelConfig) => void;
  deleteLevelConfig: (level: number) => void;
  createRegistrationCode: () => void;
  expireRegistrationCode: (id: string) => void;
  deleteRegistrationCode: (id: string) => void;
  updateAppContent: (content: AppContent) => void;
  
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  generateMockProducts: () => Promise<void>;
}
