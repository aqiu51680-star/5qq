
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { TRANSLATIONS } from '../../constants';
import { Bell, CreditCard, Wallet, ChevronRight, Copy, Shield, Settings as SettingsIcon, LogOut, CheckCircle, Smartphone, User, Lock, ArrowUpCircle, ArrowDownCircle, Globe, Clock, AlertCircle, MapPin, FileText, ChevronLeft, Save, Eye, EyeOff, HelpCircle, Key, ArrowDown, ArrowUp, Calendar, Filter, X, DollarSign, Package, TrendingUp, MessageCircle, PlayCircle, History as HistoryIcon, List } from 'lucide-react';

export const UserHome: React.FC = () => {
    const { currentUser, levelConfigs, systemConfig, appContent, formatPrice } = useApp();
    const language = 'vi';
    const t = TRANSLATIONS[language];
  const [showPopup, setShowPopup] = useState(appContent.popupEnabled);
// --- BẮT ĐẦU ĐOẠN MÃ CẦN THÊM ---
// Lắng nghe thay đổi từ Admin để cập nhật Popup ngay lập tức
useEffect(() => {
    if (appContent.popupEnabled) {
        setShowPopup(true);
    } else {
        setShowPopup(false);
    }
}, [appContent.popupEnabled, appContent.popupTitle, appContent.popupMessage]);
// --- KẾT THÚC ĐOẠN MÃ CẦN THÊM ---
  // Close popup logic
  const handleClosePopup = () => setShowPopup(false);

  // Update popup visibility when content changes (or on mount if enabled)
  useEffect(() => {
      setShowPopup(appContent.popupEnabled);
  }, [appContent.popupEnabled]);

  const currentLevelConfig = levelConfigs.find(c => c.level === currentUser?.level);
  const effectiveRate = currentUser?.customCommissionRate ?? currentLevelConfig?.commissionRate ?? systemConfig.commissionRate;
    const goiName = currentLevelConfig?.name || `Gói ${currentUser?.level}`;

  // Helper for dynamic text size
  const getDynamicFontSize = (sizeClass: string) => {
      if (!sizeClass) return '1rem';
      // Accept both 'text-base' and legacy 'base' tokens
      let token = sizeClass.toString();
      if (token.startsWith('text-')) token = token.slice(5);
      switch(token) {
          case 'sm': return '0.875rem';
          case 'lg': return '1.125rem';
          case 'xl': return '1.5rem';
          case '5xl': return '3rem';
          case 'base':
          default: return '1rem';
      }
  };

  return (
    <div className="pb-20">
      {/* Home Popup */}
      {showPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
              <div className="bg-white dark:bg-gray-800 w-full max-w-sm rounded-2xl shadow-2xl p-6 relative animate-scale-in">
                  <button onClick={handleClosePopup} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-white">
                      <X size={24} />
                  </button>
                  <div className="text-center">
                      <h3 className="mb-2" style={{ color: appContent.popupTitleColor || '#1e3a8a', fontSize: getDynamicFontSize(appContent.popupTitleSize || 'text-xl'), fontFamily: appContent.popupTitleFontFamily, fontWeight: appContent.popupTitleFontWeight }}>{appContent.popupTitle || "Notification"}</h3>
                      {appContent.popupImageUrl && (
                          <div className="mb-4 rounded-lg overflow-hidden border">
                              <img src={appContent.popupImageUrl} alt="Popup" className="w-full h-auto object-cover" />
                          </div>
                      )}
                      {!appContent.popupImageUrl && <div className="w-16 h-1 bg-blue-500 mx-auto rounded-full mb-4"></div>}
                      <p className="whitespace-pre-wrap" style={{ color: appContent.popupTextColor || '#374151', fontSize: getDynamicFontSize(appContent.popupTextSize || 'text-base'), fontFamily: appContent.popupTextFontFamily, fontWeight: appContent.popupTextFontWeight }}>{appContent.popupMessage}</p>
                      <button onClick={handleClosePopup} className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700">OK</button>
                  </div>
              </div>
          </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white rounded-b-3xl shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Wallet size={120} />
        </div>
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="mb-1 font-medium" style={{ 
                  color: appContent.textColor, 
                  fontSize: getDynamicFontSize(appContent.textSize) 
              }}>
                  {appContent.welcomeText}
              </p>
              <h2 className="text-2xl font-bold">{currentUser?.username}</h2>
            </div>
            <Bell className="text-white" />
          </div>
          
          <div className="bg-white/20 backdrop-blur-md rounded-xl p-4 border border-white/30">
            <p className="text-blue-100 text-xs uppercase tracking-wider mb-1">{t.total_assets}</p>
            <h3 className="text-3xl font-bold text-white">
              {formatPrice(currentUser?.balance || 0)}
            </h3>
            <div className="mt-2 flex items-center space-x-2 text-xs text-blue-100">
              <span className="px-2 py-0.5 bg-green-500/20 rounded text-green-300">+{effectiveRate * 100}% Com.</span>
              <span>Gói {currentUser?.level} ({goiName})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Marquee */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 px-4 py-2 flex items-center space-x-3 overflow-hidden">
        <Bell size={16} className="text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
        <div className="whitespace-nowrap animate-[marquee_10s_linear_infinite] text-sm text-yellow-800 dark:text-yellow-200">
          {appContent.marqueeText}
        </div>
      </div>

      {/* Banner */}
      <div className="p-4">
        <div className="w-full h-40 bg-gray-200 rounded-xl overflow-hidden relative group shadow-md">
           <img src={appContent.bannerUrl} alt="Banner" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
           <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
             <p className="text-white font-bold text-lg">{appContent.eventTitle}</p>
           </div>
        </div>
      </div>

      {/* Intro Section with Image and Text */}
      <div className="px-4 mb-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
              <h4 className="font-bold text-gray-800 dark:text-white mb-2 flex items-center text-sm">
                  <Shield size={16} className="mr-2 text-blue-500" /> CEVA LOGISTICS VIETNAM
              </h4>
              {appContent.introImageUrl && (
                  <div className="mb-3 rounded-lg overflow-hidden">
                      <img src={appContent.introImageUrl} alt="Introduction" className="w-full h-auto object-cover" />
                  </div>
              )}
              <p className="text-gray-500 dark:text-gray-400 leading-relaxed whitespace-pre-wrap" style={{ 
                  color: appContent.textColor,
                  fontSize: getDynamicFontSize(appContent.textSize),
                  fontFamily: appContent.textFontFamily,
                  fontWeight: appContent.textFontWeight
              }}>
                  {appContent.introText}
              </p>
          </div>
      </div>
    </div>
  );
};

export const GrabOrder: React.FC = () => {
    const { grabOrder, confirmOrder, cancelOrder, currentUser, levelConfigs, systemConfig, formatPrice, appContent, orders } = useApp();
    const language = 'vi';
    const t = TRANSLATIONS[language];
  const [isProcessing, setIsProcessing] = useState(false);
  const [modalStage, setModalStage] = useState<'IDLE' | 'MATCHING' | 'FOUND' | 'SUBMITTING' | 'SUCCESS'>('IDLE');
  const [currentOrder, setCurrentOrder] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const currentLevelConfig = levelConfigs.find(c => c.level === currentUser?.level);

  // Determine Content to show (Level override vs Global)
  const displayImage = currentLevelConfig?.startPageImage || appContent.startPageImage;
  const displayText = currentLevelConfig?.startPageText || appContent.startPageText;
  const displayTextColor = appContent.startPageTextColor || appContent.grabPageTextColor;
  const displayTextSize = appContent.startPageTextSize || appContent.grabPageTextSize || 'text-base';

  const getDynamicFontSize = (sizeClass: string) => {
      switch(sizeClass) { case 'text-sm': return '0.875rem'; case 'text-lg': return '1.125rem'; case 'text-xl': return '1.5rem'; default: return '1rem'; }
  };

  // Calculate stats
  const todayOrdersCount = currentUser?.ordersCompletedToday || 0;
  const currentBalance = currentUser?.balance || 0;
  // Calculate commission earned today
  const myTodayOrders = orders.filter(o => o.userId === currentUser?.id && new Date(o.timestamp).setHours(0,0,0,0) === new Date().setHours(0,0,0,0));
  const todayCommission = myTodayOrders.reduce((acc, curr) => acc + curr.commission, 0);
  const totalCompletedOrders = currentUser?.level * 50 + todayOrdersCount; // Mock total for demo

  const handleStartGrab = async () => {
    setErrorMsg('');
    setIsProcessing(true);
    setModalStage('MATCHING');
    try {
      setTimeout(async () => {
        try {
          const order = await grabOrder();
          setCurrentOrder(order);
          setModalStage('FOUND');
        } catch (e: any) {
          setErrorMsg(e.message);
          setModalStage('IDLE');
          setIsProcessing(false);
        }
      }, 2000);
    } catch (err: any) {
        setErrorMsg(err.message);
        setModalStage('IDLE');
        setIsProcessing(false);
    }
  };

  const handleSubmitOrder = () => {
    setModalStage('SUBMITTING');
    setTimeout(async () => {
      try {
        await confirmOrder(currentOrder.id);
        setModalStage('SUCCESS');
        setTimeout(() => {
          setModalStage('IDLE');
          setIsProcessing(false);
          setCurrentOrder(null);
        }, 2000); // Auto close after success message
      } catch (err: any) {
        alert(err.message);
        setModalStage('FOUND');
      }
    }, 3000); // Wait 3 seconds
  };

  const handleCancelOrder = async () => {
    if (currentOrder) {
        await cancelOrder(currentOrder.id);
        setModalStage('IDLE');
        setIsProcessing(false);
        setCurrentOrder(null);
    }
  };

  return (
    <div className="h-full flex flex-col p-4 relative bg-gray-50 dark:bg-gray-900 min-h-screen pb-24">
       <h1 className="text-2xl font-bold mb-4 dark:text-white">{t.grab_order}</h1>
       
       {/* Dashboard Overview - Quantity, Balance, Discount, Completed */}
       <div className="grid grid-cols-2 gap-4 mb-6 animate-scale-in">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border-l-4 border-blue-500">
             <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase">{t.quantity}</p>
             <div className="flex items-center mt-1">
                <Package size={18} className="text-blue-500 mr-2" />
                <p className="text-xl font-bold text-gray-800 dark:text-white">{todayOrdersCount}</p>
             </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border-l-4 border-green-500">
             <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase">{t.balance}</p>
             <div className="flex items-center mt-1">
                <Wallet size={18} className="text-green-500 mr-2" />
                <p className="text-lg font-bold text-gray-800 dark:text-white">{formatPrice(currentBalance)}</p>
             </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border-l-4 border-gold-500">
             <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase">{t.discount_amount}</p>
             <div className="flex items-center mt-1">
                <DollarSign size={18} className="text-gold-500 mr-2" />
                <p className="text-lg font-bold text-gray-800 dark:text-white">{formatPrice(todayCommission)}</p>
             </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border-l-4 border-purple-500">
             <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase">{t.completed}</p>
             <div className="flex items-center mt-1">
                <CheckCircle size={18} className="text-purple-500 mr-2" />
                <p className="text-xl font-bold text-gray-800 dark:text-white">{totalCompletedOrders}</p>
             </div>
          </div>
       </div>

       {/* Customizable Content Area (Image & Text) */}
       <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm mb-6 border border-gray-100 dark:border-gray-700 animate-fade-in">
          {displayImage && (
              <div className="w-full h-40 rounded-lg overflow-hidden mb-4 shadow-md">
                  <img src={displayImage} alt="Start Content" className="w-full h-full object-cover" />
              </div>
          )}
          {displayText && (
              <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap text-center" style={{ color: displayTextColor, fontSize: getDynamicFontSize(displayTextSize), fontFamily: appContent.startPageFontFamily || appContent.grabPageFontFamily, fontWeight: appContent.startPageFontWeight || appContent.grabPageFontWeight }}>
                  {displayText}
              </p>
          )}
       </div>

       {/* Start Button */}
       <div className="flex-1 flex flex-col items-center justify-center py-4">
          <button 
            onClick={handleStartGrab} 
            disabled={isProcessing}
            className={`w-32 h-32 rounded-full shadow-2xl flex items-center justify-center text-white transform transition-all active:scale-95 border-4 border-white/20 ${isProcessing ? 'bg-gray-400 cursor-not-allowed animate-none' : 'bg-gradient-to-br from-gold-400 to-gold-600 hover:scale-110 hover:shadow-gold-500/50 animate-bounce-slight animate-fade-in'}`}
          >
             {isProcessing ? (
                 <div className="flex flex-col items-center animate-pulse">
                     <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin mb-2"></div>
                     <span className="text-xs font-bold animate-pulse">{t.processing}</span>
                 </div>
             ) : (
                 <div className="flex flex-col items-center animate-scale-in">
                     <PlayCircle size={48} strokeWidth={2} className="mb-1 animate-bounce-slight" />
                     <span className="text-sm font-bold uppercase tracking-widest animate-fade-in">{t.start}</span>
                 </div>
             )}
          </button>
          {errorMsg && <p className="text-red-500 text-sm font-medium mt-4 bg-red-100 px-4 py-2 rounded-full shadow animate-pulse">{errorMsg}</p>}
       </div>

       {/* Modal */}
       {modalStage !== 'IDLE' && (
         <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-md animate-fade-in">
            <div className="bg-white dark:bg-gray-800 w-full max-w-sm rounded-3xl p-6 shadow-2xl transform transition-all scale-100 animate-scale-in relative overflow-hidden border border-white/10">
               {/* Decorative Background */}
               <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-500/10 to-transparent"></div>

               {modalStage === 'MATCHING' && (
                      <div className="text-center py-12 animate-fade-in">
                         <div className="relative w-24 h-24 mx-auto mb-6">
                             <div className="absolute inset-0 border-4 border-blue-200 rounded-full animate-ping opacity-75"></div>
                             <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                             <SearchIcon className="absolute inset-0 m-auto text-blue-600 animate-bounce-slight" size={32} />
                         </div>
                         <h3 className="text-xl font-bold animate-pulse dark:text-white mb-2">{t.matching}</h3>
                         <p className="text-sm text-gray-500 animate-pulse">{t.waiting_system}</p>
                      </div>
               )}

               {modalStage === 'FOUND' && currentOrder && (
                      <div className="space-y-5 relative z-10 animate-fade-in">
                         <div className="text-center animate-scale-in">
                            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-1 animate-bounce-slight">{t.matched}</h3>
                            <p className="text-xs text-gray-400 font-mono tracking-wider bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded inline-block animate-fade-in">{currentOrder.id}</p>
                         </div>
                   
                         <div className="bg-white dark:bg-gray-700 p-4 rounded-2xl border border-gray-100 dark:border-gray-600 shadow-sm animate-scale-in">
                             <div className="w-full h-48 bg-white rounded-xl overflow-hidden mb-4 shadow-inner flex items-center justify-center p-2 animate-fade-in">
                                  <img src={currentOrder.productImage} className="max-w-full max-h-full object-contain animate-scale-in" alt="Product" />
                             </div>
                             <h4 className="font-bold text-gray-800 dark:text-white text-center mb-4 line-clamp-2 h-10 px-2 animate-fade-in">{currentOrder.productName}</h4>
                      
                             <div className="space-y-3 text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded-xl animate-fade-in">
                                 <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-600 pb-2">
                                     <span className="text-gray-500">{t.amount}</span>
                                     <span className="font-bold text-lg dark:text-white">{formatPrice(currentOrder.amount || 0)}</span>
                                 </div>
                                 <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-600 pb-2">
                                     <span className="text-gray-500">{t.quantity}</span>
                                     <span className="font-bold dark:text-white">x1</span>
                                 </div>
                                 <div className="flex justify-between items-center">
                                     <span className="text-gray-500">{t.commission}</span>
                                     <span className="font-bold text-xl text-green-500 animate-bounce-slight">+{formatPrice(currentOrder.commission || 0)}</span>
                                 </div>
                             </div>
                         </div>

                         <div className="grid grid-cols-2 gap-3 mt-2">
                             <button onClick={handleCancelOrder} className="w-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 py-3.5 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors animate-fade-in">{t.cancel}</button>
                             <button onClick={handleSubmitOrder} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:scale-[1.02] transition-transform flex items-center justify-center animate-bounce-slight animate-fade-in">
                                  {t.confirm_delivery}
                             </button>
                         </div>
                      </div>
               )}

               {modalStage === 'SUBMITTING' && (
                  <div className="space-y-6 py-12 text-center animate-fade-in">
                    <div className="w-24 h-24 mx-auto relative animate-pulse">
                       <div className="absolute inset-0 rounded-full border-4 border-blue-100 animate-ping"></div>
                       <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
                       <div className="absolute inset-0 flex items-center justify-center animate-fade-in">
                           <span className="text-xs font-bold text-blue-600 animate-pulse">{t.processing}</span>
                       </div>
                    </div>
                    <div>
                        <h3 className="font-bold text-xl dark:text-white mb-2 animate-fade-in">{t.submit_order}</h3>
                        <p className="text-sm text-gray-500 animate-pulse">{t.waiting_system}</p>
                    </div>
                  </div>
               )}

               {modalStage === 'SUCCESS' && (
                                 <div className="text-center py-12 animate-scale-in animate-fade-in">
                                     <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-200 animate-bounce-slight animate-fade-in">
                                             <CheckCircle size={48} className="text-green-500 animate-bounce-slight animate-scale-in" />
                                     </div>
                                     <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2 animate-fade-in">{t.success}</h2>
                                     <p className="text-green-600 font-medium bg-green-50 inline-block px-4 py-1 rounded-full animate-fade-in animate-bounce-slight">{t.success_msg}</p>
                                 </div>
               )}
            </div>
         </div>
       )}
    </div>
  );
};

const PlusIcon = ({ size, strokeWidth }: any) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
);

const SearchIcon = ({ size, className }: any) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
);

export const HelpPage: React.FC = () => {
    const { language, appContent } = useApp();
    const t = TRANSLATIONS[language];
    const navigate = useNavigate();
    
    const handleContactCS = () => {
        if (appContent.csLink) {
            window.open(appContent.csLink, '_blank');
        } else {
            alert("Customer service link not configured.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
            <div className="flex items-center mb-6">
                <button onClick={() => navigate(-1)} className="mr-4 dark:text-white"><ChevronLeft /></button>
                <h1 className="text-xl font-bold dark:text-white">{t.help}</h1>
            </div>
            
            {/* Customer Service Contact Button */}
            <div className="mb-6">
                <button 
                    onClick={handleContactCS}
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-4 rounded-xl shadow-lg flex items-center justify-between hover:scale-[1.02] transition-transform"
                >
                    <div className="flex items-center space-x-3">
                        <div className="bg-white/20 p-2 rounded-full">
                            <MessageCircle size={24} />
                        </div>
                        <div className="text-left">
                            <h3 className="font-bold text-lg">Customer Service</h3>
                            <p className="text-xs text-blue-100">24/7 Support Center</p>
                        </div>
                    </div>
                    <ChevronRight className="text-white/80" />
                </button>
            </div>

            <div className="space-y-4">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                        <h3 className="font-bold mb-2 dark:text-white flex items-center text-sm">
                            <HelpCircle size={16} className="mr-2 text-blue-500"/>
                            Question {i}?
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const HistoryPage: React.FC = () => {
  const { orders, currentUser, formatPrice, language } = useApp();
  const t = TRANSLATIONS[language];
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'COMPLETED'>('ALL');
  
  const filteredOrders = orders.filter(o => {
    if (o.userId !== currentUser?.id) return false;
    if (filter !== 'ALL' && o.status !== filter) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 p-4">
      <h1 className="text-2xl font-bold mb-4 dark:text-white">{t.history}</h1>
      <div className="flex space-x-2 mb-4">
        {['ALL', 'PENDING', 'COMPLETED'].map(status => (
          <button 
            key={status}
            onClick={() => setFilter(status as any)}
            className={`px-4 py-2 rounded-lg text-sm font-bold ${filter === status ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-500'}`}
          >
            {status}
          </button>
        ))}
      </div>
      
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-10 text-gray-500">{t.no_orders}</div>
        ) : (
          filteredOrders.map(order => (
            <div key={order.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex space-x-4">
                <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={order.productImage} alt="Product" className="w-full h-full object-contain" />
                </div>
                <div className="flex-1">
                   <div className="flex justify-between items-start">
                      <h4 className="font-bold text-gray-800 dark:text-white line-clamp-1">{order.productName}</h4>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${order.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {order.status}
                      </span>
                   </div>
                   <p className="text-xs text-gray-400 mt-1">{new Date(order.timestamp).toLocaleString()}</p>
                   <div className="flex justify-between items-end mt-2">
                      <div>
                        <p className="text-xs text-gray-500">{t.amount}: {formatPrice(order.amount)}</p>
                        <p className="text-xs text-gray-500">{t.commission}: <span className="text-green-500 font-bold">+{formatPrice(order.commission)}</span></p>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export const UserTransactionsPage: React.FC = () => {
    const { transactions, currentUser, formatPrice, language } = useApp();
    const t = TRANSLATIONS[language];
    const navigate = useNavigate();

    const myTransactions = transactions.filter(t => t.userId === currentUser?.id);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 p-4">
            <div className="flex items-center mb-6">
                <button onClick={() => navigate(-1)} className="mr-4 dark:text-white"><ChevronLeft /></button>
                <h1 className="text-xl font-bold dark:text-white">{t.transactions}</h1>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 dark:bg-gray-700 text-gray-500 font-medium uppercase">
                        <tr>
                            <th className="px-4 py-3">Type</th>
                            <th className="px-4 py-3">Amount</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Time</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {myTransactions.map(tx => (
                            <tr key={tx.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                                <td className="px-4 py-3">
                                    <span className={`text-xs font-bold px-2 py-1 rounded ${
                                        tx.type === 'DEPOSIT' ? 'bg-green-100 text-green-700' : 
                                        tx.type === 'WITHDRAW' ? 'bg-red-100 text-red-700' : 
                                        'bg-blue-100 text-blue-700'
                                    }`}>
                                        {tx.type}
                                    </span>
                                </td>
                                <td className="px-4 py-3 font-bold dark:text-white">
                                    {formatPrice(tx.amount)}
                                </td>
                                <td className="px-4 py-3">
                                    <span className={`text-[10px] font-bold ${tx.status === 'PENDING' ? 'text-yellow-600' : tx.status === 'COMPLETED' || tx.status === 'APPROVED' ? 'text-green-600' : 'text-red-600'}`}>
                                        {tx.status}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-xs text-gray-400">
                                    {new Date(tx.timestamp).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export const UserProfile: React.FC = () => {
    const { currentUser, logout, language, setTheme, theme, setLanguage, formatPrice } = useApp();
    const t = TRANSLATIONS[language];
    const navigate = useNavigate();

    if (!currentUser) return null;

    const MenuItem = ({ icon: Icon, label, path, color = 'text-gray-600', subLabel }: any) => (
        <button onClick={() => navigate(path)} className="flex items-center justify-between w-full p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-3 active:scale-98 transition-transform">
            <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full bg-gray-50 dark:bg-gray-700 ${color}`}>
                    <Icon size={20} />
                </div>
                <div className="text-left">
                    <p className="font-bold text-gray-800 dark:text-white">{label}</p>
                    {subLabel && <p className="text-xs text-gray-400">{subLabel}</p>}
                </div>
            </div>
            <ChevronRight className="text-gray-300" size={20} />
        </button>
    );

    return (
        <div className="pb-24 p-4 min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    {currentUser.username.charAt(0).toUpperCase()}
                </div>
                <div>
                    <h2 className="text-xl font-bold dark:text-white">{currentUser.username}</h2>
                    <p className="text-gray-500 text-sm">{currentUser.phoneNumber}</p>
                    <div className="flex items-center mt-1 space-x-2">
                       <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full font-bold">Level {currentUser.level}</span>
                       <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${currentUser.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{currentUser.status}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-xl text-white shadow-lg">
                    <p className="text-blue-100 text-xs font-bold uppercase mb-1">{t.balance}</p>
                    <h3 className="text-xl font-bold">{formatPrice(currentUser.balance)}</h3>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-xl text-white shadow-lg">
                    <p className="text-purple-100 text-xs font-bold uppercase mb-1">Frozen</p>
                    <h3 className="text-xl font-bold">{formatPrice(currentUser.frozenBalance)}</h3>
                </div>
            </div>

            <div className="mb-6">
                <h3 className="text-sm font-bold text-gray-500 uppercase mb-3 ml-1">Wallet Services</h3>
                <div className="grid grid-cols-2 gap-3">
                   <button onClick={() => navigate('/user/wallet/deposit')} className="bg-white dark:bg-gray-800 p-4 rounded-xl flex flex-col items-center justify-center shadow-sm border border-gray-100 dark:border-gray-700 hover:border-blue-200">
                       <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-2"><ArrowDown size={20} /></div>
                       <span className="font-bold text-sm dark:text-white">{t.deposit}</span>
                   </button>
                   <button onClick={() => navigate('/user/wallet/withdraw')} className="bg-white dark:bg-gray-800 p-4 rounded-xl flex flex-col items-center justify-center shadow-sm border border-gray-100 dark:border-gray-700 hover:border-blue-200">
                       <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-2"><ArrowUp size={20} /></div>
                       <span className="font-bold text-sm dark:text-white">{t.withdraw}</span>
                   </button>
                </div>
            </div>

            <div className="space-y-1">
                <MenuItem icon={User} label={t.personal_info} path="/user/info" subLabel={t.edit_info_sub} color="text-blue-500" />
                <MenuItem icon={CreditCard} label={t.bank_card} path="/user/bank" subLabel={currentUser.bankInfo?.accountNumber ? t.linked : t.not_linked} color="text-green-500" />
                <MenuItem icon={List} label={t.transactions} path="/user/transactions" color="text-purple-500" />
                <MenuItem icon={Shield} label={t.security_center} path="/user/security" subLabel={t.password_sub} color="text-orange-500" />
            </div>

            <div className="mt-6 space-y-3">
                <div className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                    <span className="font-bold text-gray-700 dark:text-white flex items-center"><Globe size={18} className="mr-2"/> {t.language}</span>
                    <div className="flex space-x-2">
                        {(['en', 'vi', 'zh'] as const).map(l => (
                            <button key={l} onClick={() => setLanguage(l)} className={`px-3 py-1 rounded text-xs font-bold uppercase ${language === l ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'}`}>{l}</button>
                        ))}
                    </div>
                </div>
                <button onClick={logout} className="w-full py-4 bg-red-50 text-red-600 font-bold rounded-xl flex items-center justify-center hover:bg-red-100 transition-colors">
                    <LogOut size={20} className="mr-2" /> {t.logout}
                </button>
            </div>
        </div>
    );
};

export const WalletPage: React.FC = () => {
    const { type } = useParams<{ type: string }>();
    const { currentUser, requestDeposit, requestWithdraw, formatPrice, language } = useApp();
    const t = TRANSLATIONS[language];
    const navigate = useNavigate();
    const [amount, setAmount] = useState('');
    const [proofOrPass, setProofOrPass] = useState('');
    const [loading, setLoading] = useState(false);

    const isDeposit = type === 'deposit';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isDeposit) {
                await requestDeposit(Number(amount), proofOrPass);
                alert("Deposit request submitted");
            } else {
                await requestWithdraw(Number(amount), proofOrPass);
                alert("Withdrawal request submitted");
            }
            navigate('/user/history');
        } catch (err: any) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
            <div className="flex items-center mb-6">
                <button onClick={() => navigate(-1)} className="mr-4 dark:text-white"><ChevronLeft /></button>
                <h1 className="text-xl font-bold dark:text-white capitalize">{isDeposit ? t.deposit : t.withdraw}</h1>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm mb-6">
                <p className="text-gray-500 text-sm mb-1">{t.balance}</p>
                <h2 className="text-3xl font-bold dark:text-white">{formatPrice(currentUser?.balance || 0)}</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{t.amount}</label>
                    <div className="relative">
                        <input 
                            type="number" 
                            className="w-full p-4 pl-10 bg-white dark:bg-gray-800 border-none rounded-xl shadow-sm text-lg font-bold dark:text-white outline-none ring-1 ring-gray-200 dark:ring-gray-700 focus:ring-blue-500"
                            placeholder="0.00"
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                            required
                        />
                        <span className="absolute left-4 top-4.5 text-gray-400 font-bold">$</span>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                        {isDeposit ? "Transaction Hash / Proof" : "Transaction Password"}
                    </label>
                    <input 
                        type={isDeposit ? "text" : "password"} 
                        className="w-full p-4 bg-white dark:bg-gray-800 border-none rounded-xl shadow-sm dark:text-white outline-none ring-1 ring-gray-200 dark:ring-gray-700 focus:ring-blue-500"
                        placeholder={isDeposit ? "Enter proof..." : "Enter 6-digit pin"}
                        value={proofOrPass}
                        onChange={e => setProofOrPass(e.target.value)}
                        required
                    />
                </div>

                <button 
                    disabled={loading}
                    className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-colors disabled:opacity-50 mt-6"
                >
                    {loading ? t.processing : t.confirm}
                </button>
            </form>
        </div>
    );
};

export const UserInfoPage: React.FC = () => {
    const { currentUser, updateUser, language } = useApp();
    const t = TRANSLATIONS[language];
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ fullName: currentUser?.fullName || '', address: currentUser?.address || '' });

    const handleSave = () => {
        if(currentUser) {
            updateUser(currentUser.id, formData);
            alert("Updated!");
            navigate(-1);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <button onClick={() => navigate(-1)} className="mr-4 dark:text-white"><ChevronLeft /></button>
                    <h1 className="text-xl font-bold dark:text-white">{t.personal_info}</h1>
                </div>
                <button onClick={handleSave} className="text-blue-600 font-bold">{t.confirm}</button>
            </div>
            
            <div className="space-y-4">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
                    <label className="block text-xs text-gray-500 font-bold mb-1">Username</label>
                    <p className="font-bold dark:text-white">{currentUser?.username}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
                    <label className="block text-xs text-gray-500 font-bold mb-1">Full Name</label>
                    <input type="text" className="w-full bg-transparent border-b border-gray-200 dark:border-gray-700 py-1 outline-none dark:text-white" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
                    <label className="block text-xs text-gray-500 font-bold mb-1">Phone Number</label>
                    <p className="font-bold dark:text-white">{currentUser?.phoneNumber}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
                    <label className="block text-xs text-gray-500 font-bold mb-1">Address</label>
                    <input type="text" className="w-full bg-transparent border-b border-gray-200 dark:border-gray-700 py-1 outline-none dark:text-white" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                </div>
            </div>
        </div>
    );
};

export const BankBindPage: React.FC = () => {
    const { currentUser, bindBank, language } = useApp();
    const t = TRANSLATIONS[language];
    const navigate = useNavigate();
    const [bankData, setBankData] = useState({ 
        bankName: currentUser?.bankInfo?.bankName || '', 
        accountNumber: currentUser?.bankInfo?.accountNumber || '', 
        realName: currentUser?.bankInfo?.realName || '' 
    });

    const handleSave = () => {
        bindBank(bankData);
        alert("Bank info updated!");
        navigate(-1);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <button onClick={() => navigate(-1)} className="mr-4 dark:text-white"><ChevronLeft /></button>
                    <h1 className="text-xl font-bold dark:text-white">{t.bank_card}</h1>
                </div>
                <button onClick={handleSave} className="text-blue-600 font-bold">{t.confirm}</button>
            </div>

            <div className="space-y-4">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
                    <label className="block text-xs text-gray-500 font-bold mb-1">Bank Name</label>
                    <input type="text" className="w-full bg-transparent border-b border-gray-200 dark:border-gray-700 py-1 outline-none dark:text-white" value={bankData.bankName} onChange={e => setBankData({...bankData, bankName: e.target.value})} placeholder="e.g., Chase Bank" />
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
                    <label className="block text-xs text-gray-500 font-bold mb-1">Account Number</label>
                    <input type="text" className="w-full bg-transparent border-b border-gray-200 dark:border-gray-700 py-1 outline-none dark:text-white" value={bankData.accountNumber} onChange={e => setBankData({...bankData, accountNumber: e.target.value})} placeholder="e.g., 1234567890" />
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
                    <label className="block text-xs text-gray-500 font-bold mb-1">Account Holder Name</label>
                    <input type="text" className="w-full bg-transparent border-b border-gray-200 dark:border-gray-700 py-1 outline-none dark:text-white" value={bankData.realName} onChange={e => setBankData({...bankData, realName: e.target.value})} placeholder="Your Full Name" />
                </div>
            </div>
            
            <div className="mt-4 p-4 bg-yellow-50 text-yellow-800 rounded-lg text-sm">
                <p>Please ensure the account holder name matches your real name verification. Incorrect information may lead to withdrawal failures.</p>
            </div>
        </div>
    );
};

export const SecurityPage: React.FC = () => {
    const { currentUser, updateUser, language } = useApp();
    const t = TRANSLATIONS[language];
    const navigate = useNavigate();
    const [passData, setPassData] = useState({ password: '', transactionPassword: '' });

    const handleSave = () => {
        if (!currentUser) return;
        const updates: any = {};
        if (passData.password) updates.password = passData.password;
        if (passData.transactionPassword) updates.transactionPassword = passData.transactionPassword;
        
        if (Object.keys(updates).length > 0) {
            updateUser(currentUser.id, updates);
            alert("Security settings updated!");
            navigate(-1);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <button onClick={() => navigate(-1)} className="mr-4 dark:text-white"><ChevronLeft /></button>
                    <h1 className="text-xl font-bold dark:text-white">{t.security_center}</h1>
                </div>
                <button onClick={handleSave} className="text-blue-600 font-bold">{t.confirm}</button>
            </div>

            <div className="space-y-6">
                <div>
                    <h3 className="text-sm font-bold text-gray-500 uppercase mb-2 ml-1">Login Security</h3>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
                        <label className="block text-xs text-gray-500 font-bold mb-1">New Login Password</label>
                        <input type="password" className="w-full bg-transparent border-b border-gray-200 dark:border-gray-700 py-1 outline-none dark:text-white" value={passData.password} onChange={e => setPassData({...passData, password: e.target.value})} placeholder="Leave empty to keep current" />
                    </div>
                </div>

                <div>
                    <h3 className="text-sm font-bold text-gray-500 uppercase mb-2 ml-1">Transaction Security</h3>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm">
                        <label className="block text-xs text-gray-500 font-bold mb-1">New Transaction Password</label>
                        <input type="password" className="w-full bg-transparent border-b border-gray-200 dark:border-gray-700 py-1 outline-none dark:text-white" value={passData.transactionPassword} onChange={e => setPassData({...passData, transactionPassword: e.target.value})} placeholder="Leave empty to keep current" />
                    </div>
                </div>
            </div>
        </div>
    );
};
