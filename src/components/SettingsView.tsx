import React, { useState } from 'react';
import { Employee, Language } from '../types';
import { formatNum } from '../utils/dateUtils';
import {
  MapPin,
  Building2,
  Briefcase,
  Plus,
  Trash2,
  AlertTriangle
} from 'lucide-react';

interface SettingsViewProps {
  areas: string[];
  branches: string[];
  designations: string[];
  employees: Employee[];
  lang: Language;
  onAddOption: (type: 'areas' | 'branches' | 'designations', val: string) => void;
  onRemoveOption: (type: 'areas' | 'branches' | 'designations', index: number) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  areas,
  branches,
  designations,
  employees,
  lang,
  onAddOption,
  onRemoveOption
}) => {
  const isBn = lang === 'bn';

  const [newArea, setNewArea] = useState('');
  const [newBranch, setNewBranch] = useState('');
  const [newDesig, setNewDesig] = useState('');

  const handleAdd = (type: 'areas' | 'branches' | 'designations') => {
    let val = '';
    if (type === 'areas') {
      val = newArea.trim();
      if (val) {
        onAddOption(type, val);
        setNewArea('');
      }
    } else if (type === 'branches') {
      val = newBranch.trim();
      if (val) {
        onAddOption(type, val);
        setNewBranch('');
      }
    } else if (type === 'designations') {
      val = newDesig.trim();
      if (val) {
        onAddOption(type, val);
        setNewDesig('');
      }
    }
  };

  const getUsageCount = (type: 'areas' | 'branches' | 'designations', name: string) => {
    if (type === 'areas') return employees.filter((e) => e.area === name).length;
    if (type === 'branches') return employees.filter((e) => e.branch === name).length;
    return employees.filter((e) => e.designation === name).length;
  };

  const handleRemove = (type: 'areas' | 'branches' | 'designations', index: number, name: string) => {
    const count = getUsageCount(type, name);
    if (count > 0) {
      const confirmMsg = isBn
        ? `সতর্কতা: "${name}"-এ বর্তমানে ${formatNum(count, 'bn')} জন কর্মী নিযুক্ত আছেন। আপনি কি সত্যিই এটি ড্রপডাউন তালিকা থেকে সরাতে চান?`
        : `Warning: "${name}" currently has ${count} staff assigned. Are you sure you want to remove it from dropdown options?`;
      if (!window.confirm(confirmMsg)) return;
    }
    onRemoveOption(type, index);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
        <h1 className="text-lg font-bold text-slate-900 dark:text-white">
          {isBn ? 'শাখা, এরিয়া ও পদবী সেটিংস' : 'Dropdown Configurations'}
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          {isBn
            ? 'জোন চট্টগ্রাম-০২-এর অধীনস্থ এরিয়া, শাখা ও অফিসিয়াল পদবী তালিকা সহজে নিয়ন্ত্রণ করুন।'
            : 'Manage available Areas, Branches, and official Job Designations for Zone Chattogram-02.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* AREAS PANEL */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <MapPin className="w-4 h-4 text-amber-500" />
            <h2 className="font-bold text-sm text-slate-900 dark:text-white">
              {isBn ? 'এরিয়া তালিকা' : 'Areas'}
            </h2>
            <span className="ml-auto font-mono text-xs text-slate-400">
              {formatNum(areas.length, lang)}
            </span>
          </div>

          <div className="mt-3 flex gap-2">
            <input
              type="text"
              value={newArea}
              onChange={(e) => setNewArea(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd('areas')}
              placeholder={isBn ? 'নতুন এরিয়া লিখুন...' : 'New area name...'}
              className="flex-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden"
            />
            <button
              onClick={() => handleAdd('areas')}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-semibold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-4 flex-1 overflow-y-auto max-h-80 divide-y divide-slate-100 dark:divide-slate-800/80">
            {areas.map((item, idx) => {
              const count = getUsageCount('areas', item);
              return (
                <div key={idx} className="py-2.5 flex items-center justify-between gap-2 text-xs">
                  <div className="truncate">
                    <span className="text-slate-800 dark:text-slate-200 font-medium">{item}</span>
                    <span className="text-[11px] text-slate-400 font-mono ml-2">
                      ({formatNum(count, lang)} {isBn ? 'জন' : 'staff'})
                    </span>
                  </div>
                  <button
                    onClick={() => handleRemove('areas', idx, item)}
                    title={isBn ? 'মুছে ফেলুন' : 'Remove'}
                    className="text-slate-400 hover:text-rose-600 p-1 rounded-md transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* BRANCHES PANEL */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Building2 className="w-4 h-4 text-teal-500" />
            <h2 className="font-bold text-sm text-slate-900 dark:text-white">
              {isBn ? 'শাখা তালিকা' : 'Branches'}
            </h2>
            <span className="ml-auto font-mono text-xs text-slate-400">
              {formatNum(branches.length, lang)}
            </span>
          </div>

          <div className="mt-3 flex gap-2">
            <input
              type="text"
              value={newBranch}
              onChange={(e) => setNewBranch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd('branches')}
              placeholder={isBn ? 'নতুন শাখা লিখুন...' : 'New branch name...'}
              className="flex-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden"
            />
            <button
              onClick={() => handleAdd('branches')}
              className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-semibold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-4 flex-1 overflow-y-auto max-h-80 divide-y divide-slate-100 dark:divide-slate-800/80">
            {branches.map((item, idx) => {
              const count = getUsageCount('branches', item);
              return (
                <div key={idx} className="py-2.5 flex items-center justify-between gap-2 text-xs">
                  <div className="truncate">
                    <span className="text-slate-800 dark:text-slate-200 font-medium">{item}</span>
                    <span className="text-[11px] text-slate-400 font-mono ml-2">
                      ({formatNum(count, lang)} {isBn ? 'জন' : 'staff'})
                    </span>
                  </div>
                  <button
                    onClick={() => handleRemove('branches', idx, item)}
                    title={isBn ? 'মুছে ফেলুন' : 'Remove'}
                    className="text-slate-400 hover:text-rose-600 p-1 rounded-md transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* DESIGNATIONS PANEL */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Briefcase className="w-4 h-4 text-blue-500" />
            <h2 className="font-bold text-sm text-slate-900 dark:text-white">
              {isBn ? 'পদবী তালিকা' : 'Designations'}
            </h2>
            <span className="ml-auto font-mono text-xs text-slate-400">
              {formatNum(designations.length, lang)}
            </span>
          </div>

          <div className="mt-3 flex gap-2">
            <input
              type="text"
              value={newDesig}
              onChange={(e) => setNewDesig(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd('designations')}
              placeholder={isBn ? 'নতুন পদবী লিখুন...' : 'New designation...'}
              className="flex-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden"
            />
            <button
              onClick={() => handleAdd('designations')}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-4 flex-1 overflow-y-auto max-h-80 divide-y divide-slate-100 dark:divide-slate-800/80">
            {designations.map((item, idx) => {
              const count = getUsageCount('designations', item);
              return (
                <div key={idx} className="py-2.5 flex items-center justify-between gap-2 text-xs">
                  <div className="truncate">
                    <span className="text-slate-800 dark:text-slate-200 font-medium">{item}</span>
                    <span className="text-[11px] text-slate-400 font-mono ml-2">
                      ({formatNum(count, lang)} {isBn ? 'জন' : 'staff'})
                    </span>
                  </div>
                  <button
                    onClick={() => handleRemove('designations', idx, item)}
                    title={isBn ? 'মুছে ফেলুন' : 'Remove'}
                    className="text-slate-400 hover:text-rose-600 p-1 rounded-md transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
