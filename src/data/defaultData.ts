import { Employee, EmailTemplate } from '../types';

export const DEFAULT_AREAS = [
  'চট্টগ্রাম সাউথ এরিয়া (Chattogram South)',
  'চট্টগ্রাম নর্থ এরিয়া (Chattogram North)',
  'পটিয়া এরিয়া (Patiya Area)',
  'আনোয়ারা এরিয়া (Anwara Area)',
  'চন্দনাইশ এরিয়া (Chandanaish Area)'
];

export const DEFAULT_BRANCHES = [
  'আনোয়ারা শাখা (Anwara)',
  'পটিয়া শাখা (Patiya)',
  'চন্দনাইশ শাখা (Chandanaish)',
  'বোয়ালখালী শাখা (Boalkhali)',
  'সাতকানিয়া শাখা (Satkania)',
  'বাঁশখালী শাখা (Banshkhali)',
  'কর্ণফুলী শাখা (Karnaphuli)',
  'চুনতি শাখা (Chunati)',
  'জোন অফিস, চট্টগ্রাম-০২ (Zone Office)'
];

export const DEFAULT_DESIGNATIONS = [
  'Zone Manager (ZM)',
  'Area Manager (AM)',
  'Branch Manager (BM)',
  'Assistant Branch Manager (ABM)',
  'Branch Accountant (BA)',
  'Field Officer (FO)',
  'Senior Field Officer (SFO)',
  'Service Staff / Office Assistant'
];

export const DEFAULT_EMAILS = [
  'sss.chattogram02@gmail.com',
  'zone.ctg2@sss-bd.org',
  'hr.zone2@sss-bd.org'
];

export const DEFAULT_TEMPLATES: Record<'en' | 'bn', EmailTemplate> = {
  en: {
    bdaySubject: 'Happy Birthday — {names} (SSS Zone Chattogram-02)',
    bdayBody: `Dear Team,

Please join us in wishing a very Happy Birthday to:

{list}

Wishing you good health, lasting happiness, and continued success in all your personal and professional endeavors. Thank you for your dedication to SSS Zone Chattogram-02!

Warm regards,
Zone In-Charge / HR
Society for Social Service (SSS)
Zone Chattogram-02`,
    annivSubject: 'Work Anniversary Congratulations — {names} (SSS Zone Chattogram-02)',
    annivBody: `Dear Colleagues,

Today we proudly celebrate the Work Anniversary of our valued team member(s):

{list}

Thank you for your tireless hard work, loyalty, and commitment to serving our communities with distinction. We look forward to achieving many more inspiring milestones together!

Warm regards,
Zone Manager
Society for Social Service (SSS)
Zone Chattogram-02`
  },
  bn: {
    bdaySubject: 'শুভ জন্মদিন — {names} (এসএসএস জোন চট্টগ্রাম-০২)',
    bdayBody: `শ্রদ্ধেয় সহকর্মীবৃন্দ,

আজকের এই বিশেষ দিনে সোসাইটি ফর সোসাল সার্ভিস (এসএসএস) জোন চট্টগ্রাম-০২ পরিবারের পক্ষ থেকে আন্তরিক শুভেচ্ছা ও অভিনন্দন জানাচ্ছি:

{list}

আপনার সুস্বাস্থ্য, দীর্ঘায়ু এবং পারিবারিক ও কর্মজীবনের সর্বাঙ্গীণ সাফল্য কামনা করছি। এসএসএস-এর অগ্রযাত্রায় আপনার অবদান প্রশংসনীয়।

শুভেচ্ছান্তে,
জোন ইন-চার্জ / এইচআর
সোসাইটি ফর সোসাল সার্ভিস (এসএসএস)
জোন চট্টগ্রাম-০২`,
    annivSubject: 'কর্মবার্ষিকীর রক্তিম শুভেচ্ছা ও অভিনন্দন — {names} (এসএসএস জোন চট্টগ্রাম-০২)',
    annivBody: `প্রিয় সহকর্মীবৃন্দ,

আজ অত্যন্ত আনন্দের সাথে জানাচ্ছি যে, এসএসএস জোন চট্টগ্রাম-০২ পরিবারে আমাদের সুযোগ্য সহকর্মীদের সফল কর্মবর্ষ পূর্তি হয়েছে:

{list}

সংস্থার উন্নয়ন ও মানবকল্যাণে আপনার একনিষ্ঠ শ্রম, সততা ও নিরলস দায়িত্বশীলতা আমাদের গর্বিত করে। আগামী দিনগুলোতেও আপনার কর্মময় সাফল্য প্রত্যাশা করছি।

শুভেচ্ছান্তে,
জোন ম্যানেজার
সোসাইটি ফর সোসাল সার্ভিস (এসএসএস)
জোন চট্টগ্রাম-০২`
  }
};

// Generate relative date string YYYY-MM-DD
function getDateString(yearOffset: number, monthOffsetFromToday: number, dayOffsetFromToday: number): string {
  const d = new Date();
  d.setDate(d.getDate() + dayOffsetFromToday);
  const y = d.getFullYear() - yearOffset;
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function generateInitialEmployees(): Employee[] {
  return [
    {
      id: 'emp-1',
      pin: '10482',
      name: 'মোহাম্মদ রাশেদুল ইসলাম',
      designation: 'Branch Manager (BM)',
      branch: 'পটিয়া শাখা (Patiya)',
      area: 'পটিয়া এরিয়া (Patiya Area)',
      mobile: '01712-345678',
      email: 'rashed.patiya@sss-bd.org',
      orgJoin: getDateString(8, 0, 0), // Today is work anniversary (8 years)
      branchJoin: getDateString(2, 0, -40),
      dob: getDateString(38, 0, 1), // Tomorrow is birthday!
      blood: 'B+',
      gender: 'Male',
      emergencyContact: '01819-112233'
    },
    {
      id: 'emp-2',
      pin: '10893',
      name: 'ফারহানা ইয়াসমিন',
      designation: 'Senior Field Officer (SFO)',
      branch: 'আনোয়ারা শাখা (Anwara)',
      area: 'আনোয়ারা এরিয়া (Anwara Area)',
      mobile: '01815-987654',
      email: 'farhana.anwara@sss-bd.org',
      orgJoin: getDateString(5, 0, -120),
      branchJoin: getDateString(1, 0, -10),
      dob: getDateString(31, 0, 0), // Today is birthday! (31st)
      blood: 'O+',
      gender: 'Female',
      emergencyContact: '01711-445566'
    },
    {
      id: 'emp-3',
      pin: '11204',
      name: 'তানভীর আহমেদ চৌধুরী',
      designation: 'Field Officer (FO)',
      branch: 'বোয়ালখালী শাখা (Boalkhali)',
      area: 'চট্টগ্রাম সাউথ এরিয়া (Chattogram South)',
      mobile: '01914-567890',
      email: 'tanvir.boalkhali@sss-bd.org',
      orgJoin: getDateString(4, 0, 0), // Today is anniversary (4 years)
      branchJoin: getDateString(1, 0, -180),
      dob: getDateString(28, 0, -50),
      blood: 'A+',
      gender: 'Male',
      emergencyContact: '01612-998877'
    },
    {
      id: 'emp-4',
      pin: '10315',
      name: 'মো: জাহিদুল করিম',
      designation: 'Area Manager (AM)',
      branch: 'জোন অফিস, চট্টগ্রাম-০২ (Zone Office)',
      area: 'চট্টগ্রাম সাউথ এরিয়া (Chattogram South)',
      mobile: '01716-123456',
      email: 'am.ctg.south@sss-bd.org',
      orgJoin: getDateString(12, 0, -90),
      branchJoin: getDateString(3, 0, -45),
      dob: getDateString(42, 0, 3), // Birthday in 3 days
      blood: 'AB+',
      gender: 'Male',
      emergencyContact: '01818-776655'
    },
    {
      id: 'emp-5',
      pin: '11540',
      name: 'নুসরাত জাহান রিয়া',
      designation: 'Branch Accountant (BA)',
      branch: 'চন্দনাইশ শাখা (Chandanaish)',
      area: 'চন্দনাইশ এরিয়া (Chandanaish Area)',
      mobile: '01822-654321',
      email: 'nusrat.chandanaish@sss-bd.org',
      orgJoin: getDateString(3, 0, 2), // Anniversary in 2 days
      branchJoin: getDateString(1, 0, -30),
      dob: getDateString(27, 0, -80),
      blood: 'O-',
      gender: 'Female',
      emergencyContact: '01919-334455'
    },
    {
      id: 'emp-6',
      pin: '10672',
      name: 'আব্দুল করিম মজুমদার',
      designation: 'Field Officer (FO)',
      branch: 'সাতকানিয়া শাখা (Satkania)',
      area: 'পটিয়া এরিয়া (Patiya Area)',
      mobile: '01718-876543',
      email: 'karim.satkania@sss-bd.org',
      orgJoin: getDateString(6, 0, -200),
      branchJoin: getDateString(2, 0, -100),
      dob: getDateString(35, 0, 5), // Birthday in 5 days
      blood: 'B+',
      gender: 'Male',
      emergencyContact: '01713-221100'
    },
    {
      id: 'emp-7',
      pin: '10101',
      name: 'এইচ. এম. নাজমুল হাসান',
      designation: 'Zone Manager (ZM)',
      branch: 'জোন অফিস, চট্টগ্রাম-০২ (Zone Office)',
      area: 'চট্টগ্রাম সাউথ এরিয়া (Chattogram South)',
      mobile: '01711-001122',
      email: 'zm.ctg02@sss-bd.org',
      orgJoin: getDateString(15, 0, -300),
      branchJoin: getDateString(4, 0, -60),
      dob: getDateString(46, 0, -150),
      blood: 'A+',
      gender: 'Male',
      emergencyContact: '01817-554433'
    },
    {
      id: 'emp-8',
      pin: '11822',
      name: 'শাহরিয়ার কবির',
      designation: 'Assistant Branch Manager (ABM)',
      branch: 'কর্ণফুলী শাখা (Karnaphuli)',
      area: 'আনোয়ারা এরিয়া (Anwara Area)',
      mobile: '01833-445566',
      email: 'shahriar.karnaphuli@sss-bd.org',
      orgJoin: getDateString(4, 0, 4), // Anniversary in 4 days
      branchJoin: getDateString(1, 0, -70),
      dob: getDateString(30, 0, -210),
      blood: 'O+',
      gender: 'Male',
      emergencyContact: '01912-887766'
    }
  ];
}
