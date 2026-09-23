import React, { useState, useMemo } from 'react';
import { Employee, Language } from '../types';
import { formatDate, calculateServiceLength, calculateAge, formatNum } from '../utils/dateUtils';
import { exportToCsv, exportToJson } from '../utils/storage';
import {
  Search,
  Filter,
  Download,
  Upload,
  UserPlus,
  Edit2,
  Trash2,
  Eye,
  Phone,
  MessageSquare,
  LayoutList,
  LayoutGrid,
  FileSpreadsheet,
  FileJson,
  RotateCcw,
  Sparkles,
  ChevronDown
} from 'lucide-react';

interface EmployeesViewProps {
  employees: Employee[];
  areas: string[];
  branches: string[];
  designations: string[];
  lang: Language;
  onAddEmployee: () => void;
  onEditEmployee: (emp: Employee) => void;
  onDeleteEmployee: (empId: string) => void;
  onViewEmployee: (emp: Employee) => void;
  onImportJson: (file: File) => void;
  onRestoreSampleData: () => void;
}

export const EmployeesView: React.FC<EmployeesViewProps> = ({
  employees,
  areas,
  branches,
  designations,
  lang,
  onAddEmployee,
  onEditEmployee,
  onDeleteEmployee,
  onViewEmployee,
  onImportJson,
  onRestoreSampleData
}) => {
  const isBn = lang === 'bn';
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedDesig, setSelectedDesig] = useState('');
  const [selectedBlood, setSelectedBlood] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [sortBy, setSortBy] = useState<'name' | 'pin' | 'orgJoin' | 'dob'>('name');
  const [sortAsc, setSortAsc] = useState(true);

  // Filtering
  const filteredEmployees = useMemo(() => {
    return employees
      .filter((emp) => {
        const query = searchTerm.toLowerCase();
        const matchesSearch =
          !query ||
          emp.name.toLowerCase().includes(query) ||
          emp.pin.toLowerCase().includes(query) ||
          emp.branch.toLowerCase().includes(query) ||
          emp.area.toLowerCase().includes(query) ||
          emp.designation.toLowerCase().includes(query) ||
          emp.mobile.toLowerCase().includes(query) ||
          (emp.blood && emp.blood.toLowerCase().includes(query));

        const matchesBranch = !selectedBranch || emp.branch === selectedBranch;
        const matchesArea = !selectedArea || emp.area === selectedArea;
        const matchesDesig = !selectedDesig || emp.designation === selectedDesig;
        const matchesBlood = !selectedBlood || emp.blood === selectedBlood;

        return matchesSearch && matchesBranch && matchesArea && matchesDesig && matchesBlood;
      })
      .sort((a, b) => {
        let comp = 0;
        if (sortBy === 'name') comp = a.name.localeCompare(b.name, isBn ? 'bn' : 'en');
        else if (sortBy === 'pin') comp = a.pin.localeCompare(b.pin);
        else if (sortBy === 'orgJoin') comp = (a.orgJoin || '').localeCompare(b.orgJoin || '');
        else if (sortBy === 'dob') comp = (a.dob || '').localeCompare(b.dob || '');
        return sortAsc ? comp : -comp;
      });
  }, [
    employees,
    searchTerm,
    selectedBranch,
    selectedArea,
    selectedDesig,
    selectedBlood,
    sortBy,
    sortAsc,
    isBn
  ]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportJson(file);
      e.target.value = '';
    }
  };

  const handleSort = (field: 'name' | 'pin' | 'orgJoin' | 'dob') => {
    if (sortBy === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(field);
      setSortAsc(true);
    }
  };

  return (
    <div className="space-y-4">
      {/* Control Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs space-y-3">
        {/* Row 1: Search, View Mode, Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={isBn ? 'নাম, পিন, শাখা, পদবী বা মোবাইল দিয়ে খুঁজুন...' : 'Search by name, PIN, branch, designation, mobile...'}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* View Mode Switcher */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setViewMode('table')}
                title={isBn ? 'টেবিল ভিউ' : 'Table View'}
                className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <LayoutList className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('cards')}
                title={isBn ? 'কার্ড ভিউ' : 'Grid Cards View'}
                className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer ${
                  viewMode === 'cards'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>

            {/* Export CSV */}
            <button
              onClick={() => exportToCsv(filteredEmployees)}
              title={isBn ? 'এক্সেল / সিএসভি ফাইল ডাউনলোড' : 'Export Excel / CSV'}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>CSV</span>
            </button>

            {/* Backup JSON */}
            <button
              onClick={() => exportToJson({ employees } as any)}
              title={isBn ? 'ব্যাকআপ ফাইল (JSON) সংরক্ষণ' : 'Backup Database (JSON)'}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium transition-colors cursor-pointer"
            >
              <FileJson className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>JSON</span>
            </button>

            {/* Import JSON */}
            <label className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium transition-colors cursor-pointer">
              <Upload className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>{isBn ? 'ইমপোর্ট' : 'Import'}</span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            {/* Add Employee */}
            <button
              onClick={onAddEmployee}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{isBn ? '+ নতুন কর্মী' : '+ Add Staff'}</span>
            </button>
          </div>
        </div>

        {/* Row 2: Secondary Dropdown Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
          {/* Branch Filter */}
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="w-full py-1.5 px-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-700 dark:text-slate-200 focus:outline-hidden"
          >
            <option value="">{isBn ? 'সকল শাখা (All Branches)' : 'All Branches'}</option>
            {branches.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>

          {/* Area Filter */}
          <select
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="w-full py-1.5 px-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-700 dark:text-slate-200 focus:outline-hidden"
          >
            <option value="">{isBn ? 'সকল এরিয়া (All Areas)' : 'All Areas'}</option>
            {areas.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>

          {/* Designation Filter */}
          <select
            value={selectedDesig}
            onChange={(e) => setSelectedDesig(e.target.value)}
            className="w-full py-1.5 px-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-700 dark:text-slate-200 focus:outline-hidden"
          >
            <option value="">{isBn ? 'সকল পদবী (All Designations)' : 'All Designations'}</option>
            {designations.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          {/* Blood Filter */}
          <select
            value={selectedBlood}
            onChange={(e) => setSelectedBlood(e.target.value)}
            className="w-full py-1.5 px-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-700 dark:text-slate-200 focus:outline-hidden"
          >
            <option value="">{isBn ? 'সকল রক্ত গ্রুপ (All Blood)' : 'All Blood Groups'}</option>
            {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((bg) => (
              <option key={bg} value={bg}>
                {bg}
              </option>
            ))}
          </select>
        </div>

        {/* Active Filter Count & Reset */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
          <div>
            <span>
              {isBn ? 'প্রদর্শিত কর্মী:' : 'Showing:'}{' '}
              <strong className="text-slate-800 dark:text-slate-200 font-mono">
                {formatNum(filteredEmployees.length, lang)}
              </strong>{' '}
              {isBn ? 'জন' : 'employees'}
            </span>
          </div>

          {(searchTerm || selectedBranch || selectedArea || selectedDesig || selectedBlood) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedBranch('');
                setSelectedArea('');
                setSelectedDesig('');
                setSelectedBlood('');
              }}
              className="text-amber-600 dark:text-amber-400 hover:underline font-medium cursor-pointer"
            >
              {isBn ? 'ফিল্টার রিসেট করুন' : 'Reset Filters'}
            </button>
          )}
        </div>
      </div>

      {/* Main Content View: Table or Cards */}
      {viewMode === 'table' ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400">
                  <th className="py-3 px-3 w-10 font-mono text-center">#</th>
                  <th
                    onClick={() => handleSort('pin')}
                    className="py-3 px-3 font-semibold cursor-pointer hover:text-slate-900 dark:hover:text-white"
                  >
                    <div className="flex items-center gap-1">
                      <span>{isBn ? 'পিন (PIN)' : 'PIN'}</span>
                      <ChevronDown className="w-3 h-3 opacity-50" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('name')}
                    className="py-3 px-3 font-semibold cursor-pointer hover:text-slate-900 dark:hover:text-white"
                  >
                    <div className="flex items-center gap-1">
                      <span>{isBn ? 'কর্মীর নাম' : 'Employee Name'}</span>
                      <ChevronDown className="w-3 h-3 opacity-50" />
                    </div>
                  </th>
                  <th className="py-3 px-3 font-semibold">{isBn ? 'পদবী' : 'Designation'}</th>
                  <th className="py-3 px-3 font-semibold">{isBn ? 'শাখা ও এরিয়া' : 'Branch & Area'}</th>
                  <th className="py-3 px-3 font-semibold">{isBn ? 'মোবাইল নম্বর' : 'Mobile'}</th>
                  <th
                    onClick={() => handleSort('orgJoin')}
                    className="py-3 px-3 font-semibold cursor-pointer hover:text-slate-900 dark:hover:text-white"
                  >
                    <div className="flex items-center gap-1">
                      <span>{isBn ? 'সংস্থায় যোগদান' : 'Org Join Date'}</span>
                      <ChevronDown className="w-3 h-3 opacity-50" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('dob')}
                    className="py-3 px-3 font-semibold cursor-pointer hover:text-slate-900 dark:hover:text-white"
                  >
                    <div className="flex items-center gap-1">
                      <span>{isBn ? 'জন্মতারিখ' : 'DOB & Age'}</span>
                      <ChevronDown className="w-3 h-3 opacity-50" />
                    </div>
                  </th>
                  <th className="py-3 px-3 font-semibold text-center">{isBn ? 'রক্ত' : 'Blood'}</th>
                  <th className="py-3 px-3 font-semibold text-right">{isBn ? 'অ্যাকশন' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center gap-2">
                        <Search className="w-8 h-8 opacity-30 text-slate-400" />
                        <span>{isBn ? 'কোনো কর্মী পাওয়া যায়নি।' : 'No employee records matched your query.'}</span>
                        {employees.length === 0 && (
                          <button
                            onClick={onRestoreSampleData}
                            className="mt-2 text-xs text-amber-600 dark:text-amber-400 underline font-medium cursor-pointer"
                          >
                            {isBn ? 'ডেমো ডেটা লোড করুন' : 'Load sample demo data'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map((emp, idx) => (
                    <tr
                      key={emp.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group"
                    >
                      <td className="py-3 px-3 font-mono tabular-nums text-center text-slate-400">
                        {formatNum(idx + 1, lang)}
                      </td>
                      <td className="py-3 px-3 font-mono font-medium text-slate-700 dark:text-slate-300">
                        {emp.pin}
                      </td>
                      <td className="py-3 px-3">
                        <button
                          onClick={() => onViewEmployee(emp)}
                          className="font-semibold text-slate-900 dark:text-slate-100 hover:text-amber-600 dark:hover:text-amber-400 text-left cursor-pointer"
                        >
                          {emp.name}
                        </button>
                      </td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-300">{emp.designation}</td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                        <div>{emp.branch}</div>
                        <div className="text-[11px] text-slate-400">{emp.area}</div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1 font-mono text-slate-700 dark:text-slate-300">
                          <span>{emp.mobile}</span>
                          <a
                            href={`tel:${emp.mobile}`}
                            title={isBn ? 'কল দিন' : 'Call'}
                            className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-0.5"
                          >
                            <Phone className="w-3 h-3" />
                          </a>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-mono text-slate-700 dark:text-slate-300">
                          {formatDate(emp.orgJoin, lang)}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {calculateServiceLength(emp.orgJoin, lang)}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-mono text-slate-700 dark:text-slate-300">
                          {formatDate(emp.dob, lang)}
                        </div>
                        <div className="text-[11px] text-slate-400">{calculateAge(emp.dob, lang)}</div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        {emp.blood && emp.blood !== 'Unknown' ? (
                          <span className="font-mono font-semibold px-1.5 py-0.5 rounded text-[11px] bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200/60 dark:border-rose-900/50">
                            {emp.blood}
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onViewEmployee(emp)}
                            title={isBn ? 'বিস্তারিত প্রোফাইল' : 'View Profile'}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-md transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onEditEmployee(emp)}
                            title={isBn ? 'সম্পাদনা' : 'Edit'}
                            className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/50 rounded-md transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteEmployee(emp.id)}
                            title={isBn ? 'মুছে ফেলুন' : 'Delete'}
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-md transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Card Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEmployees.map((emp) => (
            <div
              key={emp.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <button
                      onClick={() => onViewEmployee(emp)}
                      className="font-bold text-sm text-slate-900 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 text-left cursor-pointer"
                    >
                      {emp.name}
                    </button>
                    <div className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                      {emp.designation}
                    </div>
                  </div>
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                    {emp.pin}
                  </span>
                </div>

                <div className="mt-3 space-y-1 text-xs text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800 pt-2.5">
                  <div className="flex justify-between">
                    <span className="text-slate-400">{isBn ? 'শাখা:' : 'Branch:'}</span>
                    <span className="font-medium text-right">{emp.branch}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">{isBn ? 'মোবাইল:' : 'Mobile:'}</span>
                    <span className="font-mono">{emp.mobile}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">{isBn ? 'রক্তের গ্রুপ:' : 'Blood Group:'}</span>
                    <span className="font-mono font-semibold text-rose-600 dark:text-rose-400">
                      {emp.blood || '—'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">{isBn ? 'অভিজ্ঞতা:' : 'Service:'}</span>
                    <span className="font-mono">{calculateServiceLength(emp.orgJoin, lang)}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <a
                    href={`tel:${emp.mobile}`}
                    title={isBn ? 'সরাসরি কল দিন' : 'Call'}
                    className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href={`https://wa.me/${emp.mobile.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={isBn ? 'হোয়াটসঅ্যাপ' : 'WhatsApp'}
                    className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onViewEmployee(emp)}
                    className="p-1.5 text-slate-500 hover:text-blue-600 rounded-md cursor-pointer"
                    title={isBn ? 'প্রোফাইল দেখুন' : 'View Profile'}
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onEditEmployee(emp)}
                    className="p-1.5 text-slate-500 hover:text-amber-600 rounded-md cursor-pointer"
                    title={isBn ? 'সম্পাদনা' : 'Edit'}
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteEmployee(emp.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-600 rounded-md cursor-pointer"
                    title={isBn ? 'মুছুন' : 'Delete'}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
