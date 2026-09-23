import { Employee, EmailTemplate } from '../types';
import {
  DEFAULT_AREAS,
  DEFAULT_BRANCHES,
  DEFAULT_DESIGNATIONS,
  DEFAULT_EMAILS,
  DEFAULT_TEMPLATES,
  generateInitialEmployees
} from '../data/defaultData';

const KEYS = {
  EMPLOYEES: 'sss_employees_v2',
  AREAS: 'sss_areas_v2',
  BRANCHES: 'sss_branches_v2',
  DESIGNATIONS: 'sss_designations_v2',
  EMAILS: 'sss_emails_v2',
  TEMPLATES: 'sss_templates_v2',
  LANG: 'sss_lang_v2',
  THEME: 'sss_theme_v2'
};

export interface AppState {
  employees: Employee[];
  areas: string[];
  branches: string[];
  designations: string[];
  emails: string[];
  templates: Record<'en' | 'bn', EmailTemplate>;
}

export function loadInitialState(): AppState {
  try {
    const rawEmps = localStorage.getItem(KEYS.EMPLOYEES);
    const rawAreas = localStorage.getItem(KEYS.AREAS);
    const rawBranches = localStorage.getItem(KEYS.BRANCHES);
    const rawDesigs = localStorage.getItem(KEYS.DESIGNATIONS);
    const rawEmails = localStorage.getItem(KEYS.EMAILS);
    const rawTemplates = localStorage.getItem(KEYS.TEMPLATES);

    return {
      employees: rawEmps ? JSON.parse(rawEmps) : generateInitialEmployees(),
      areas: rawAreas ? JSON.parse(rawAreas) : DEFAULT_AREAS,
      branches: rawBranches ? JSON.parse(rawBranches) : DEFAULT_BRANCHES,
      designations: rawDesigs ? JSON.parse(rawDesigs) : DEFAULT_DESIGNATIONS,
      emails: rawEmails ? JSON.parse(rawEmails) : DEFAULT_EMAILS,
      templates: rawTemplates ? JSON.parse(rawTemplates) : DEFAULT_TEMPLATES
    };
  } catch (err) {
    console.error('Error reading localStorage, using defaults', err);
    return {
      employees: generateInitialEmployees(),
      areas: DEFAULT_AREAS,
      branches: DEFAULT_BRANCHES,
      designations: DEFAULT_DESIGNATIONS,
      emails: DEFAULT_EMAILS,
      templates: DEFAULT_TEMPLATES
    };
  }
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(KEYS.EMPLOYEES, JSON.stringify(state.employees));
    localStorage.setItem(KEYS.AREAS, JSON.stringify(state.areas));
    localStorage.setItem(KEYS.BRANCHES, JSON.stringify(state.branches));
    localStorage.setItem(KEYS.DESIGNATIONS, JSON.stringify(state.designations));
    localStorage.setItem(KEYS.EMAILS, JSON.stringify(state.emails));
    localStorage.setItem(KEYS.TEMPLATES, JSON.stringify(state.templates));
  } catch (err) {
    console.error('Storage write error', err);
  }
}

export function exportToJson(state: AppState): void {
  const dataStr = JSON.stringify(state, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const dateStr = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `sss-zone-chattogram-02-backup-${dateStr}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportToCsv(employees: Employee[]): void {
  const headers = [
    'SL',
    'PIN',
    'Name',
    'Designation',
    'Branch',
    'Area',
    'Mobile',
    'Email',
    'Org Join Date',
    'Branch Join Date',
    'Date of Birth',
    'Blood Group',
    'Emergency Contact'
  ];

  const escapeCsv = (val?: string) => {
    if (!val) return '""';
    return `"${val.replace(/"/g, '""')}"`;
  };

  const rows = employees.map((emp, idx) => [
    idx + 1,
    escapeCsv(emp.pin),
    escapeCsv(emp.name),
    escapeCsv(emp.designation),
    escapeCsv(emp.branch),
    escapeCsv(emp.area),
    escapeCsv(emp.mobile),
    escapeCsv(emp.email),
    escapeCsv(emp.orgJoin),
    escapeCsv(emp.branchJoin),
    escapeCsv(emp.dob),
    escapeCsv(emp.blood),
    escapeCsv(emp.emergencyContact)
  ].join(','));

  // UTF-8 BOM \uFEFF ensures Excel displays Bengali characters cleanly
  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const dateStr = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `sss-staff-directory-${dateStr}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
