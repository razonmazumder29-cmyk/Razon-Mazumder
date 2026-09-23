export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'O+' | 'O-' | 'AB+' | 'AB-' | 'Unknown';

export interface Employee {
  id: string;
  pin: string;
  name: string;
  designation: string;
  branch: string;
  area: string;
  mobile: string;
  email?: string;
  orgJoin: string; // YYYY-MM-DD
  branchJoin: string; // YYYY-MM-DD
  dob: string; // YYYY-MM-DD
  blood: BloodGroup | string;
  gender?: 'Male' | 'Female' | 'Other';
  emergencyContact?: string;
  notes?: string;
}

export interface MilestonePerson extends Employee {
  nth: number; // e.g. 5 for 5th anniversary or 32 for 32nd birthday
  type: 'birthday' | 'anniversary';
  eventDate: Date; // event occurrence this year
  daysUntil: number; // 0 for today, 1 for tomorrow, etc.
  formattedMilestone: string;
}

export interface EmailTemplate {
  bdaySubject: string;
  bdayBody: string;
  annivSubject: string;
  annivBody: string;
}

export type ViewTab = 'dashboard' | 'employees' | 'blood' | 'settings' | 'emails';

export type Language = 'en' | 'bn';

export type ThemeMode = 'light' | 'dark';
