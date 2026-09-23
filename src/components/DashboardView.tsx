import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Employee, MilestonePerson, EmailTemplate, Language } from '../types';
import { getUpcomingMilestones, getOrdinal, formatDate, formatNum, toBnDigits } from '../utils/dateUtils';
import {
  Cake,
  Award,
  Calendar,
  Send,
  Mail,
  Copy,
  Check,
  Phone,
  MessageSquare,
  Users,
  Building2,
  ExternalLink,
  Sparkles,
  Clock
} from 'lucide-react';

interface DashboardViewProps {
  employees: Employee[];
  branches: string[];
  emails: string[];
  templates: Record<'en' | 'bn', EmailTemplate>;
  lang: Language;
  onOpenEmployeeDetail: (emp: Employee) => void;
  onSelectTab: (tab: any) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  employees,
  branches,
  emails,
  templates,
  lang,
  onOpenEmployeeDetail,
  onSelectTab
}) => {
  const isBn = lang === 'bn';
  const [activeScope, setActiveScope] = useState<'today' | 'tomorrow' | 'week' | 'month'>('today');
  const [copiedType, setCopiedType] = useState<string | null>(null);

  // Calculate milestones
  const allBirthdays = getUpcomingMilestones(employees, 'birthday', 31);
  const allAnniversaries = getUpcomingMilestones(employees, 'anniversary', 31);

  const filterByScope = (list: MilestonePerson[]) => {
    if (activeScope === 'today') return list.filter((p) => p.daysUntil === 0);
    if (activeScope === 'tomorrow') return list.filter((p) => p.daysUntil === 1);
    if (activeScope === 'week') return list.filter((p) => p.daysUntil <= 7);
    return list; // 'month'
  };

  const currentBirthdays = filterByScope(allBirthdays);
  const currentAnniversaries = filterByScope(allAnniversaries);

  const todayBdayCount = allBirthdays.filter((p) => p.daysUntil === 0).length;
  const todayAnnivCount = allAnniversaries.filter((p) => p.daysUntil === 0).length;
  const next7DaysCount = [
    ...allBirthdays.filter((p) => p.daysUntil > 0 && p.daysUntil <= 7),
    ...allAnniversaries.filter((p) => p.daysUntil > 0 && p.daysUntil <= 7)
  ].length;

  const triggerCelebration = () => {
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  // Compose text
  const composeGreeting = (kind: 'birthday' | 'anniversary', list: MilestonePerson[]) => {
    const template = templates[lang];
    const names = list.map((p) => p.name).join(', ');
    const listFormatted = list
      .map((p) => {
        const ord = getOrdinal(p.nth, lang, kind);
        const milestoneText =
          kind === 'birthday'
            ? isBn
              ? `${ord} জন্মদিন`
              : `${ord} Birthday`
            : isBn
              ? `${ord} কর্মবর্ষ পূর্তি`
              : `${ord} Work Anniversary`;
        return `• ${p.name} (${milestoneText}, ${p.designation}, ${p.branch}) [Mobile: ${p.mobile}]`;
      })
      .join('\n');

    let subject = kind === 'birthday' ? template.bdaySubject : template.annivSubject;
    let body = kind === 'birthday' ? template.bdayBody : template.annivBody;

    subject = subject.replace('{names}', names);
    body = body.replace('{names}', names).replace('{list}', listFormatted);

    return { subject, body };
  };

  const handleSendOutlook = (kind: 'birthday' | 'anniversary', list: MilestonePerson[]) => {
    if (!list.length) {
      alert(isBn ? 'আজকে পাঠানোর মতো কোনো কর্মী নেই।' : 'No colleagues found for this period.');
      return;
    }
    if (!emails.length) {
      alert(isBn ? 'দয়া করে আগে ইমেইল তালিকায় জোনের ঠিকানা যুক্ত করুন।' : 'Please add zone email recipients in the Email tab first.');
      onSelectTab('emails');
      return;
    }

    triggerCelebration();
    const { subject, body } = composeGreeting(kind, list);
    const to = emails.join(';');
    const owaUrl = `https://outlook.office.com/mail/deeplink/compose?to=${encodeURIComponent(to)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(owaUrl, '_blank', 'noopener,noreferrer');
  };

  const handleSendGmail = (kind: 'birthday' | 'anniversary', list: MilestonePerson[]) => {
    if (!list.length) {
      alert(isBn ? 'কোনো কর্মী নেই।' : 'No colleagues found for this period.');
      return;
    }
    if (!emails.length) {
      alert(isBn ? 'দয়া করে আগে ইমেইল তালিকায় জোনের ঠিকানা যুক্ত করুন।' : 'Please add zone email recipients in the Email tab first.');
      onSelectTab('emails');
      return;
    }

    triggerCelebration();
    const { subject, body } = composeGreeting(kind, list);
    const to = emails.join(',');
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(gmailUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopy = (kind: 'birthday' | 'anniversary', list: MilestonePerson[]) => {
    if (!list.length) return;
    const { subject, body } = composeGreeting(kind, list);
    const textToCopy = `Subject: ${subject}\n\n${body}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopiedType(kind);
      triggerCelebration();
      setTimeout(() => setCopiedType(null), 3000);
    });
  };

  const handleDirectWish = (p: MilestonePerson, platform: 'whatsapp' | 'call') => {
    const rawNum = p.mobile.replace(/[^0-9]/g, '');
    const cleanNum = rawNum.startsWith('0') ? '88' + rawNum : rawNum;

    if (platform === 'call') {
      window.location.href = `tel:${p.mobile}`;
      return;
    }

    triggerCelebration();
    const wish =
      p.type === 'birthday'
        ? isBn
          ? `শুভ জন্মদিন ${p.name}! এসএসএস জোন চট্টগ্রাম-০২ পরিবারের পক্ষ থেকে আপনার সুস্বাস্থ্য, দীর্ঘায়ু ও সাফল্য কামনা করছি।`
          : `Happy Birthday ${p.name}! Wishing you good health, happiness and success on behalf of SSS Zone Chattogram-02.`
        : isBn
          ? `কর্মবর্ষ পূর্তির রক্তিম শুভেচ্ছা ${p.name}! এসএসএস-এ আপনার ${getOrdinal(p.nth, 'bn')} বছর সফলভাবে পূরণের জন্য অভিনন্দন ও আন্তরিক শুভকামনা।`
          : `Congratulations on your ${getOrdinal(p.nth, 'en')} Work Anniversary at SSS, ${p.name}! Wishing you continued success!`;

    const waUrl = `https://wa.me/${cleanNum}?text=${encodeURIComponent(wish)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const todayStr = new Date().toLocaleDateString(isBn ? 'bn-BD' : 'en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Metrics */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800/80">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400">
              <Calendar className="w-3.5 h-3.5" />
              <span>{todayStr}</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
              {isBn ? 'মাইলস্টোন সতর্কতা ও শুভেচ্ছা কেন্দ্র' : 'Milestone Alerts & Greetings Hub'}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {isBn
                ? 'জোন চট্টগ্রাম-০২-এর কর্মীদের জন্মদিন ও কর্মবার্ষিকী এক ক্লিকে আউটলুক/জিমেলে পাঠান।'
                : 'Send instant personalized Outlook & Gmail milestone greetings to all zone staff.'}
            </p>
          </div>

          {/* Scope Switcher Tabs */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg self-start md:self-auto">
            <button
              onClick={() => setActiveScope('today')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeScope === 'today'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {isBn ? 'আজকে' : 'Today'}
            </button>
            <button
              onClick={() => setActiveScope('tomorrow')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeScope === 'tomorrow'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {isBn ? 'আগামীকাল' : 'Tomorrow'}
            </button>
            <button
              onClick={() => setActiveScope('week')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeScope === 'week'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {isBn ? 'আগামী ৭ দিন' : 'Next 7 Days'}
            </button>
            <button
              onClick={() => setActiveScope('month')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeScope === 'month'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {isBn ? 'চলতি মাস' : 'This Month'}
            </button>
          </div>
        </div>

        {/* 4 Stat Indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">{isBn ? 'মোট কর্মী' : 'Total Staff'}</div>
              <div className="text-lg font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                {formatNum(employees.length, lang)} {isBn ? 'জন' : ''}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">{isBn ? 'মোট শাখা' : 'Branches'}</div>
              <div className="text-lg font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                {formatNum(branches.length, lang)} {isBn ? 'টি' : ''}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/70 dark:border-rose-900/30">
            <div className="w-10 h-10 rounded-lg bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <Cake className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">{isBn ? 'আজ জন্মদিন' : "Today's Birthdays"}</div>
              <div className="text-lg font-bold font-mono tabular-nums text-rose-600 dark:text-rose-400">
                {formatNum(todayBdayCount, lang)} {isBn ? 'জন' : ''}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-teal-50/50 dark:bg-teal-950/20 border border-teal-200/70 dark:border-teal-900/30">
            <div className="w-10 h-10 rounded-lg bg-teal-500/15 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">{isBn ? 'আজ কর্মবার্ষিকী' : "Today's Anniv."}</div>
              <div className="text-lg font-bold font-mono tabular-nums text-teal-600 dark:text-teal-400">
                {formatNum(todayAnnivCount, lang)} {isBn ? 'জন' : ''}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dual Panels: Birthdays & Anniversaries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* BIRTHDAY PANEL */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-linear-to-r from-rose-500/5 to-transparent flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <Cake className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900 dark:text-white text-base">
                  {isBn ? 'জন্মদিনের শুভেচ্ছা' : 'Birthday Celebrations'}
                </h2>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {isBn
                    ? `${formatNum(currentBirthdays.length, lang)} জন কর্মী (${
                        activeScope === 'today'
                          ? 'আজকে'
                          : activeScope === 'tomorrow'
                          ? 'আগামীকাল'
                          : activeScope === 'week'
                          ? 'আগামী ৭ দিনে'
                          : 'চলতি মাসে'
                      })`
                    : `${currentBirthdays.length} staff (${activeScope})`}
                </div>
              </div>
            </div>

            {currentBirthdays.length > 0 && (
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300">
                {formatNum(currentBirthdays.length, lang)}
              </span>
            )}
          </div>

          {/* Body List */}
          <div className="p-4 sm:p-5 flex-1 divide-y divide-slate-100 dark:divide-slate-800">
            {currentBirthdays.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
                <Cake className="w-8 h-8 opacity-30 text-rose-400" />
                <span>
                  {isBn
                    ? 'এই নির্বাচিত সময়ে কারো জন্মদিন নেই।'
                    : 'No birthdays scheduled for this selected period.'}
                </span>
              </div>
            ) : (
              currentBirthdays.map((p) => {
                const ord = getOrdinal(p.nth, lang, 'birthday');
                return (
                  <div key={p.id} className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onOpenEmployeeDetail(p)}
                          className="font-semibold text-sm text-slate-900 dark:text-slate-100 hover:text-amber-600 dark:hover:text-amber-400 truncate text-left cursor-pointer"
                        >
                          {p.name}
                        </button>
                        <span className="text-xs font-medium text-rose-600 dark:text-rose-400 font-mono">
                          {ord} {isBn ? 'জন্মদিন' : 'Birthday'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                        <span>{p.designation}</span>
                        <span>·</span>
                        <span>{p.branch}</span>
                        {p.daysUntil > 0 && (
                          <>
                            <span>·</span>
                            <span className="text-amber-600 dark:text-amber-400 font-mono">
                              {p.daysUntil === 1
                                ? isBn
                                  ? 'আগামীকাল'
                                  : 'Tomorrow'
                                : isBn
                                ? `${toBnDigits(p.daysUntil)} দিন পর`
                                : `in ${p.daysUntil} days`}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Quick Direct Actions */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleDirectWish(p, 'whatsapp')}
                        title={isBn ? 'হোয়াটসঅ্যাপে শুভেচ্ছা পাঠান' : 'Wish on WhatsApp'}
                        className="p-1.5 rounded-md hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 transition-colors"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDirectWish(p, 'call')}
                        title={isBn ? 'সরাসরি কল দিন' : 'Call Staff'}
                        className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                      >
                        <Phone className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Action Footer */}
          {currentBirthdays.length > 0 && (
            <div className="p-4 bg-slate-50 dark:bg-slate-900/70 border-t border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>{isBn ? 'জোন মেইল গ্রুপে পাঠান:' : 'Dispatch to Zone List:'}</span>
                <span className="font-mono text-slate-600 dark:text-slate-300">
                  {emails.length} {isBn ? 'টি প্রাপক' : 'recipients'}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleSendOutlook('birthday', currentBirthdays)}
                  className="flex-1 min-w-[130px] flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-500 active:scale-97 text-white text-xs font-semibold rounded-lg shadow-xs transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isBn ? 'আউটলুক (Outlook)' : 'Send via Outlook'}</span>
                </button>
                <button
                  onClick={() => handleSendGmail('birthday', currentBirthdays)}
                  className="flex-1 min-w-[130px] flex items-center justify-center gap-1.5 px-3 py-2 bg-rose-600 hover:bg-rose-500 active:scale-97 text-white text-xs font-semibold rounded-lg shadow-xs transition-all cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>{isBn ? 'জিমেইল (Gmail)' : 'Send via Gmail'}</span>
                </button>
                <button
                  onClick={() => handleCopy('birthday', currentBirthdays)}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 text-xs font-medium rounded-lg transition-all cursor-pointer"
                  title={isBn ? 'বার্তা কপি করুন' : 'Copy Message'}
                >
                  {copiedType === 'birthday' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                        {isBn ? 'কপি হয়েছে' : 'Copied!'}
                      </span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>{isBn ? 'কপি' : 'Copy'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* WORK ANNIVERSARY PANEL */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-linear-to-r from-teal-500/5 to-transparent flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-teal-500/15 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900 dark:text-white text-base">
                  {isBn ? 'কর্মবার্ষিকী অভিনন্দন' : 'Work Anniversaries'}
                </h2>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {isBn
                    ? `${formatNum(currentAnniversaries.length, lang)} জন কর্মী (${
                        activeScope === 'today'
                          ? 'আজকে'
                          : activeScope === 'tomorrow'
                          ? 'আগামীকাল'
                          : activeScope === 'week'
                          ? 'আগামী ৭ দিনে'
                          : 'চলতি মাসে'
                      })`
                    : `${currentAnniversaries.length} staff (${activeScope})`}
                </div>
              </div>
            </div>

            {currentAnniversaries.length > 0 && (
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300">
                {formatNum(currentAnniversaries.length, lang)}
              </span>
            )}
          </div>

          {/* Body List */}
          <div className="p-4 sm:p-5 flex-1 divide-y divide-slate-100 dark:divide-slate-800">
            {currentAnniversaries.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
                <Award className="w-8 h-8 opacity-30 text-teal-400" />
                <span>
                  {isBn
                    ? 'এই নির্বাচিত সময়ে কারো কর্মবার্ষিকী নেই।'
                    : 'No work anniversaries scheduled for this selected period.'}
                </span>
              </div>
            ) : (
              currentAnniversaries.map((p) => {
                const ord = getOrdinal(p.nth, lang, 'anniversary');
                return (
                  <div key={p.id} className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onOpenEmployeeDetail(p)}
                          className="font-semibold text-sm text-slate-900 dark:text-slate-100 hover:text-amber-600 dark:hover:text-amber-400 truncate text-left cursor-pointer"
                        >
                          {p.name}
                        </button>
                        <span className="text-xs font-medium text-teal-600 dark:text-teal-400 font-mono">
                          {ord} {isBn ? 'পূর্তি' : 'Anniversary'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                        <span>{p.designation}</span>
                        <span>·</span>
                        <span>{p.branch}</span>
                        {p.daysUntil > 0 && (
                          <>
                            <span>·</span>
                            <span className="text-amber-600 dark:text-amber-400 font-mono">
                              {p.daysUntil === 1
                                ? isBn
                                  ? 'আগামীকাল'
                                  : 'Tomorrow'
                                : isBn
                                ? `${toBnDigits(p.daysUntil)} দিন পর`
                                : `in ${p.daysUntil} days`}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Quick Direct Actions */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleDirectWish(p, 'whatsapp')}
                        title={isBn ? 'হোয়াটসঅ্যাপে শুভেচ্ছা পাঠান' : 'Wish on WhatsApp'}
                        className="p-1.5 rounded-md hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 transition-colors"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDirectWish(p, 'call')}
                        title={isBn ? 'সরাসরি কল দিন' : 'Call Staff'}
                        className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                      >
                        <Phone className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Action Footer */}
          {currentAnniversaries.length > 0 && (
            <div className="p-4 bg-slate-50 dark:bg-slate-900/70 border-t border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>{isBn ? 'জোন মেইল গ্রুপে পাঠান:' : 'Dispatch to Zone List:'}</span>
                <span className="font-mono text-slate-600 dark:text-slate-300">
                  {emails.length} {isBn ? 'টি প্রাপক' : 'recipients'}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleSendOutlook('anniversary', currentAnniversaries)}
                  className="flex-1 min-w-[130px] flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-500 active:scale-97 text-white text-xs font-semibold rounded-lg shadow-xs transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isBn ? 'আউটলুক (Outlook)' : 'Send via Outlook'}</span>
                </button>
                <button
                  onClick={() => handleSendGmail('anniversary', currentAnniversaries)}
                  className="flex-1 min-w-[130px] flex items-center justify-center gap-1.5 px-3 py-2 bg-teal-600 hover:bg-teal-500 active:scale-97 text-white text-xs font-semibold rounded-lg shadow-xs transition-all cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>{isBn ? 'জিমেইল (Gmail)' : 'Send via Gmail'}</span>
                </button>
                <button
                  onClick={() => handleCopy('anniversary', currentAnniversaries)}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 text-xs font-medium rounded-lg transition-all cursor-pointer"
                  title={isBn ? 'বার্তা কপি করুন' : 'Copy Message'}
                >
                  {copiedType === 'anniversary' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                        {isBn ? 'কপি হয়েছে' : 'Copied!'}
                      </span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>{isBn ? 'কপি' : 'Copy'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
