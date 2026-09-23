import React from 'react';
import { ViewTab, Language } from '../types';
import {
  Users,
  LayoutDashboard,
  Droplet,
  SlidersHorizontal,
  Mail,
  UserPlus,
  Sun,
  Moon,
  Sparkles
} from 'lucide-react';

interface HeaderProps {
  activeTab: ViewTab;
  onSelectTab: (tab: ViewTab) => void;
  lang: Language;
  onToggleLang: () => void;
  darkMode: boolean;
  onToggleTheme: () => void;
  onOpenAddModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  lang,
  onToggleLang,
  darkMode,
  onToggleTheme,
  onOpenAddModal
}) => {
  const isBn = lang === 'bn';

  const navItems = [
    {
      id: 'dashboard' as ViewTab,
      label: isBn ? 'ড্যাশবোর্ড ও মাইলস্টোন' : 'Dashboard & Alerts',
      icon: LayoutDashboard
    },
    {
      id: 'employees' as ViewTab,
      label: isBn ? 'কর্মী তালিকা' : 'Staff Directory',
      icon: Users
    },
    {
      id: 'blood' as ViewTab,
      label: isBn ? 'ব্লাড গ্রুপ' : 'Blood Bank',
      icon: Droplet
    },
    {
      id: 'settings' as ViewTab,
      label: isBn ? 'শাখা ও পদবী' : 'Settings',
      icon: SlidersHorizontal
    },
    {
      id: 'emails' as ViewTab,
      label: isBn ? 'ইমেইল ও শুভেচ্ছা' : 'Email & Templates',
      icon: Mail
    }
  ];

  return (
    <header className="sticky top-0 z-30 bg-slate-900 text-slate-100 border-b border-slate-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-base shadow-inner">
            SSS
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm sm:text-base tracking-tight text-white leading-tight">
              {isBn ? 'সোসাইটি ফর সোসাল সার্ভিস (এসএসএস)' : 'Society for Social Service'}
            </span>
            <span className="text-xs text-slate-400 font-medium tracking-wide">
              {isBn ? 'জোন চট্টগ্রাম-০২ — কর্মী তথ্য ও মাইলস্টোন' : 'Zone Chattogram-02 — Staff Database'}
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1" aria-label="Main Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-amber-500/15 text-amber-300 font-semibold border border-amber-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onToggleLang}
            title={isBn ? 'Switch to English' : 'বাংলায় পরিবর্তন করুন'}
            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
          >
            {isBn ? 'English' : 'বাংলা'}
          </button>

          <button
            onClick={onToggleTheme}
            title={darkMode ? 'Light Mode' : 'Dark Mode'}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-300 border border-slate-700 transition-colors cursor-pointer"
            aria-label="Toggle Theme"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 active:scale-97 text-slate-950 rounded-lg text-xs font-semibold shadow-sm transition-all cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isBn ? 'নতুন কর্মী যুক্ত' : 'Add Employee'}</span>
            <span className="sm:hidden">{isBn ? 'যোগ' : 'Add'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="lg:hidden flex items-center overflow-x-auto border-t border-slate-800/80 px-2 py-1 gap-1 bg-slate-900/95 scrollbar-none">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-amber-500/20 text-amber-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
