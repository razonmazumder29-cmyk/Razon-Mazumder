import React, { useState } from 'react';
import { Employee, Language } from '../types';
import { formatNum } from '../utils/dateUtils';
import {
  Droplet,
  Phone,
  MessageSquare,
  Search,
  Building2,
  AlertCircle
} from 'lucide-react';

interface BloodGroupViewProps {
  employees: Employee[];
  lang: Language;
  onViewEmployee: (emp: Employee) => void;
}

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

export const BloodGroupView: React.FC<BloodGroupViewProps> = ({
  employees,
  lang,
  onViewEmployee
}) => {
  const isBn = lang === 'bn';
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [searchBranch, setSearchBranch] = useState<string>('');

  // Group statistics
  const stats = BLOOD_GROUPS.reduce((acc, bg) => {
    acc[bg] = employees.filter((e) => e.blood === bg).length;
    return acc;
  }, {} as Record<string, number>);

  const filteredDonors = employees.filter((e) => {
    if (!e.blood || e.blood === 'Unknown') return false;
    const matchesGroup = selectedGroup === 'all' || e.blood === selectedGroup;
    const matchesBranch =
      !searchBranch ||
      e.branch.toLowerCase().includes(searchBranch.toLowerCase()) ||
      e.name.toLowerCase().includes(searchBranch.toLowerCase());
    return matchesGroup && matchesBranch;
  });

  const handleUrgentBloodRequest = (emp: Employee) => {
    const rawNum = emp.mobile.replace(/[^0-9]/g, '');
    const cleanNum = rawNum.startsWith('0') ? '88' + rawNum : rawNum;
    const msg = isBn
      ? `আসসালামু আলাইকুম ${emp.name} ভাই/আপু, এসএসএস জোন চট্টগ্রাম-০২ পরিবারে জরুরি ভিত্তিতে ${emp.blood} রক্তের প্রয়োজন দেখা দিয়েছে। আপনি কি রক্তদানে আগ্রহী বা সুবিধাজনক অবস্থানে আছেন? অনুগ্রহ করে জানাবেন। ধন্যবাদ!`
      : `Hello ${emp.name}, there is an urgent requirement for ${emp.blood} blood in SSS Zone Chattogram-02. Would you be available or able to donate? Please let us know. Thank you!`;

    window.open(`https://wa.me/${cleanNum}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Top Explanation Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
            <Droplet className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">
              {isBn ? 'জরুরি রক্তের গ্রুপ ও ডোনার ডিরেক্টরি' : 'Emergency Blood Donors Directory'}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              {isBn
                ? 'সহকর্মী বা তাদের পরিবারের জরুরি চিকিৎসার প্রয়োজনে রক্তদাতা খুঁজতে নিচের গ্রুপ সিলেক্ট করে এক ক্লিকে কল বা হোয়াটসঅ্যাপে বার্তা পাঠান।'
                : 'In medical emergencies for staff or family members, select a blood group below to instantly locate and contact eligible donors.'}
            </p>
          </div>
        </div>

        {/* Blood Group Selector Chips */}
        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => setSelectedGroup('all')}
            className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer ${
              selectedGroup === 'all'
                ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="text-xs font-bold">{isBn ? 'সকল গ্রুপ' : 'All'}</div>
            <div className="text-[11px] font-mono opacity-80 mt-0.5">
              {formatNum(employees.filter((e) => e.blood && e.blood !== 'Unknown').length, lang)}
            </div>
          </button>

          {BLOOD_GROUPS.map((bg) => {
            const count = stats[bg] || 0;
            const isSelected = selectedGroup === bg;
            return (
              <button
                key={bg}
                onClick={() => setSelectedGroup(bg)}
                className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="text-sm font-extrabold font-mono">{bg}</div>
                <div className="text-[11px] font-mono opacity-80 mt-0.5">
                  {formatNum(count, lang)} {isBn ? 'জন' : ''}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter / Search within Donors */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchBranch}
            onChange={(e) => setSearchBranch(e.target.value)}
            placeholder={isBn ? 'শাখা বা কর্মীর নাম দিয়ে খুঁজুন...' : 'Filter by branch or name...'}
            className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden"
          />
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400">
          {isBn ? 'উপলব্ধ ডোনার:' : 'Available donors:'}{' '}
          <strong className="font-mono text-slate-900 dark:text-white">
            {formatNum(filteredDonors.length, lang)}
          </strong>{' '}
          {isBn ? 'জন' : ''}
        </div>
      </div>

      {/* Donors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDonors.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            <AlertCircle className="w-8 h-8 opacity-30 mx-auto text-rose-400 mb-2" />
            <p className="text-xs">
              {isBn
                ? 'এই গ্রুপের জন্য কোনো ডোনার তথ্য পাওয়া যায়নি।'
                : 'No registered donors found for this blood group selection.'}
            </p>
          </div>
        ) : (
          filteredDonors.map((emp) => (
            <div
              key={emp.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <button
                      onClick={() => onViewEmployee(emp)}
                      className="font-bold text-sm text-slate-900 dark:text-white hover:text-rose-600 dark:hover:text-rose-400 text-left cursor-pointer"
                    >
                      {emp.name}
                    </button>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {emp.designation}
                    </div>
                  </div>

                  <span className="w-10 h-10 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 font-mono font-extrabold text-sm flex items-center justify-center shrink-0">
                    {emp.blood}
                  </span>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{emp.branch}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{emp.mobile}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <a
                  href={`tel:${emp.mobile}`}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-medium rounded-lg text-xs transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-blue-600" />
                  <span>{isBn ? 'কল দিন' : 'Call'}</span>
                </a>
                <button
                  onClick={() => handleUrgentBloodRequest(emp)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-lg text-xs transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{isBn ? 'বার্তা দিন' : 'Request'}</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
