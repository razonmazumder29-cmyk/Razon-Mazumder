import { Employee, MilestonePerson, Language } from '../types';

export const BN_DIGITS: Record<string, string> = {
  '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
  '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
};

export function toBnDigits(val: number | string): string {
  return String(val).replace(/[0-9]/g, (d) => BN_DIGITS[d] || d);
}

export function formatNum(val: number | string, lang: Language): string {
  if (lang === 'bn') return toBnDigits(val);
  return String(val);
}

export const BN_MONTHS = [
  'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
  'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
];

export const EN_MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export function formatDate(dateStr?: string, lang: Language = 'en'): string {
  if (!dateStr) return '—';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);

  if (isNaN(year) || isNaN(month) || isNaN(day)) return dateStr;

  if (lang === 'bn') {
    return `${toBnDigits(day)} ${BN_MONTHS[month]} ${toBnDigits(year)}`;
  }
  return `${day} ${EN_MONTHS[month]} ${year}`;
}

export function getOrdinal(n: number, lang: Language = 'en', type: 'birthday' | 'anniversary' = 'anniversary'): string {
  if (lang === 'bn') {
    if (n === 1) return '১ম';
    if (n === 2) return '২য়';
    if (n === 3) return '৩য়';
    if (n === 4) return '৪র্থ';
    return `${toBnDigits(n)}তম`;
  }
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export function calculateServiceLength(joinDateStr?: string, lang: Language = 'en'): string {
  if (!joinDateStr) return '—';
  const joinDate = new Date(joinDateStr);
  if (isNaN(joinDate.getTime())) return '—';

  const today = new Date();
  let years = today.getFullYear() - joinDate.getFullYear();
  let months = today.getMonth() - joinDate.getMonth();

  if (months < 0 || (months === 0 && today.getDate() < joinDate.getDate())) {
    years--;
    months += 12;
  }
  if (today.getDate() < joinDate.getDate()) {
    months--;
    if (months < 0) {
      years--;
      months += 11;
    }
  }

  if (lang === 'bn') {
    if (years === 0 && months === 0) return 'নতুন যোগদান';
    if (years === 0) return `${toBnDigits(months)} মাস`;
    if (months === 0) return `${toBnDigits(years)} বছর`;
    return `${toBnDigits(years)} বছর ${toBnDigits(months)} মাস`;
  }

  if (years === 0 && months === 0) return 'New Joiner';
  if (years === 0) return `${months} mo`;
  if (months === 0) return `${years} yr`;
  return `${years} yr ${months} mo`;
}

export function calculateAge(dobStr?: string, lang: Language = 'en'): string {
  if (!dobStr) return '—';
  const dob = new Date(dobStr);
  if (isNaN(dob.getTime())) return '—';

  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }

  if (lang === 'bn') {
    return `${toBnDigits(age)} বছর`;
  }
  return `${age} yrs`;
}

export function getUpcomingMilestones(
  employees: Employee[],
  type: 'birthday' | 'anniversary',
  windowDays: number = 30
): MilestonePerson[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const currentYear = today.getFullYear();
  const results: MilestonePerson[] = [];

  employees.forEach((emp) => {
    const rawDateStr = type === 'birthday' ? emp.dob : emp.orgJoin;
    if (!rawDateStr) return;

    const parts = rawDateStr.split('-');
    if (parts.length !== 3) return;
    const originYear = parseInt(parts[0], 10);
    const originMonth = parseInt(parts[1], 10) - 1;
    const originDay = parseInt(parts[2], 10);

    if (isNaN(originYear) || isNaN(originMonth) || isNaN(originDay)) return;

    // Check this year's occurrence
    let target = new Date(currentYear, originMonth, originDay);
    target.setHours(0, 0, 0, 0);

    // If already passed this year, check next year (e.g. at end of December)
    let eventYear = currentYear;
    if (target.getTime() < today.getTime()) {
      target = new Date(currentYear + 1, originMonth, originDay);
      target.setHours(0, 0, 0, 0);
      eventYear = currentYear + 1;
    }

    const diffMs = target.getTime() - today.getTime();
    const daysUntil = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (daysUntil <= windowDays) {
      const nth = eventYear - originYear;
      if (type === 'anniversary' && nth <= 0) return; // Haven't completed 1 year yet

      results.push({
        ...emp,
        nth,
        type,
        eventDate: target,
        daysUntil,
        formattedMilestone: `${nth}`
      });
    }
  });

  return results.sort((a, b) => a.daysUntil - b.daysUntil);
}
