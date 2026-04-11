import { useState, useEffect, useRef } from 'react';
import { useAuth } from "../context/AuthContext";

// --- COLOR CONFIGURATION ---
const COLOR_MAP = {
  blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100', hover: 'hover:bg-blue-50', gradient: 'from-blue-500 to-blue-600' },
  green: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', hover: 'hover:bg-emerald-50', gradient: 'from-emerald-500 to-emerald-600' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-100', hover: 'hover:bg-purple-50', gradient: 'from-purple-500 to-purple-600' },
  orange: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-100', hover: 'hover:bg-orange-50', gradient: 'from-orange-500 to-orange-600' },
  red: { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-100', hover: 'hover:bg-rose-50', gradient: 'from-rose-500 to-rose-600' },
  teal: { bg: 'bg-teal-50', text: 'text-teal-600', border: 'border-teal-100', hover: 'hover:bg-teal-50', gradient: 'from-teal-500 to-teal-600' },
  indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-100', hover: 'hover:bg-indigo-50', gradient: 'from-indigo-500 to-indigo-600' },
};

const ICON_MAP = {
  'piggy-bank': 'piggy-bank', 'building': 'building', 'money-check': 'money-check', 'globe-americas': 'globe-americas',
  'hand-holding-usd': 'hand-holding-usd', 'home': 'home', 'car': 'car', 'briefcase': 'briefcase', 'credit-card': 'credit-card',
  'id-card': 'id-card', 'wallet': 'wallet', 'mobile-alt': 'mobile-alt', 'file-invoice': 'file-invoice', 'exchange-alt': 'exchange-alt',
  'chart-line': 'chart-line', 'chart-bar': 'chart-bar', 'shield-alt': 'shield-alt', 'chart-pie': 'chart-pie', 'calculator': 'calculator',
  'gem': 'gem', 'project-diagram': 'project-diagram', 'rocket': 'rocket', 'file-contract': 'file-contract', 'landmark': 'landmark',
  'balance-scale': 'balance-scale', 'dollar-sign': 'dollar-sign', 'chess-knight': 'chess-knight', 'paper-plane': 'paper-plane',
  'receipt': 'receipt', 'phone-alt': 'phone-alt', 'envelope': 'envelope', 'map-marker-alt': 'map-marker-alt', 'question-circle': 'question-circle',
  'university': 'university', 'cube': 'cube', 'concierge-bell': 'concierge-bell', 'gift': 'gift', 'sign-in-alt': 'sign-in-alt',
  'user-plus': 'user-plus', 'sign-out-alt': 'sign-out-alt', 'times': 'times', 'bars': 'bars', 'chevron-down': 'chevron-down',
  'chevron-right': 'chevron-right', 'plus': 'plus', 'minus': 'minus', 'arrow-up': 'arrow-up', 'arrow-down': 'arrow-down',
  'award': 'award', 'bolt': 'bolt', 'crown': 'crown', 'star': 'star', 'shield-check': 'shield-check', 'lock': 'lock',
  'percent': 'percent', 'rupee-sign': 'rupee-sign', 'shopping-bag': 'shopping-bag', 'tag': 'tag'
};

// --- SUB-COMPONENTS ---

const Icon = ({ name, className = "" }) => {
  const iconName = ICON_MAP[name] || name;
  return <i className={`fas fa-${iconName} ${className}`} />;
};

// Promotional Banner Component
const PromotionalBanner = () => {
  const [currentOffer, setCurrentOffer] = useState(0);
  
  const offers = [
    { text: "🎉 Get 7% interest on Savings Account + ₹1000 Amazon Voucher!", link: "/savings-offer", color: "blue" },
    { text: "🚀 Pre-approved Personal Loan up to ₹25 Lakhs @10.5% p.a.", link: "/personal-loan", color: "green" },
    { text: "💳 Zero Annual Fee Credit Cards - Limited Time Offer!", link: "/credit-cards", color: "purple" },
    { text: "📈 Invest in Mutual Funds & Get Free Demat Account", link: "/invest", color: "orange" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentOffer((prev) => (prev + 1) % offers.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [offers.length]);

  const currentColor = COLOR_MAP[offers[currentOffer].color] || COLOR_MAP.blue;

  return (
    <div className={`bg-gradient-to-r ${currentColor.gradient} text-white py-2 text-sm relative overflow-hidden`}>
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="flex items-center space-x-2 animate-pulse">
          <Icon name="award" className="text-yellow-300" />
          <a href={offers[currentOffer].link} className="font-bold hover:underline text-center">
            {offers[currentOffer].text}
          </a>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 flex justify-center space-x-1 pb-1">
        {offers.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentOffer(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentOffer ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

// Market Ticker Component
const MarketTicker = () => {
  return (
    <div className="bg-slate-900 text-white text-xs py-2 overflow-hidden border-b border-slate-800 relative z-10">
      <div className="flex animate-marquee whitespace-nowrap space-x-8">
        <span className="flex items-center space-x-1"><span className="text-slate-400 font-medium">SENSEX</span><span className="text-green-400 font-bold">65,982.40 ▲ 0.45%</span></span>
        <span className="flex items-center space-x-1"><span className="text-slate-400 font-medium">NIFTY</span><span className="text-green-400 font-bold">19,765.20 ▲ 0.32%</span></span>
        <span className="flex items-center space-x-1"><span className="text-slate-400 font-medium">GOLD</span><span className="text-red-400 font-bold">58,400.00 ▼ 0.12%</span></span>
        <span className="flex items-center space-x-1"><span className="text-slate-400 font-medium">USD/INR</span><span className="text-green-400 font-bold">83.12 ▲ 0.05%</span></span>
        <span className="flex items-center space-x-1"><span className="text-slate-400 font-medium">BITCOIN</span><span className="text-green-400 font-bold">$34,210 ▲ 2.3%</span></span>
        {/* Duplicate for infinite scroll illusion */}
        <span className="flex items-center space-x-1"><span className="text-slate-400 font-medium">SENSEX</span><span className="text-green-400 font-bold">65,982.40 ▲ 0.45%</span></span>
        <span className="flex items-center space-x-1"><span className="text-slate-400 font-medium">NIFTY</span><span className="text-green-400 font-bold">19,765.20 ▲ 0.32%</span></span>
        <span className="flex items-center space-x-1"><span className="text-slate-400 font-medium">GOLD</span><span className="text-red-400 font-bold">58,400.00 ▼ 0.12%</span></span>
      </div>
      <style>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 25s linear infinite; }
      `}</style>
    </div>
  );
};



export default function Navbar() {
  const auth = useAuth();
  const user = auth?.user;
  const logout = auth?.logout;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileExpanded, setMobileExpanded] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  
  const dropdownRef = useRef(null);

  // Handle Scroll Effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle Click Outside (Desktop Dropdown)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        if (activeDropdown === 'user') setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeDropdown]);

  // Lock Body Scroll when Mobile Menu is Open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  const handleMouseEnter = (menu) => setActiveDropdown(menu);
  const handleMouseLeave = () => setActiveDropdown(null);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (!isMobileMenuOpen) setMobileExpanded(null);
  };

  const toggleMobileAccordion = (section) => {
    setMobileExpanded(mobileExpanded === section ? null : section);
  };

  const handleUserDropdownToggle = () => setActiveDropdown(activeDropdown === 'user' ? null : 'user');

  const handleLogout = () => {
    if (logout) logout();
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  // --- ENHANCED DATA ---
  const bankingProducts = [
    { 
      category: "Accounts", 
      items: [
        { name: "Savings Account", icon: "piggy-bank", link: "/savings", description: "Earn up to 7% Interest", badge: "Popular" },
        { name: "Current Account", icon: "building", link: "/current", description: "For seamless business", badge: "Zero Balance" },
        { name: "Salary Account", icon: "money-check", link: "/salary", description: "Premium benefits", badge: "New" }
      ] 
    },
    { 
      category: "Loans", 
      items: [
        { name: "Personal Loan", icon: "hand-holding-usd", link: "/personal-loan", description: "Quick disbursal", badge: "Pre-approved" },
        { name: "Home Loan", icon: "home", link: "/home-loan", description: "Attractive rates", badge: "6.9%*" },
        { name: "Car Loan", icon: "car", link: "/car-loan", description: "Drive home your dream", badge: "Low EMI" }
      ] 
    },
    { 
      category: "Cards", 
      items: [
        { name: "Credit Cards", icon: "credit-card", link: "/credit-cards", description: "Lifetime free options", badge: "Rewards" },
        { name: "Debit Cards", icon: "id-card", link: "/debit-cards", description: "Secure payments", badge: "Free" },
        { name: "Prepaid Cards", icon: "shopping-bag", link: "/prepaid-cards", description: "Control your spending", badge: "Flexible" }
      ] 
    }
  ];

  const bankingServices = [
    { 
      category: "Payments", 
      items: [
        { name: "UPI Payments", icon: "mobile-alt", link: "/upi", description: "Scan & Pay instantly", badge: "Fast" },
        { name: "Bill Payments", icon: "file-invoice", link: "/bill-pay", description: "Electricity, Water, DTH", badge: "Easy" },
        { name: "Tax Payments", icon: "calculator", link: "/tax-payment", description: "Income Tax, GST", badge: "Secure" }
      ] 
    },
    { 
      category: "Wealth", 
      items: [
        { name: "Mutual Funds", icon: "chart-line", link: "/mutual-funds", description: "Start SIP at ₹500", badge: "Wealth+" },
        { name: "Fixed Deposits", icon: "chart-bar", link: "/fixed-deposits", description: "Guaranteed returns", badge: "7.2%" },
        { name: "Digital Gold", icon: "gem", link: "/digital-gold", description: "Buy 24K Gold", badge: "Safe" }
      ] 
    },
  ];

  const investmentOptions = [
    { 
      category: "Market", 
      items: [
        { name: "Stocks", icon: "chart-line", link: "/equity", description: "Trade on NSE/BSE", badge: "Zero Brokerage" },
        { name: "IPO", icon: "rocket", link: "/ipo", description: "Apply for new listings", badge: "Hot" },
        { name: "Futures & Options", icon: "project-diagram", link: "/fno", description: "Advanced trading", badge: "Pro" }
      ] 
    },
    { 
      category: "Safe Haven", 
      items: [
        { name: "Gold Bonds", icon: "gem", link: "/gold", description: "Digital Gold", badge: "Sovereign" },
        { name: "Govt Bonds", icon: "landmark", link: "/bonds", description: "Sovereign Guarantee", badge: "Safe" },
        { name: "Corporate FDs", icon: "building", link: "/corporate-fd", description: "Higher returns", badge: "8.5%" }
      ] 
    }
  ];

  const quickActions = [
    { name: "Transfer", icon: "paper-plane", link: "/send-money", color: "blue" },
    { name: "Pay Bills", icon: "receipt", link: "/pay-bills", color: "green" },
    { name: "Recharge", icon: "mobile-alt", link: "/recharge", color: "purple" },
    { name: "Invest", icon: "chart-line", link: "/invest-now", color: "teal" },
    { name: "Loans", icon: "hand-holding-usd", link: "#loan", color: "orange" },
    { name: "Offers", icon: "tag", link: "/offers", color: "red" }
  ];

  const userMenuItems = [
    { name: "Dashboard", icon: "chart-pie", link: "/dashboard" },
    { name: "My Accounts", icon: "wallet", link: "/my-accounts" },
    { name: "Transactions", icon: "receipt", link: "/dashboard/transactions" },
    { name: "Payments", icon: "rupee-sign", link: "/payments" },
    { name: "Cards", icon: "credit-card", link: "/cards" },
    { name: "Investments", icon: "chart-line", link: "/investments" },
    { name: "Loans", icon: "hand-holding-usd", link: "/loans" },
    { name: "Profile", icon: "user", link: "/dashboard/profile" },
    { name: "Settings", icon: "cog", link: "/settings" }
  ];

  return (
    <>
      {/* 1. Promotional Banner */}
      {/* <PromotionalBanner /> */}

      {/* 2. Top Bar */}
      <div className="bg-slate-900 text-slate-300 py-2 text-xs relative z-[60] border-b border-slate-800 hidden md:block">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <span className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer">
              <Icon name="phone-alt" className="text-blue-400" /> 
              <span>1800-123-4567</span>
            </span>
            <span className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer">
              <Icon name="envelope" className="text-green-400" /> 
              <span>vastabank.official@gmail.com</span>
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <a href="/locator" className="hover:text-white flex items-center gap-1 transition-colors">
              <Icon name="map-marker-alt" /> 
              <span>Branch & ATM Locator</span>
            </a>
            <a href="/help" className="hover:text-white flex items-center gap-1 transition-colors">
              <Icon name="question-circle" /> 
              <span>24x7 Support</span>
            </a>
            <div className="w-px h-4 bg-slate-600"></div>
            <a href="/nri" className="hover:text-white flex items-center gap-1 transition-colors">
              <Icon name="globe-americas" /> 
              <span>NRI Banking</span>
            </a>
          </div>
        </div>
      </div>



      {/* 4. Main Navbar */}
      <nav 
        className={`sticky top-0 z-[50] transition-all duration-300 border-b border-gray-100 
        ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-white'}`}
      >
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 xl:h-20">
            
            {/* Logo */}
          <div className="flex-shrink-0 flex items-center z-[60]">
            <a href="/" className="flex items-center space-x-3 group">
              
              <div className="relative flex items-center justify-center">
                <img 
                      src="/vasta-bank-logo-removebg-preview.png" 
                      alt="Vasta Logo" 
                      /* Changed h-11 to h-16 for a significantly larger presence */
                      className="h-16 w-auto object-contain transition-all duration-500 group-hover:scale-110 filter drop-shadow-2xl"
                    />
                      
                
              </div>

              {/* Text Branding */}
              <div className="flex flex-col leading-none">
                <div className="flex items-baseline">
                  <span className="text-4xl font-[900] text-[#1a365d] tracking-widest uppercase font-sans transition-colors duration-300 group-hover:text-blue-800">
                    V Λ S T Λ
                  </span>
                  <span className="ml-1.5 text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] self-end mb-1">
                    Bank
                  </span>
                </div>
                <div className="h-[3px] w-8 bg-blue-600 rounded-full mt-1 transition-all duration-300 group-hover:w-full opacity-80"></div>
              </div>
            </a>
          </div>

            {/* Desktop Menu (Hidden on Mobile) */}
            {!user && (
              <div className="hidden xl:flex items-center space-x-8">
                {[
                  { id: 'products', label: 'Products', icon: 'cube', color: 'blue', data: bankingProducts },
                  { id: 'services', label: 'Services', icon: 'concierge-bell', color: 'green', data: bankingServices },
                  { id: 'invest', label: 'Invest', icon: 'chart-line', color: 'purple', data: investmentOptions }
                ].map((menu) => (
                  <div 
                    key={menu.id}
                    className="relative group h-full flex items-center"
                    onMouseEnter={() => handleMouseEnter(menu.id)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <button className="flex items-center space-x-1.5 text-slate-600 hover:text-blue-700 font-bold text-sm py-2 px-1 rounded-md transition-colors group-hover:bg-blue-50/50 px-3">
                      <Icon name={menu.icon} className={`text-${menu.color}-500 group-hover:text-${menu.color}-600`} />
                      <span>{menu.label}</span>
                      <Icon name="chevron-down" className={`text-[10px] transition-transform duration-300 ${activeDropdown === menu.id ? 'rotate-180 text-blue-600' : 'text-slate-400'}`} />
                    </button>
                    
                    {/* Desktop Dropdown */}
                    {activeDropdown === menu.id && (
                      <div className="absolute top-[80%] left-1/2 transform -translate-x-1/2 w-[700px] bg-white rounded-2xl shadow-2xl border border-gray-100 py-6 z-50 animate-fadeInUp">
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white transform rotate-45 border-t border-l border-gray-100"></div>
                        <div className="grid grid-cols-3 gap-8 px-8 relative">
                          {menu.data.map((section, index) => (
                            <div key={index}>
                              <h3 className={`font-bold text-xs uppercase tracking-wider text-${menu.color}-600 mb-3 border-b border-gray-100 pb-2 flex items-center gap-2`}>
                                <Icon name={menu.icon} className="text-sm" />
                                {section.category}
                              </h3>
                              <div className="space-y-1">
                                {section.items.map((item, itemIndex) => (
                                  <a 
                                    key={itemIndex} 
                                    href={item.link} 
                                    className={`flex items-start space-x-3 p-2 rounded-lg hover:bg-${menu.color}-50 transition-all group/item relative`}
                                  >
                                    <div className={`mt-0.5 text-${menu.color}-500 group-hover/item:scale-110 transition-transform flex-shrink-0`}>
                                        <Icon name={item.icon} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-bold text-slate-700 group-hover/item:text-slate-900 flex items-center gap-2">
                                          {item.name}
                                          {item.badge && (
                                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full bg-${menu.color}-100 text-${menu.color}-700 font-bold`}>
                                              {item.badge}
                                            </span>
                                          )}
                                        </div>
                                        <div className="text-xs text-slate-400 group-hover/item:text-slate-500 truncate">{item.description}</div>
                                    </div>
                                  </a>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                
                <div className="h-6 w-px bg-slate-200 mx-2"></div>

                <div className="flex items-center space-x-3">
                  <a href="/login" className="text-slate-700 font-bold text-sm hover:text-blue-700 transition-colors px-3 py-2 rounded-lg hover:bg-slate-50 flex items-center gap-2">
                    <Icon name="sign-in-alt" />
                    Login
                  </a>
                  <a href="/signup" className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold text-sm px-5 py-2.5 rounded-full shadow-lg hover:shadow-blue-200 transition-all transform hover:-translate-y-0.5 flex items-center gap-2">
                    <Icon name="user-plus" />
                    Open Account
                  </a>
                </div>
              </div>
            )}

            {/* Logged In Desktop */}
            {user && (
              <div className="hidden xl:flex items-center space-x-6">
                 {/* Quick Actions */}
                 <div className="flex items-center space-x-3 bg-slate-50 p-1.5 rounded-xl border border-slate-100">
                  {quickActions.map((action, index) => {
                     const colors = COLOR_MAP[action.color] || COLOR_MAP['blue'];
                     return (
                      <a 
                        key={index} 
                        href={action.link} 
                        className="flex flex-col items-center justify-center w-16 py-2 rounded-lg hover:bg-white hover:shadow-sm transition-all group relative"
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${colors.bg} ${colors.text} group-hover:scale-110 transition-transform`}>
                          <Icon name={action.icon} className="text-xs" />
                        </div>
                        <span className="text-[10px] font-bold text-slate-600">{action.name}</span>
                      </a>
                    );
                  })}
                </div>
                
                {/* User Profile with Dropdown */}
                <div className="relative group" ref={dropdownRef}>
                    <button 
                      onClick={handleUserDropdownToggle} 
                      className="flex items-center space-x-3 focus:outline-none bg-slate-50 hover:bg-slate-100 rounded-xl px-3 py-2 transition-colors border border-slate-100"
                    >
                        <div className="text-right hidden md:block">
                            <div className="text-sm font-bold text-slate-800">{user.email.split('@')[0]}</div>
                            <div className="text-xs text-slate-500 flex items-center gap-1">
                              <Icon name="star" className="text-amber-500 text-[10px]" />
                              Premium Customer
                            </div>
                        </div>
                        <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-md border-2 border-white ring-2 ring-blue-50">
                            {user.email.charAt(0).toUpperCase()}
                        </div>
                        <Icon name="chevron-down" className={`text-slate-400 transition-transform ${activeDropdown === 'user' ? 'rotate-180' : ''}`} />
                    </button>
                    {activeDropdown === 'user' && (
                        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 py-3 z-50 animate-fadeInUp">
                            {/* User Summary */}
                            <div className="px-4 py-3 border-b border-gray-50 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl">
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                        {user.email.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-slate-800 truncate">{user.email.split('@')[0]}</p>
                                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                                        <div className="flex items-center gap-1 mt-1">
                                            <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold">Premium</span>
                                            <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">Gold</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            

                            {/* Menu Items */}
                            <div className="max-h-60 overflow-y-auto">
                                {userMenuItems.map((item, index) => (
                                    <a 
                                        key={index}
                                        href={item.link} 
                                        className="flex items-center space-x-3 px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 transition-colors"
                                    >
                                        <Icon name={item.icon} className="text-slate-400 w-4 text-center" />
                                        <span>{item.name}</span>
                                    </a>
                                ))}
                            </div>

                            <div className="border-t border-gray-50 mt-1"></div>
                            <button 
                                onClick={handleLogout} 
                                className="w-full text-left px-4 py-2 text-sm text-red-600 font-bold hover:bg-red-50 flex items-center space-x-3 transition-colors"
                            >
                                <Icon name="sign-out-alt" />
                                <span>Sign out</span>
                            </button>
                        </div>
                    )}
                </div>
              </div>
            )}

            {/* Mobile Hamburger */}
            <div className="xl:hidden flex items-center z-[60]">
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none relative"
              >
                <Icon name={isMobileMenuOpen ? 'times' : 'bars'} className="text-2xl" />
                {user && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 5. Ticker (Below Navbar) */}
      <MarketTicker />

      {/* 6. SOLID MOBILE MENU OVERLAY */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-[64px] z-40 bg-white border-t border-slate-100 overflow-y-auto animate-fadeIn pb-24">
          <div className="p-4 space-y-6">
            
            {/* NOT LOGGED IN MOBILE */}
            {!user ? (
              <div className="space-y-4">
                 {/* Promo Card */}
                 <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-4 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="font-bold text-lg">Get ₹1000 Welcome Bonus!</div>
                            <div className="text-blue-100 text-sm">Open your account now</div>
                        </div>
                        <Icon name="gift" className="text-2xl text-yellow-300" />
                    </div>
                    <a href="/signup" className="inline-block mt-3 bg-white text-blue-600 font-bold px-4 py-2 rounded-lg text-sm">
                        Claim Offer
                    </a>
                 </div>

                 {/* Accordions */}
                 {[
                   { id: 'products', label: 'Products', icon: 'cube', color: 'blue', data: bankingProducts },
                   { id: 'services', label: 'Services', icon: 'concierge-bell', color: 'green', data: bankingServices },
                   { id: 'invest', label: 'Invest', icon: 'chart-line', color: 'purple', data: investmentOptions }
                 ].map((section) => (
                    <div key={section.id} className="border border-slate-100 rounded-xl overflow-hidden bg-white shadow-sm">
                        <button 
                            onClick={() => toggleMobileAccordion(section.id)}
                            className="w-full flex items-center justify-between p-4 bg-white active:bg-slate-50 transition-colors"
                        >
                            <div className="flex items-center space-x-3">
                                <div className={`w-9 h-9 rounded-lg ${COLOR_MAP[section.color].bg} flex items-center justify-center`}>
                                    <Icon name={section.icon} className={COLOR_MAP[section.color].text} />
                                </div>
                                <span className="font-bold text-slate-800 text-lg">{section.label}</span>
                            </div>
                            <div className={`transition-transform duration-300 ${mobileExpanded === section.id ? 'rotate-180' : ''}`}>
                              <Icon name="chevron-down" className="text-slate-400" />
                            </div>
                        </button>
                        
                        {/* Smooth Expand */}
                        <div className={`transition-all duration-300 ease-in-out ${mobileExpanded === section.id ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div className="px-4 pb-4 space-y-1 bg-white">
                                <div className="h-px bg-slate-50 mb-2"></div>
                                {section.data.flatMap(g => g.items).map((item, idx) => (
                                    <a 
                                      key={idx} 
                                      href={item.link} 
                                      className="flex items-start space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                                    >
                                        <div className={`mt-0.5 ${COLOR_MAP[section.color].text}`}>
                                          <Icon name={item.icon} />
                                        </div>
                                        <div className="flex-1">
                                          <div className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                            {item.name}
                                            {item.badge && (
                                              <span className={`text-[10px] px-1.5 py-0.5 rounded-full bg-${section.color}-100 text-${section.color}-700 font-bold`}>
                                                {item.badge}
                                              </span>
                                            )}
                                          </div>
                                          <div className="text-xs text-slate-400">{item.description}</div>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                 ))}

                 <div className="pt-6 space-y-3 px-2">
                    <a href="/login" className="block w-full text-center bg-blue-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-200 active:scale-95 transition-transform flex items-center justify-center gap-2">
                      <Icon name="sign-in-alt" />
                      Login Securely
                    </a>
                    <a href="/signup" className="block w-full text-center bg-white border-2 border-slate-100 text-slate-700 font-bold py-3.5 rounded-xl active:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                      <Icon name="user-plus" />
                      Open New Account
                    </a>
                 </div>
              </div>
            ) : (
              // LOGGED IN MOBILE
              <div className="space-y-6">
                {/* User Card */}
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl shadow-blue-100">
                    <div className="flex items-center space-x-4">
                        <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-xl font-bold border border-white/30">
                            {user.email.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                            <div className="font-bold text-lg">{user.email.split('@')[0]}</div>
                            <div className="text-blue-100 text-sm">{user.email}</div>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] bg-amber-500 text-white px-2 py-0.5 rounded-full">Premium</span>
                                <span className="text-[10px] bg-blue-500 text-white px-2 py-0.5 rounded-full">Gold</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Account Summary */}
                <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="font-bold text-slate-800">Account Summary</h3>
                        <a href="/accounts" className="text-blue-600 text-sm font-bold">View All</a>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <div className="text-xs text-slate-500">Balance</div>
                            <div className="text-sm font-bold text-slate-800">₹45,670</div>
                        </div>
                        <div>
                            <div className="text-xs text-slate-500">Cards</div>
                            <div className="text-sm font-bold text-slate-800">2 Active</div>
                        </div>
                        <div>
                            <div className="text-xs text-slate-500">Loans</div>
                            <div className="text-sm font-bold text-slate-800">1 Active</div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions Grid */}
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 px-1">Quick Actions</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {quickActions.map((action, index) => {
                       const colors = COLOR_MAP[action.color] || COLOR_MAP['blue'];
                       return (
                        <a 
                          href={action.link} 
                          key={index} 
                          className={`flex flex-col items-center justify-center p-3 rounded-xl border border-slate-100 bg-white shadow-sm ${colors.hover} active:scale-95 transition-transform`}
                        >
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${colors.bg}`}>
                            <Icon name={action.icon} className={`${colors.text} text-lg`} />
                          </div>
                          <span className="text-xs font-bold text-slate-700 text-center">{action.name}</span>
                        </a>
                      );
                    })}
                  </div>
                </div>

                {/* User Menu */}
                <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
                  {userMenuItems.slice(0, 6).map((item, index) => (
                    <a 
                      key={index}
                      href={item.link} 
                      className="flex items-center justify-between p-4 border-b border-slate-50 active:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Icon name={item.icon} className="text-slate-400" /> 
                        <span className="font-semibold text-slate-700">{item.name}</span>
                      </div>
                      <Icon name="chevron-right" className="text-xs text-slate-300" />
                    </a>
                  ))}
                </div>
                
                <button 
                  onClick={handleLogout} 
                  className="w-full flex items-center justify-center space-x-2 p-4 rounded-xl bg-red-50 text-red-600 font-bold mt-8 border border-red-100 active:bg-red-100 transition-colors"
                >
                  <Icon name="sign-out-alt" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Animation Styles */}
      <style>{`
        @keyframes fadeInUp { 
          from { opacity: 0; transform: translate(-50%, 10px); } 
          to { opacity: 1; transform: translate(-50%, 0); } 
        }
        .animate-fadeInUp { animation: fadeInUp 0.2s ease-out forwards; }
        
        @keyframes fadeIn { 
          from { opacity: 0; } 
          to { opacity: 1; } 
        }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out forwards; }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        .animate-pulse { animation: pulse 2s infinite; }
      `}</style>
    </>
  );
}