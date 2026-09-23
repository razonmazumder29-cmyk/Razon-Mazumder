import React from 'react';
import { Employee, Language } from '../types';
import { formatDate, calculateServiceLength, calculateAge } from '../utils/dateUtils';
import {
  X,
  Phone,
  MessageSquare,
  Building2,
  MapPin,
  Calendar,
  Heart,
  Shield,
  Clock,
  Printer
} from 'lucide-react';

interface EmployeeDetailModalProps {
  employee: Employee | null;
  onClose: () => void;
  lang: Language;
}

export const EmployeeDetailModal: React.FC<EmployeeDetailModalProps> = ({
  employee,
  onClose,
  lang
}) => {
  if (!employee) return null;
  const isBn = lang === 'bn';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        {/* Top Decorative Banner */}
        <div className="bg-linear-to-r from-slate-900 via-slate-800 to-amber-950 p-5 text-white relative">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-xl shadow-inner">
                {employee.name.slice(0, 1)}
              </div>
              <div>
                <h3 className="text-base font-bold leading-tight">{employee.name}</h3>
                <div className="text-xs text-amber-300 font-medium mt-0.5">{employee.designation}</div>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                  PIN: {employee.pin}
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 text-xs">
          {/* Quick Contact Bar */}
          <div className="grid grid-cols-2 gap-2">
            <a
              href={`tel:${employee.mobile}`}
              className="flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-semibold rounded-lg transition-colors font-mono"
            >
              <Phone className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>{employee.mobile}</span>
            </a>
            <a
              href={`https://wa.me/${employee.mobile.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 font-semibold rounded-lg transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{isBn ? 'হোয়াটসঅ্যাপ' : 'WhatsApp'}</span>
            </a>
          </div>

          {/* Details Table Grid */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3.5 border border-slate-200/70 dark:border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between py-1 border-b border-slate-200/60 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" />
                <span>{isBn ? 'শাখা' : 'Branch'}</span>
              </span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{employee.branch}</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-slate-200/60 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>{isBn ? 'এরিয়া' : 'Area'}</span>
              </span>
              <span className="font-medium text-slate-800 dark:text-slate-200">{employee.area}</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-slate-200/60 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{isBn ? 'সংস্থায় যোগদান' : 'Org Joining'}</span>
              </span>
              <span className="font-mono text-slate-800 dark:text-slate-200">
                {formatDate(employee.orgJoin, lang)} ({calculateServiceLength(employee.orgJoin, lang)})
              </span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-slate-200/60 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{isBn ? 'বর্তমান শাখায় যোগদান' : 'Branch Joining'}</span>
              </span>
              <span className="font-mono text-slate-800 dark:text-slate-200">
                {formatDate(employee.branchJoin, lang)}
              </span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-slate-200/60 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{isBn ? 'জন্মতারিখ ও বয়স' : 'DOB & Age'}</span>
              </span>
              <span className="font-mono text-slate-800 dark:text-slate-200">
                {formatDate(employee.dob, lang)} ({calculateAge(employee.dob, lang)})
              </span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-slate-200/60 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-500" />
                <span>{isBn ? 'রক্তের গ্রুপ' : 'Blood Group'}</span>
              </span>
              <span className="font-mono font-bold text-rose-600 dark:text-rose-400 text-sm">
                {employee.blood || '—'}
              </span>
            </div>

            {employee.emergencyContact && (
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-amber-500" />
                  <span>{isBn ? 'জরুরি নম্বর' : 'Emergency'}</span>
                </span>
                <span className="font-mono text-slate-800 dark:text-slate-200">
                  {employee.emergencyContact}
                </span>
              </div>
            )}
          </div>

          {/* Footer Action */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{isBn ? 'প্রিন্ট করুন' : 'Print Profile'}</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 font-semibold rounded-lg text-xs cursor-pointer"
            >
              {isBn ? 'বন্ধ করুন' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
