/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ViewTab, Language, Employee, EmailTemplate } from './types';
import { loadInitialState, saveState, AppState } from './utils/storage';
import { generateInitialEmployees } from './data/defaultData';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { EmployeesView } from './components/EmployeesView';
import { BloodGroupView } from './components/BloodGroupView';
import { SettingsView } from './components/SettingsView';
import { EmailTemplatesView } from './components/EmailTemplatesView';
import { EmployeeModal } from './components/EmployeeModal';
import { EmployeeDetailModal } from './components/EmployeeDetailModal';

export default function App() {
  const [state, setState] = useState<AppState>(() => loadInitialState());
  const [activeTab, setActiveTab] = useState<ViewTab>('dashboard');
  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem('sss_lang_v2') as Language) || 'bn';
  });
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('sss_theme_v2') === 'dark';
  });

  // Modals
  const [isEmpModalOpen, setIsEmpModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [viewingEmployee, setViewingEmployee] = useState<Employee | null>(null);

  // Sync theme
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('sss_theme_v2', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('sss_theme_v2', 'light');
    }
  }, [darkMode]);

  // Sync lang
  useEffect(() => {
    localStorage.setItem('sss_lang_v2', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  // Sync data changes to localStorage
  useEffect(() => {
    saveState(state);
  }, [state]);

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'bn' ? 'en' : 'bn'));
  };

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
  };

  // Employee CRUD
  const handleOpenAddModal = () => {
    setEditingEmployee(null);
    setIsEmpModalOpen(true);
  };

  const handleOpenEditModal = (emp: Employee) => {
    setEditingEmployee(emp);
    setIsEmpModalOpen(true);
  };

  const handleSaveEmployee = (empData: Partial<Employee>) => {
    if (editingEmployee) {
      // Update existing
      setState((prev) => ({
        ...prev,
        employees: prev.employees.map((e) =>
          e.id === editingEmployee.id ? ({ ...e, ...empData } as Employee) : e
        )
      }));
    } else {
      // Create new
      const newEmp: Employee = {
        id: `emp-${Date.now()}`,
        pin: empData.pin || '',
        name: empData.name || '',
        designation: empData.designation || '',
        branch: empData.branch || '',
        area: empData.area || '',
        mobile: empData.mobile || '',
        email: empData.email || '',
        orgJoin: empData.orgJoin || '',
        branchJoin: empData.branchJoin || '',
        dob: empData.dob || '',
        blood: empData.blood || 'Unknown',
        emergencyContact: empData.emergencyContact || ''
      };
      setState((prev) => ({
        ...prev,
        employees: [newEmp, ...prev.employees]
      }));
    }
    setIsEmpModalOpen(false);
  };

  const handleDeleteEmployee = (empId: string) => {
    const target = state.employees.find((e) => e.id === empId);
    const confirmMsg =
      lang === 'bn'
        ? `আপনি কি সত্যিই "${target?.name}"-এর তথ্য মুছে ফেলতে চান?`
        : `Are you sure you want to delete "${target?.name}"?`;

    if (window.confirm(confirmMsg)) {
      setState((prev) => ({
        ...prev,
        employees: prev.employees.filter((e) => e.id !== empId)
      }));
    }
  };

  // Dropdown options management
  const handleAddOption = (type: 'areas' | 'branches' | 'designations', val: string) => {
    setState((prev) => {
      if (prev[type].includes(val)) return prev;
      return {
        ...prev,
        [type]: [...prev[type], val]
      };
    });
  };

  const handleRemoveOption = (type: 'areas' | 'branches' | 'designations', index: number) => {
    setState((prev) => {
      const copy = [...prev[type]];
      copy.splice(index, 1);
      return {
        ...prev,
        [type]: copy
      };
    });
  };

  // Emails management
  const handleAddEmail = (email: string) => {
    setState((prev) => {
      if (prev.emails.includes(email)) return prev;
      return {
        ...prev,
        emails: [...prev.emails, email]
      };
    });
  };

  const handleRemoveEmail = (index: number) => {
    setState((prev) => {
      const copy = [...prev.emails];
      copy.splice(index, 1);
      return {
        ...prev,
        emails: copy
      };
    });
  };

  const handleUpdateTemplates = (newTemplates: Record<'en' | 'bn', EmailTemplate>) => {
    setState((prev) => ({
      ...prev,
      templates: newTemplates
    }));
  };

  const handleImportJson = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string);
        if (parsed.employees && Array.isArray(parsed.employees)) {
          setState((prev) => ({
            ...prev,
            employees: parsed.employees,
            areas: parsed.areas || prev.areas,
            branches: parsed.branches || prev.branches,
            designations: parsed.designations || prev.designations,
            emails: parsed.emails || prev.emails,
            templates: parsed.templates || prev.templates
          }));
          alert(
            lang === 'bn'
              ? 'সফলভাবে ডেটাবেজ ইমপোর্ট সম্পন্ন হয়েছে!'
              : 'Database successfully imported!'
          );
        } else {
          alert(lang === 'bn' ? 'অকার্যকর ব্যাকআপ ফাইল।' : 'Invalid JSON database file structure.');
        }
      } catch (err) {
        alert(lang === 'bn' ? 'ফাইল পড়তে সমস্যা হয়েছে।' : 'Error parsing JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const handleRestoreSampleData = () => {
    const confirmMsg =
      lang === 'bn'
        ? 'আপনি কি জোন চট্টগ্রাম-০২-এর ডেমো ডেটা লোড করতে চান?'
        : 'Load sample employee records for Zone Chattogram-02?';
    if (window.confirm(confirmMsg)) {
      setState((prev) => ({
        ...prev,
        employees: generateInitialEmployees()
      }));
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        lang={lang}
        onToggleLang={toggleLanguage}
        darkMode={darkMode}
        onToggleTheme={toggleTheme}
        onOpenAddModal={handleOpenAddModal}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            employees={state.employees}
            branches={state.branches}
            emails={state.emails}
            templates={state.templates}
            lang={lang}
            onOpenEmployeeDetail={(emp) => setViewingEmployee(emp)}
            onSelectTab={setActiveTab}
          />
        )}

        {activeTab === 'employees' && (
          <EmployeesView
            employees={state.employees}
            areas={state.areas}
            branches={state.branches}
            designations={state.designations}
            lang={lang}
            onAddEmployee={handleOpenAddModal}
            onEditEmployee={handleOpenEditModal}
            onDeleteEmployee={handleDeleteEmployee}
            onViewEmployee={(emp) => setViewingEmployee(emp)}
            onImportJson={handleImportJson}
            onRestoreSampleData={handleRestoreSampleData}
          />
        )}

        {activeTab === 'blood' && (
          <BloodGroupView
            employees={state.employees}
            lang={lang}
            onViewEmployee={(emp) => setViewingEmployee(emp)}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            areas={state.areas}
            branches={state.branches}
            designations={state.designations}
            employees={state.employees}
            lang={lang}
            onAddOption={handleAddOption}
            onRemoveOption={handleRemoveOption}
          />
        )}

        {activeTab === 'emails' && (
          <EmailTemplatesView
            emails={state.emails}
            templates={state.templates}
            lang={lang}
            onAddEmail={handleAddEmail}
            onRemoveEmail={handleRemoveEmail}
            onUpdateTemplates={handleUpdateTemplates}
          />
        )}
      </main>

      {/* Modals */}
      <EmployeeModal
        isOpen={isEmpModalOpen}
        onClose={() => setIsEmpModalOpen(false)}
        onSave={handleSaveEmployee}
        editingEmployee={editingEmployee}
        areas={state.areas}
        branches={state.branches}
        designations={state.designations}
        lang={lang}
      />

      <EmployeeDetailModal
        employee={viewingEmployee}
        onClose={() => setViewingEmployee(null)}
        lang={lang}
      />

      {/* Clean Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 py-4 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <span>
              {lang === 'bn'
                ? 'সোসাইটি ফর সোসাল সার্ভিস (এসএসএস) — জোন চট্টগ্রাম-০২'
                : 'Society for Social Service (SSS) — Zone Chattogram-02'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRestoreSampleData}
              className="hover:text-amber-600 dark:hover:text-amber-400 underline cursor-pointer"
            >
              {lang === 'bn' ? 'ডেমো ডেটা রিলোড' : 'Reload Demo Data'}
            </button>
            <span>·</span>
            <span>
              {lang === 'bn' ? 'ডাটা ব্রাউজারে সুরক্ষিত সংরক্ষিত' : 'Stored locally in browser'}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
