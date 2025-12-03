
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppContextType, Role, User, Order, Transaction, TransactionType, TransactionStatus, BankInfo, LevelConfig, RegistrationCode, SystemConfig, Notification, AppContent, Currency, ContentItem, Product } from '../../types';
import { PRODUCT_IMAGES, PRODUCT_NAMES, TRANSLATIONS } from '../../constants';
import { supabase } from '../../supabaseClient';

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_SYSTEM_CONFIG: SystemConfig = {
  dailyOrderLimit: 60,
  commissionRate: 0.02,
  minBalancePercent: 0.1,
  maxBalancePercent: 0.5,
  maintenanceMode: false
};

const INITIAL_LEVEL_CONFIGS: LevelConfig[] = [
  { level: 1, name: 'Member', dailyOrderLimit: undefined, commissionRate: undefined, minBalancePercent: undefined, maxBalancePercent: undefined, specificOrders: [] },
  { level: 2, name: 'Silver', dailyOrderLimit: 65, commissionRate: 0.025, minBalancePercent: undefined, maxBalancePercent: 0.6, specificOrders: [] },
  { level: 3, name: 'Gold', dailyOrderLimit: 70, commissionRate: 0.03, minBalancePercent: 0.2, maxBalancePercent: 0.7, specificOrders: [] },
];

const INITIAL_APP_CONTENT: AppContent = {
    bannerUrl: "https://picsum.photos/800/400?random=10",
    marqueeText: "System maintenance at 12:00 PM.",
    eventTitle: "New Event: Double Commission!",
    popupEnabled: false,
    popupTitle: "Important Notice",
    popupMessage: "Welcome to our platform!",
    popupImageUrl: "",
    popupTitleColor: "#1e3a8a",
    popupTitleSize: "text-xl",
    popupTitleFontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif",
    popupTitleFontWeight: "700",
    popupTextColor: "#374151",
    popupTextSize: "text-base",
    popupTextFontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif",
    popupTextFontWeight: "400",
    introText: "Welcome to the leading order matching platform.",
    welcomeText: "Welcome Back",
    introImageUrl: "",
    textColor: "#000000",
    textSize: "text-base",
    textFontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif",
    textFontWeight: "400",
    csLink: "https://t.me/customerservice",
    startPageImage: "",
    startPageText: "Start earning today!",
    startPageTextColor: "#000000",
    startPageTextSize: "text-base",
    startPageFontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif",
    startPageFontWeight: "600",
    logoUrl: "", 
    gettingStartedImage: "",
    gettingStartedText: "Welcome to the platform.",
    additionalContent: [], 
    slides: [
        "https://picsum.photos/800/400?random=101",
        "https://picsum.photos/800/400?random=102",
        "https://picsum.photos/800/400?random=103"
    ],
    grabPageImage: "",
    grabPageText: "Click Start to receive orders.",
    grabPageTextColor: "#000000",
    grabPageTextSize: "text-base",
    grabPageFontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif",
    grabPageFontWeight: "500",
    authBgImage: "",
    authTitle: "TEST",
    authSubtitle: "Welcome Back",
    authPrimaryColor: "#2563eb",
    authTitleColor: "#1e3a8a",
    authTitleSize: "text-3xl",
    authTitleFontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif",
    authTitleFontWeight: "700",
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [systemConfig, setSystemConfig] = useState<SystemConfig>(INITIAL_SYSTEM_CONFIG);
  const [levelConfigs, setLevelConfigs] = useState<LevelConfig[]>(INITIAL_LEVEL_CONFIGS);
  const [registrationCodes, setRegistrationCodes] = useState<RegistrationCode[]>([]);
  const [appContent, setAppContentState] = useState<AppContent>(INITIAL_APP_CONTENT);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [language, setLanguage] = useState<'en' | 'vi' | 'zh'>('vi'); 
  const [currency, setCurrency] = useState<Currency>('USD');
  const [isLoading, setIsLoading] = useState(true);
  const [adminNotification, setAdminNotification] = useState<Notification | null>(null);

  const formatPrice = (amount: number): string => {
      return '$' + amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const mapUser = (u: any): User => ({
    id: u.id,
    username: u.username,
    fullName: u.full_name,
    phoneNumber: u.phone_number,
    password: u.password,
    transactionPassword: u.transaction_password,
    balance: u.balance,
    frozenBalance: u.frozen_balance,
    role: u.role as Role,
    avatarUrl: u.avatar_url,
    referralCode: u.referral_code,
    referredBy: u.referred_by,
    level: u.level,
    ordersCompletedToday: u.orders_completed_today,
    bankInfo: u.bank_info || { bankName: '', accountNumber: '', realName: '' },
    address: u.address || '',
    status: u.status,
    createdAt: u.created_at,
    ipAddress: u.ip_address,
    lastOnline: u.last_online,
    isFake: u.is_fake || false,
    deviceInfo: u.device_info,
    customDailyOrderLimit: u.custom_daily_order_limit,
    customCommissionRate: u.custom_commission_rate,
    customMinBalancePercent: u.custom_min_balance_percent,
    customMaxBalancePercent: u.custom_max_balance_percent,
    customMaxOrderAmount: u.custom_max_order_amount,
    customSpecificOrders: u.custom_specific_orders || [],
    isOrderFrozen: u.is_order_frozen || false,
    customOrderLoadingTime: u.custom_order_loading_time || 3,
  });

  const mapOrder = (o: any): Order => ({
    id: o.id,
    userId: o.user_id,
    productName: o.product_name,
    productImage: o.product_image,
    amount: o.amount,
    commission: o.commission,
    status: o.status,
    timestamp: o.timestamp
  });

  const mapTransaction = (t: any): Transaction => ({
    id: t.id,
    userId: t.user_id,
    type: t.type as TransactionType,
    amount: t.amount,
    status: t.status as TransactionStatus,
    timestamp: t.timestamp,
    details: t.details
  });

  const mapRegCode = (r: any): RegistrationCode => ({
    id: r.id,
    code: r.code,
    status: r.status,
    createdAt: r.created_at,
    usedBy: r.used_by,
    usedAt: r.used_at
  });

  const mapProduct = (p: any): Product => ({
      id: p.id,
      name: p.name,
      imageUrl: p.image_url,
      price: p.price,
      createdAt: p.created_at
  });

  const getDeviceInfo = () => {
    const ua = navigator.userAgent;
    let os = "Unknown OS";
    if (ua.indexOf("Win") !== -1) os = "Windows";
    if (ua.indexOf("Mac") !== -1) os = "MacOS";
    if (ua.indexOf("Android") !== -1) os = "Android";
    if (ua.indexOf("like Mac") !== -1) os = "iOS";
    
    return `${os} - Browser`;
  };

  const getRealIPAddress = async (): Promise<string> => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip || '127.0.0.1';
    } catch (error) {
      // Fallback if IP detection fails
      return '127.0.0.1';
    }
  };

  const playAlertSound = () => {
    try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContext) {
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.frequency.value = 440;
            gain.gain.value = 0.1;
            osc.start();
            setTimeout(() => osc.stop(), 500);
        }
    } catch (e) { console.error(e); }
  };

  const updateOnlineStatus = async (uid: string) => {
      await supabase.from('users').update({ 
          last_online: Date.now(),
          device_info: getDeviceInfo()
      }).eq('id', uid);
  };

  useEffect(() => {
    const init = async () => {
        try {
            await fetchData();
            const storedUserId = localStorage.getItem('currentUserId');
            if (storedUserId) {
                const { data: userData } = await supabase.from('users').select('*').eq('id', storedUserId).single();
                if (userData && userData.status === 'ACTIVE') {
                    await updateOnlineStatus(userData.id);
                    const { data: updatedUserData } = await supabase.from('users').select('*').eq('id', storedUserId).single();
                    setCurrentUser(mapUser(updatedUserData));
                } else {
                    localStorage.removeItem('currentUserId');
                }
            }
            
            const channel = supabase.channel('public:db_changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, (payload) => {
                if (payload.eventType === 'INSERT') setUsers(prev => [...prev, mapUser(payload.new)]);
                if (payload.eventType === 'UPDATE') setUsers(prev => prev.map(u => u.id === payload.new.id ? mapUser(payload.new) : u));
            })
            .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, (payload) => {
                if (payload.eventType === 'INSERT') setOrders(prev => [mapOrder(payload.new), ...prev]);
                if (payload.eventType === 'UPDATE') setOrders(prev => prev.map(o => o.id === payload.new.id ? mapOrder(payload.new) : o));
            })
            .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, (payload) => {
                if (payload.eventType === 'INSERT') {
                    const newTx = mapTransaction(payload.new);
                    setTransactions(prev => [newTx, ...prev]);
                    if (newTx.status === 'PENDING' && (newTx.type === 'DEPOSIT' || newTx.type === 'WITHDRAW')) {
                        setAdminNotification({ message: `New ${newTx.type}: ${formatPrice(newTx.amount)}`, type: 'alert', timestamp: Date.now() });
                        playAlertSound();
                    }
                }
                if (payload.eventType === 'UPDATE') setTransactions(prev => prev.map(t => t.id === payload.new.id ? mapTransaction(payload.new) : t));
                if (payload.eventType === 'DELETE') setTransactions(prev => prev.filter(t => t.id !== payload.old.id));
            })
            .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, (payload) => {
                if (payload.eventType === 'INSERT') setProducts(prev => [mapProduct(payload.new), ...prev]);
                if (payload.eventType === 'UPDATE') setProducts(prev => prev.map(p => p.id === payload.new.id ? mapProduct(payload.new) : p));
                if (payload.eventType === 'DELETE') setProducts(prev => prev.filter(p => p.id !== payload.old.id));
            })
            .on('postgres_changes', { event: '*', schema: 'public', table: 'registration_codes' }, (payload) => {
                if (payload.eventType === 'INSERT') setRegistrationCodes(prev => [mapRegCode(payload.new), ...prev]);
                if (payload.eventType === 'UPDATE') setRegistrationCodes(prev => prev.map(r => r.id === payload.new.id ? mapRegCode(payload.new) : r));
            })
            .on('postgres_changes', { event: '*', schema: 'public', table: 'app_content' }, (payload) => {
                if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
                    const c = payload.new;
                    // log realtime updates for debugging
                    // eslint-disable-next-line no-console
                    console.log('[AppContext] realtime app_content update received:', { eventType: payload.eventType, new: c });
                    setAppContentState(prev => ({ ...prev, 
                      bannerUrl: c.banner_url, marqueeText: c.marquee_text, eventTitle: c.event_title,
                      popupEnabled: c.popup_enabled, popupTitle: c.popup_title, popupMessage: c.popup_message, popupImageUrl: c.popup_image_url,
                      popupTitleColor: c.popup_title_color, popupTitleSize: c.popup_title_size, popupTitleFontFamily: c.popup_title_font_family, popupTitleFontWeight: c.popup_title_font_weight,
                      popupTextColor: c.popup_text_color, popupTextSize: c.popup_text_size, popupTextFontFamily: c.popup_text_font_family, popupTextFontWeight: c.popup_text_font_weight,
                      introText: c.intro_text, welcomeText: c.welcome_text, introImageUrl: c.intro_image_url,
                      textColor: c.text_color, textSize: c.text_size, textFontFamily: c.text_font_family, textFontWeight: c.text_font_weight, csLink: c.cs_link,
                      startPageImage: c.start_page_image, startPageText: c.start_page_text, startPageTextColor: c.start_page_text_color, startPageTextSize: c.start_page_text_size, startPageFontFamily: c.start_page_font_family, startPageFontWeight: c.start_page_font_weight,
                      additionalContent: c.additional_content || [], slides: c.slides || [], logoUrl: c.logo_url,
                      gettingStartedImage: c.getting_started_image, gettingStartedText: c.getting_started_text,
                      grabPageImage: c.grab_page_image, grabPageText: c.grab_page_text, grabPageTextColor: c.grab_page_text_color, grabPageTextSize: c.grab_page_text_size, grabPageFontFamily: c.grab_page_font_family, grabPageFontWeight: c.grab_page_font_weight,
                      authBgImage: c.auth_bg_image, authTitle: c.auth_title, authSubtitle: c.auth_subtitle, authPrimaryColor: c.auth_primary_color, authTitleColor: c.auth_title_color, authTitleSize: c.auth_title_size, authTitleFontFamily: c.auth_title_font_family, authTitleFontWeight: c.auth_title_font_weight
                    }));
                }
            })
            .subscribe((status, err) => {
                // eslint-disable-next-line no-console
                console.log('[AppContext] Realtime subscription status:', status, err);
            });

            return () => { 
                // eslint-disable-next-line no-console
                console.log('[AppContext] Cleaning up realtime channel');
                supabase.removeChannel(channel); 
            };
        } catch (e) { console.error("Init error:", e); } finally { setIsLoading(false); }
    };
    init();
  }, []);

  useEffect(() => {
    if (currentUser) {
      const updatedUser = users.find(u => u.id === currentUser.id);
      if (updatedUser && JSON.stringify(updatedUser) !== JSON.stringify(currentUser)) {
          setCurrentUser(updatedUser);
      }
    }
  }, [users]); 

  const fetchData = async () => {
    const { data: userData } = await supabase.from('users').select('*');
    if (userData) setUsers(userData.map(mapUser));
    const { data: orderData } = await supabase.from('orders').select('*').order('timestamp', { ascending: false });
    if (orderData) setOrders(orderData.map(mapOrder));
    const { data: prodData } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (prodData) setProducts(prodData.map(mapProduct));
    const { data: txData } = await supabase.from('transactions').select('*').order('timestamp', { ascending: false });
    if (txData) setTransactions(txData.map(mapTransaction));
    const { data: rcData } = await supabase.from('registration_codes').select('*').order('created_at', { ascending: false });
    if (rcData) setRegistrationCodes(rcData.map(mapRegCode));
    const { data: contentData } = await supabase.from('app_content').select('*').eq('id', 'default').single();
    if (contentData) {
      // eslint-disable-next-line no-console
      console.log('[AppContext] fetchData loaded app_content:', contentData);
      setAppContentState({
        bannerUrl: contentData.banner_url, marqueeText: contentData.marquee_text, eventTitle: contentData.event_title,
        popupEnabled: contentData.popup_enabled, popupTitle: contentData.popup_title, popupMessage: contentData.popup_message, popupImageUrl: contentData.popup_image_url,
        popupTitleColor: contentData.popup_title_color, popupTitleSize: contentData.popup_title_size, popupTitleFontFamily: contentData.popup_title_font_family, popupTitleFontWeight: contentData.popup_title_font_weight,
        popupTextColor: contentData.popup_text_color, popupTextSize: contentData.popup_text_size, popupTextFontFamily: contentData.popup_text_font_family, popupTextFontWeight: contentData.popup_text_font_weight,
        introText: contentData.intro_text, welcomeText: contentData.welcome_text, introImageUrl: contentData.intro_image_url,
        textColor: contentData.text_color, textSize: contentData.text_size, textFontFamily: contentData.text_font_family, textFontWeight: contentData.text_font_weight, csLink: contentData.cs_link,
        startPageImage: contentData.start_page_image, startPageText: contentData.start_page_text, startPageTextColor: contentData.start_page_text_color, startPageTextSize: contentData.start_page_text_size, startPageFontFamily: contentData.start_page_font_family, startPageFontWeight: contentData.start_page_font_weight,
        additionalContent: contentData.additional_content || [], slides: contentData.slides || [], logoUrl: contentData.logo_url,
        gettingStartedImage: contentData.getting_started_image, gettingStartedText: contentData.getting_started_text,
        grabPageImage: contentData.grab_page_image, grabPageText: contentData.grab_page_text, grabPageTextColor: contentData.grab_page_text_color, grabPageTextSize: contentData.grab_page_text_size, grabPageFontFamily: contentData.grab_page_font_family, grabPageFontWeight: contentData.grab_page_font_weight,
        authBgImage: contentData.auth_bg_image, authTitle: contentData.auth_title, authSubtitle: contentData.auth_subtitle, authPrimaryColor: contentData.auth_primary_color, authTitleColor: contentData.auth_title_color, authTitleSize: contentData.auth_title_size, authTitleFontFamily: contentData.auth_title_font_family, authTitleFontWeight: contentData.auth_title_font_weight
      });
    }
  };

  const login = async (identifier: string, pass: string): Promise<boolean> => {
    const realIP = await getRealIPAddress();
    if (systemConfig.maintenanceMode) {
       const { data } = await supabase.from('users').select('*').or(`username.eq.${identifier},phone_number.eq.${identifier}`).eq('password', pass).single();
       if (data && data.role === Role.ADMIN) {
           await supabase.from('users').update({ ip_address: realIP, last_online: Date.now() }).eq('id', data.id);
           setCurrentUser(mapUser(data));
           localStorage.setItem('currentUserId', data.id);
           return true;
       }
       throw new Error("System under maintenance.");
    }
    const { data, error } = await supabase.from('users').select('*').or(`username.eq.${identifier},phone_number.eq.${identifier}`).eq('password', pass).single();
    if (error || !data) return false;
    if (data.status === 'LOCKED') throw new Error("Account Locked.");
    await supabase.from('users').update({ ip_address: realIP, last_online: Date.now() }).eq('id', data.id);
    await updateOnlineStatus(data.id);
    const user = mapUser(data);
    setCurrentUser(user);
    localStorage.setItem('currentUserId', user.id);
    return true;
  };

  const register = async (data: any): Promise<boolean> => {
    const { data: codeData } = await supabase.from('registration_codes').select('*').eq('code', data.inviteCode).eq('status', 'UNUSED').single();
    if (!codeData) throw new Error("Invalid Invite Code");
    let referredBy = null;
    if (data.referralCode) {
        const { data: refUser } = await supabase.from('users').select('id').eq('referral_code', data.referralCode).single();
        if (refUser) referredBy = refUser.id;
    }
    const realIP = await getRealIPAddress();
    const newId = `user-${Date.now()}`;
    const newUser = {
      id: newId, username: data.username, full_name: data.fullName, phone_number: data.phoneNumber, password: data.password, transaction_password: data.password,
      balance: 0, frozen_balance: 0, role: Role.USER, avatar_url: `https://picsum.photos/200?random=${Date.now()}`,
      referral_code: `REF${Math.floor(Math.random() * 10000)}`, referred_by: referredBy, level: 1, orders_completed_today: 0, status: 'ACTIVE', created_at: Date.now(),
      ip_address: realIP, last_online: Date.now(), is_fake: false, device_info: getDeviceInfo()
    };
    const { error } = await supabase.from('users').insert(newUser);
    if (error) throw new Error(error.message);
    await supabase.from('registration_codes').update({ status: 'USED', used_by: newId, used_at: Date.now() }).eq('id', codeData.id);
    return true;
  };

  const logout = () => { localStorage.removeItem('currentUserId'); setCurrentUser(null); };

  const grabOrder = async (): Promise<Order> => {
    if (!currentUser) throw new Error("Not logged in");
    const { data: freshUser } = await supabase.from('users').select('*').eq('id', currentUser.id).single();
    if (!freshUser) throw new Error("Sync error");
    const user = mapUser(freshUser);
    if (user.isOrderFrozen) throw new Error("Account order function frozen.");
    await updateOnlineStatus(user.id);

    const levelConfig = levelConfigs.find(c => c.level === user.level) || levelConfigs[0];
    const limit = user.customDailyOrderLimit ?? levelConfig.dailyOrderLimit ?? systemConfig.dailyOrderLimit;
    const rate = user.customCommissionRate ?? levelConfig.commissionRate ?? systemConfig.commissionRate;
    const minPct = user.customMinBalancePercent ?? levelConfig.minBalancePercent ?? systemConfig.minBalancePercent;
    const maxPct = user.customMaxBalancePercent ?? levelConfig.maxBalancePercent ?? systemConfig.maxBalancePercent;

    if (user.ordersCompletedToday >= limit) throw new Error("Daily limit reached.");
    if (user.balance < 100) throw new Error("Insufficient balance.");

    const idx = user.ordersCompletedToday + 1;
    let rule = user.customSpecificOrders?.find(r => r.orderIndex === idx) || levelConfig.specificOrders?.find(r => r.orderIndex === idx);
    let amount = 0, commission = 0, name = "", img = "";

    if (rule) {
      amount = rule.amount; commission = amount * rule.commissionRate; name = rule.productName || ""; img = rule.productImage || "";
    } else {
      if (products.length > 0) {
          const p = products[Math.floor(Math.random() * products.length)];
          name = p.name; img = p.imageUrl; amount = p.price; commission = parseFloat((amount * rate).toFixed(2));
      } else {
          const pct = minPct + Math.random() * (maxPct - minPct);
          amount = parseFloat((user.balance * pct).toFixed(2));
          if (user.customMaxOrderAmount && amount > user.customMaxOrderAmount) amount = user.customMaxOrderAmount;
          commission = parseFloat((amount * rate).toFixed(2));
          name = PRODUCT_NAMES[Math.floor(Math.random() * PRODUCT_NAMES.length)];
          img = PRODUCT_IMAGES[Math.floor(Math.random() * PRODUCT_IMAGES.length)];
      }
    }

    const newOrder = { id: `ORD-${Date.now()}`, user_id: user.id, product_name: name, product_image: img, amount, commission, status: 'PENDING', timestamp: Date.now() };
    const { error } = await supabase.from('orders').insert(newOrder);
    if (error) throw new Error(error.message);
    return mapOrder(newOrder);
  };

  const confirmOrder = async (orderId: string) => {
    if (!currentUser) return;
    const { data: order } = await supabase.from('orders').select('*').eq('id', orderId).single();
    if (!order || order.status === 'COMPLETED') return;
    if (currentUser.balance < order.amount) throw new Error(TRANSLATIONS[language].high_value_order_contact_cs);

    const newBal = currentUser.balance + order.commission;
    await supabase.from('users').update({ balance: newBal, orders_completed_today: currentUser.ordersCompletedToday + 1 }).eq('id', currentUser.id);
    await supabase.from('orders').update({ status: 'COMPLETED' }).eq('id', orderId);
    await supabase.from('transactions').insert({
        id: `TX-${Date.now()}`, user_id: currentUser.id, type: TransactionType.COMMISSION, amount: order.commission, status: TransactionStatus.COMPLETED, timestamp: Date.now(), details: `Order ${order.product_name}`
    });
  };

  const cancelOrder = async (id: string) => { await supabase.from('orders').delete().eq('id', id); };
  const requestDeposit = async (amount: number, proof: string) => { if (!currentUser) return; await supabase.from('transactions').insert({ id: `DEP-${Date.now()}`, user_id: currentUser.id, type: TransactionType.DEPOSIT, amount, status: TransactionStatus.PENDING, timestamp: Date.now(), details: proof }); };
  const requestWithdraw = async (amount: number, pass: string) => {
    if (!currentUser) return;
    if (pass !== currentUser.transactionPassword) throw new Error("Incorrect Password");
    if (amount > currentUser.balance) throw new Error("Insufficient Balance");
    await supabase.from('users').update({ balance: currentUser.balance - amount, frozen_balance: currentUser.frozenBalance + amount }).eq('id', currentUser.id);
    await supabase.from('transactions').insert({ id: `WID-${Date.now()}`, user_id: currentUser.id, type: TransactionType.WITHDRAW, amount, status: TransactionStatus.PENDING, timestamp: Date.now() });
  };

    const updateProfile = async (data: Partial<User>) => updateUser(currentUser!.id, data);
    const bindBank = async (data: BankInfo) => updateUser(currentUser!.id, { bankInfo: data });
    const updateUser = async (id: string, data: Partial<User>) => {
      const dbData: any = {};
      // map only known fields to snake_case to avoid sending camelCase keys to the DB
      if (data.bankInfo !== undefined) dbData.bank_info = data.bankInfo;
      if (data.fullName !== undefined) dbData.full_name = data.fullName;
      if (data.phoneNumber !== undefined) dbData.phone_number = data.phoneNumber;
      if (data.password !== undefined) dbData.password = data.password;
      if (data.transactionPassword !== undefined) dbData.transaction_password = data.transactionPassword;
      if (data.balance !== undefined) dbData.balance = data.balance;
      if (data.frozenBalance !== undefined) dbData.frozen_balance = data.frozenBalance;
      if (data.role !== undefined) dbData.role = data.role;
      if (data.avatarUrl !== undefined) dbData.avatar_url = data.avatarUrl;
      if (data.referralCode !== undefined) dbData.referral_code = data.referralCode;
      if (data.referredBy !== undefined) dbData.referred_by = data.referredBy;
      if (data.level !== undefined) dbData.level = data.level;
      if (data.ordersCompletedToday !== undefined) dbData.orders_completed_today = data.ordersCompletedToday;
      if (data.address !== undefined) dbData.address = data.address;
      if (data.status !== undefined) dbData.status = data.status;
      if (data.ipAddress !== undefined) dbData.ip_address = data.ipAddress;
      if (data.lastOnline !== undefined) dbData.last_online = data.lastOnline;
      if (data.isFake !== undefined) dbData.is_fake = data.isFake;
      if (data.deviceInfo !== undefined) dbData.device_info = data.deviceInfo;
      if (data.customDailyOrderLimit !== undefined) dbData.custom_daily_order_limit = data.customDailyOrderLimit;
      if (data.customCommissionRate !== undefined) dbData.custom_commission_rate = data.customCommissionRate;
      if (data.customMinBalancePercent !== undefined) dbData.custom_min_balance_percent = data.customMinBalancePercent;
      if (data.customMaxBalancePercent !== undefined) dbData.custom_max_balance_percent = data.customMaxBalancePercent;
      if (data.customMaxOrderAmount !== undefined) dbData.custom_max_order_amount = data.customMaxOrderAmount;
      if (data.customSpecificOrders !== undefined) dbData.custom_specific_orders = data.customSpecificOrders;
      if (data.isOrderFrozen !== undefined) dbData.is_order_frozen = data.isOrderFrozen;
      if (data.customOrderLoadingTime !== undefined) dbData.custom_order_loading_time = data.customOrderLoadingTime;

      // if nothing to update, return early
      if (Object.keys(dbData).length === 0) return;

        await supabase.from('users').update(dbData).eq('id', id);
        // try to fetch the updated row and update local state immediately (fallback if realtime doesn't fire)
        try {
          const { data: refreshed } = await supabase.from('users').select('*').eq('id', id).single();
          if (refreshed) {
            const mapped = mapUser(refreshed);
            setUsers(prev => prev.map(u => u.id === mapped.id ? mapped : u));
            if (currentUser && currentUser.id === mapped.id) setCurrentUser(mapped);
          }
        } catch (e) { /* ignore fetch errors */ }
    };
  const toggleUserType = async (id: string) => { const u = users.find(x => x.id === id); if(u) await supabase.from('users').update({ is_fake: !u.isFake }).eq('id', id); };
  const resetUserDailyOrders = async (id: string) => { await supabase.from('users').update({ orders_completed_today: 0 }).eq('id', id); };
  const approveTransaction = async (id: string) => {
      const { data: tx } = await supabase.from('transactions').select('*').eq('id', id).single();
      const { data: user } = await supabase.from('users').select('*').eq('id', tx.user_id).single();
      if (tx.type === 'DEPOSIT') await supabase.from('users').update({ balance: user.balance + tx.amount }).eq('id', user.id);
      else if (tx.type === 'WITHDRAW') await supabase.from('users').update({ frozen_balance: user.frozen_balance - tx.amount }).eq('id', user.id);
      await supabase.from('transactions').update({ status: 'APPROVED' }).eq('id', id);
  };
  const rejectTransaction = async (id: string) => {
      const { data: tx } = await supabase.from('transactions').select('*').eq('id', id).single();
      const { data: user } = await supabase.from('users').select('*').eq('id', tx.user_id).single();
      if (tx.type === 'WITHDRAW') await supabase.from('users').update({ balance: user.balance + tx.amount, frozen_balance: user.frozen_balance - tx.amount }).eq('id', user.id);
      await supabase.from('transactions').update({ status: 'REJECTED' }).eq('id', id);
  };
  const createTransaction = async (d: any) => { await supabase.from('transactions').insert({ id: `TX-${Date.now()}`, user_id: d.userId, type: d.type, amount: d.amount, status: d.status, timestamp: Date.now(), details: d.details }); };
  const deleteTransaction = async (id: string) => { await supabase.from('transactions').delete().eq('id', id); };
  const generateReferralCode = () => `REF${Date.now()}`;
  const updateSystemConfig = (c: SystemConfig) => setSystemConfig(c);
  const updateLevelConfig = (c: LevelConfig) => setLevelConfigs(p => p.map(l => l.level === c.level ? c : l));
  const addLevelConfig = (c: LevelConfig) => setLevelConfigs(p => [...p, c]);
  const deleteLevelConfig = (l: number) => setLevelConfigs(p => p.filter(x => x.level !== l));
  const createRegistrationCode = async () => { 
    const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
    await supabase.from('registration_codes').insert({ id: `RC-${Date.now()}`, code: randomCode, status: 'UNUSED', created_at: Date.now() }); 
  };
  const expireRegistrationCode = async (id: string) => { await supabase.from('registration_codes').update({ status: 'EXPIRED' }).eq('id', id); };
  const deleteRegistrationCode = async (id: string) => { await supabase.from('registration_codes').delete().eq('id', id); };
  const updateAppContent = async (c: AppContent) => { 
      setAppContentState(c);
      const dbData = {
          banner_url: c.bannerUrl, marquee_text: c.marqueeText, event_title: c.eventTitle,
        popup_enabled: c.popupEnabled, popup_title: c.popupTitle, popup_message: c.popupMessage, popup_image_url: c.popupImageUrl,
        popup_title_color: c.popupTitleColor, popup_title_size: c.popupTitleSize, popup_title_font_family: c.popupTitleFontFamily, popup_title_font_weight: c.popupTitleFontWeight,
        popup_text_color: c.popupTextColor, popup_text_size: c.popupTextSize, popup_text_font_family: c.popupTextFontFamily, popup_text_font_weight: c.popupTextFontWeight,
          intro_text: c.introText, welcome_text: c.welcomeText, intro_image_url: c.introImageUrl,
          text_color: c.textColor, text_size: c.textSize, text_font_family: c.textFontFamily, text_font_weight: c.textFontWeight, cs_link: c.csLink,
          start_page_image: c.startPageImage, start_page_text: c.startPageText, start_page_text_color: c.startPageTextColor, start_page_text_size: c.startPageTextSize, start_page_font_family: c.startPageFontFamily, start_page_font_weight: c.startPageFontWeight,
          additional_content: c.additionalContent, slides: c.slides, logo_url: c.logoUrl,
          getting_started_image: c.gettingStartedImage, getting_started_text: c.gettingStartedText,
          grab_page_image: c.grabPageImage, grab_page_text: c.grabPageText, grab_page_text_color: c.grabPageTextColor, grab_page_text_size: c.grabPageTextSize, grab_page_font_family: c.grabPageFontFamily, grab_page_font_weight: c.grabPageFontWeight,
          auth_bg_image: c.authBgImage, auth_title: c.authTitle, auth_subtitle: c.authSubtitle, auth_primary_color: c.authPrimaryColor, auth_title_color: c.authTitleColor, auth_title_size: c.authTitleSize, auth_title_font_family: c.authTitleFontFamily, auth_title_font_weight: c.authTitleFontWeight
      };
      try {
        const { data: upserted, error } = await supabase.from('app_content').upsert({ id: 'default', ...dbData }, { returning: 'representation' });
        if (error) {
          // eslint-disable-next-line no-console
          console.error('[AppContext] updateAppContent error:', error);
          setAdminNotification({ message: `Failed to save content: ${error.message || error}`, type: 'alert', timestamp: Date.now() });
        } else {
          // eslint-disable-next-line no-console
          console.log('[AppContext] updateAppContent upserted:', upserted || dbData);
        }
      } catch (e: any) {
        // eslint-disable-next-line no-console
        console.error('[AppContext] updateAppContent exception:', e);
        setAdminNotification({ message: `Failed to save content: ${e?.message || e}`, type: 'alert', timestamp: Date.now() });
      }
  };
  const addProduct = async (p: any) => { await supabase.from('products').insert({ id: `P-${Date.now()}`, name: p.name, image_url: p.imageUrl, price: p.price, created_at: Date.now() }); };
  const updateProduct = async (p: any) => { await supabase.from('products').update({ name: p.name, image_url: p.imageUrl, price: p.price }).eq('id', p.id); };
  const deleteProduct = async (id: string) => { await supabase.from('products').delete().eq('id', id); };
  const generateMockProducts = async () => {}; 
  const clearAdminNotification = () => setAdminNotification(null);

  return (
    <AppContext.Provider value={{
      currentUser, users, orders, transactions, products, theme, language, currency, systemConfig, levelConfigs, registrationCodes, isLoading, adminNotification, appContent,
      clearAdminNotification, login, register, logout, setTheme, setLanguage, setCurrency, formatPrice, grabOrder, confirmOrder, cancelOrder, requestDeposit, requestWithdraw, updateProfile, bindBank,
      updateUser, toggleUserType, resetUserDailyOrders, approveTransaction, rejectTransaction, createTransaction, deleteTransaction, generateReferralCode, updateSystemConfig, updateLevelConfig, addLevelConfig, deleteLevelConfig, createRegistrationCode, expireRegistrationCode, deleteRegistrationCode, updateAppContent, addProduct, updateProduct, deleteProduct, generateMockProducts
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};
