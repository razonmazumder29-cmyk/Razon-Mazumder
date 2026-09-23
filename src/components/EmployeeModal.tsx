import React, { useState, useEffect } from 'react';
import { Employee, Language } from '../types';
import { X, Check } from 'lucide-react';

interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (employeeData: Partial<Employee>) => void;
  editingEmployee?: Employee | null;
  areas: string[];
  branches: string[];
  designations: string[];
  lang: Language;
}

export const EmployeeModal: React.FC<EmployeeModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingEmployee,
  areas,
  branches,
  designations,
  lang
}) => {
  const isBn = lang === 'bn';

  const [formData, setFormData] = useState<Partial<Employee>>({
    name: '',
    pin: '',
    designation: '',
    branch: '',
    area: '',
    mobile: '',
    email: '',
    orgJoin: '',
    branchJoin: '',
    dob: '',
    blood: 'B+',
    emergencyContact: ''
  });

  useEffect(() => {
    if (editingEmployee) {
      setFormData(editingEmployee);
    } else {
      setFormData({
        name: '',
        pin: '',
        designation: designations[0] || '',
        branch: branches[0] || '',
        area: areas[0] || '',
        mobile: '',
        email: '',
        orgJoin: new Date().toISOString().slice(0, 10),
        branchJoin: new Date().toISOString().slice(0, 10),
        dob: '1995-01-01',
        blood: 'B+',
        emergencyContact: ''
      });
    }
  }, [editingEmployee, isOpen, designations, branches, areas]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      alert(isBn ? 'কর্মীর নাম আবশ্যক।' : 'Employee name is required.');
      return;
    }
    if (!formData.pin?.trim()) {
      alert(isBn ? 'পিন নম্বর আবশ্যক।' : 'PIN is required.');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {editingEmployee
                ? isBn
                  ? 'কর্মী তথ্য সম্পাদনা'
                  : 'Edit Employee Record'
                : isBn
                ? 'নতুন কর্মী যুক্ত করুন'
                : 'Add New Employee'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isBn
                ? 'সোসাইটি ফর সোসাল সার্ভিস — জোন চট্টগ্রাম-০২'
                : 'Society for Social Service — Zone Chattogram-02'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {isBn ? 'কর্মীর পূর্ণ নাম *' : 'Employee Full Name *'}
              </label>
              <input
                type="text"
                required
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={isBn ? 'যেমন: মোহাম্মদ রাশেদুল ইসলাম' : 'e.g. Mohammad Rashedul Islam'}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
              />
            </div>

            {/* PIN */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {isBn ? 'পিন নম্বর (PIN) *' : 'PIN Number *'}
              </label>
              <input
                type="text"
                required
                value={formData.pin || ''}
                onChange={(e) => setFormData({ ...formData, pin: e.target.value })}
                placeholder="10482"
                className="w-full px-3 py-2 font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
              />
            </div>

            {/* Designation */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {isBn ? 'পদবী (Designation)' : 'Designation'}
              </label>
              <select
                value={formData.designation || ''}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30"
              >
                {designations.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Branch */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {isBn ? 'শাখা (Branch)' : 'Branch'}
              </label>
              <select
                value={formData.branch || ''}
                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30"
              >
                {branches.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            {/* Area */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {isBn ? 'এরিয়া (Area)' : 'Area'}
              </label>
              <select
                value={formData.area || ''}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30"
              >
                {areas.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>

            {/* Mobile */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {isBn ? 'মোবাইল নম্বর *' : 'Mobile Number *'}
              </label>
              <input
                type="text"
                required
                value={formData.mobile || ''}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                placeholder="01712-345678"
                className="w-full px-3 py-2 font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
              />
            </div>

            {/* Blood Group */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {isBn ? 'রক্তের গ্রুপ (Blood Group)' : 'Blood Group'}
              </label>
              <select
                value={formData.blood || 'B+'}
                onChange={(e) => setFormData({ ...formData, blood: e.target.value })}
                className="w-full px-3 py-2 font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30"
              >
                {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-', 'Unknown'].map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>

            {/* Org Join Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {isBn ? 'সংস্থায় যোগদানের তারিখ (Org Join)' : 'Org Join Date'}
              </label>
              <input
                type="date"
                value={formData.orgJoin || ''}
                onChange={(e) => setFormData({ ...formData, orgJoin: e.target.value })}
                className="w-full px-3 py-2 font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30"
              />
            </div>

            {/* Branch Join Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {isBn ? 'বর্তমান শাখায় যোগদানের তারিখ' : 'Branch Join Date'}
              </label>
              <input
                type="date"
                value={formData.branchJoin || ''}
                onChange={(e) => setFormData({ ...formData, branchJoin: e.target.value })}
                className="w-full px-3 py-2 font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30"
              />
            </div>

            {/* DOB */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {isBn ? 'জন্মতারিখ (Date of Birth)' : 'Date of Birth'}
              </label>
              <input
                type="date"
                value={formData.dob || ''}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                className="w-full px-3 py-2 font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30"
              />
            </div>

            {/* Emergency Contact */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {isBn ? 'জরুরি যোগাযোগের নম্বর' : 'Emergency Contact'}
              </label>
              <input
                type="text"
                value={formData.emergencyContact || ''}
                onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                placeholder="01819-112233"
                className="w-full px-3 py-2 font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-lg transition-colors cursor-pointer"
            >
              {isBn ? 'বাতিল' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isBn ? 'সংরক্ষণ করুন' : 'Save Record'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
