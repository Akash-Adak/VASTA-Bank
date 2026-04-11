import React from 'react';
const ICON_MAP = {
  'piggy-bank': 'piggy-bank'
};
const Icon = ({ name, className = "" }) => {
  const iconName = ICON_MAP[name] || name;
  return <i className={`fas fa-${iconName} ${className}`} />;
};
export default function Footer() {
  return (
    <footer className="bg-[#0f172a] text-gray-400 font-sans relative overflow-hidden border-t border-gray-800">
      {/* Decorative Top Gradient Border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-700 via-yellow-400 to-blue-700 opacity-80"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Top Section: Links & Branding */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-white">
              {/* <div className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center font-bold text-2xl shadow-lg shadow-blue-900/50">B</div> */}
                <div className="relative flex items-center justify-center">
                <img 
                      src="/vasta-bank-logo-removebg-preview.png" 
                      alt="Vasta Logo" 
                      /* Changed h-11 to h-16 for a significantly larger presence */
                      className="h-16 w-auto object-contain transition-all duration-500 group-hover:scale-110 filter drop-shadow-2xl"
                    />
                      
                
              </div>
              <span className="text-2xl font-bold tracking-tight">V Λ S T Λ</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-500">
              India's most trusted digital banking partner. Providing secure, fast, and accessible financial services to over 10 million customers.
            </p>
            
            <div className="pt-2">
              <div className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-3">Follow Us</div>
              <div className="flex gap-4">
                {['facebook-f', 'twitter', 'linkedin-in', 'instagram', 'youtube'].map((icon, idx) => (
                  <a key={idx} href="#" className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all duration-300 border border-gray-700 hover:border-blue-500 hover:-translate-y-1">
                    <i className={`fab fa-${icon} text-sm`}></i>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links - Products */}
          <div>
            <h3 className="text-white font-bold mb-5 border-b border-gray-800 pb-2 inline-block">Products</h3>
            <ul className="space-y-3 text-sm">
              {['Savings Account', 'Current Account', 'Credit Cards', 'Home Loans', 'Personal Loans', 'Fixed Deposits', 'Demat Account'].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-blue-400 transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 bg-gray-600 rounded-full group-hover:bg-blue-400 transition-colors"></span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links - Services */}
          <div>
            <h3 className="text-white font-bold mb-5 border-b border-gray-800 pb-2 inline-block">Services</h3>
            <ul className="space-y-3 text-sm">
              {['Net Banking', 'Mobile Banking', 'Bill Payments', 'FASTag Recharge', 'Forex Services', 'Locker Facility', 'Doorstep Banking'].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-blue-400 transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-1 bg-gray-600 rounded-full group-hover:bg-blue-400 transition-colors"></span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & App */}
          <div>
            <h3 className="text-white font-bold mb-5 border-b border-gray-800 pb-2 inline-block">Get in Touch</h3>
            <ul className="space-y-4 text-sm mb-8">
              <li className="flex gap-3">
                <div className="w-8 h-8 rounded bg-gray-800 flex items-center justify-center flex-shrink-0 text-blue-500">
                  <i className="fas fa-phone-alt text-xs"></i>
                </div>
                <div>
                  <div className="text-white font-bold text-lg leading-none">1800-202-6060</div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-wide mt-1">24/7 Toll Free</div>
                </div>
              </li>
              <li className="flex gap-3">
                <div className="w-8 h-8 rounded bg-gray-800 flex items-center justify-center flex-shrink-0 text-blue-500">
                  <i className="fas fa-envelope text-xs"></i>
                </div>
                <div>
                  <div className="text-white font-medium">vastabank.official@gmail.com</div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-wide mt-1">Priority Support</div>
                </div>
              </li>
            </ul>

            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mb-3">Mobile Banking App</div>
              <div className="grid grid-cols-2 gap-2">
                <button className="bg-gray-800 hover:bg-gray-700 py-2.5 px-3 rounded-lg flex items-center gap-3 transition-colors border border-gray-700 hover:border-gray-500 group">
                  <i className="fab fa-google-play text-xl text-green-500 group-hover:text-green-400 transition-colors"></i>
                  <div className="text-left">
                    <div className="text-[9px] leading-none uppercase text-gray-400">Get it on</div>
                    <div className="text-xs font-bold text-white leading-none mt-1">Google Play</div>
                  </div>
                </button>
                <button className="bg-gray-800 hover:bg-gray-700 py-2.5 px-3 rounded-lg flex items-center gap-3 transition-colors border border-gray-700 hover:border-gray-500 group">
                  <i className="fab fa-apple text-xl text-gray-400 group-hover:text-white transition-colors"></i>
                  <div className="text-left">
                    <div className="text-[9px] leading-none uppercase text-gray-400">Download on</div>
                    <div className="text-xs font-bold text-white leading-none mt-1">App Store</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Section: Regulatory & Disclaimer (The "Proper" Bank Look) */}
        <div className="border-t border-gray-800 pt-8 pb-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
             <div className="space-y-2">
               <h4 className="text-[11px] font-bold text-gray-300 uppercase tracking-wider">Registered Office</h4>
               <p className="text-xs leading-relaxed text-gray-500">
                 Samarth Bank Tower, Plot No. C-12, G Block, Bandra-Kurla Complex, Bandra (East), Mumbai - 400051, Maharashtra, India.<br/>
                 <span className="text-gray-400">CIN: L65191MH1994PLC076333</span> | <span className="text-gray-400">RBI License No: BANK-9988-77/2024</span>
               </p>
             </div>
             <div className="lg:text-right flex flex-col lg:items-end justify-center gap-2">
                <div className="text-[11px] font-bold text-gray-300 uppercase tracking-wider">Certifications</div>
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2 bg-gray-900/50 px-3 py-1.5 rounded border border-gray-800 hover:border-green-800/50 transition-colors">
                    <i className="fas fa-university text-green-600 text-xs"></i>
                    <span className="text-xs font-medium text-gray-400">RBI Regulated</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-900/50 px-3 py-1.5 rounded border border-gray-800 hover:border-yellow-800/50 transition-colors">
                    <i className="fas fa-lock text-yellow-600 text-xs"></i>
                    <span className="text-xs font-medium text-gray-400">PCI-DSS Compliant</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-900/50 px-3 py-1.5 rounded border border-gray-800 hover:border-blue-800/50 transition-colors">
                    <i className="fas fa-shield-alt text-blue-600 text-xs"></i>
                    <span className="text-xs font-medium text-gray-400">ISO 27001</span>
                  </div>
                </div>
             </div>
          </div>

          <div className="bg-gray-900/30 p-4 rounded-lg border border-gray-800/50">
            <p className="text-[10px] text-gray-600 text-justify leading-relaxed">
              <strong>IMPORTANT DISCLAIMER:</strong> Samarth Bank never asks for your PIN, OTP, CVV, or Internet Banking Password via Email, SMS, or Call. Please do not share such confidential information with anyone. 
              Mutual Fund investments are subject to market risks, read all scheme related documents carefully. The information provided on this website is for general information purposes only.
              All interest rates, charges, and product features are subject to change without prior notice based on market conditions and internal policies.
              <br/><br/>
              By accessing this website, you agree to be bound by the Terms and Conditions and Privacy Policy of Samarth Bank Ltd.
            </p>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Utility Links */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <div className="text-gray-500">
            &copy; {new Date().getFullYear()}  VΛSTΛ Bank Ltd. All Rights Reserved.
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            <a href="#" className="text-gray-500 hover:text-white transition-colors">Privacy Policy</a>
            <span className="text-gray-800">|</span>
            <a href="#" className="text-gray-500 hover:text-white transition-colors">Terms of Use</a>
            <span className="text-gray-800">|</span>
            <a href="#" className="text-gray-500 hover:text-white transition-colors">Cyber Security</a>
            <span className="text-gray-800">|</span>
            <a href="#" className="text-gray-500 hover:text-white transition-colors">Sitemap</a>
            <span className="text-gray-800">|</span>
            <a href="#" className="text-gray-500 hover:text-white transition-colors">Investor Relations</a>
          </div>
        </div>
      </div>
    </footer>
  );
}