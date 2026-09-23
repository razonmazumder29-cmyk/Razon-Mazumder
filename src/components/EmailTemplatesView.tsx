import React, { useState } from 'react';
import { EmailTemplate, Language } from '../types';
import { DEFAULT_TEMPLATES } from '../data/defaultData';
import {
  Mail,
  Plus,
  Trash2,
  FileText,
  RotateCcw,
  Check,
  Sparkles,
  Info
} from 'lucide-react';

interface EmailTemplatesViewProps {
  emails: string[];
  templates: Record<'en' | 'bn', EmailTemplate>;
  lang: Language;
  onAddEmail: (email: string) => void;
  onRemoveEmail: (index: number) => void;
  onUpdateTemplates: (templates: Record<'en' | 'bn', EmailTemplate>) => void;
}

export const EmailTemplatesView: React.FC<EmailTemplatesViewProps> = ({
  emails,
  templates,
  lang,
  onAddEmail,
  onRemoveEmail,
  onUpdateTemplates
}) => {
  const isBn = lang === 'bn';
  const [newEmail, setNewEmail] = useState('');
  const [activeTemplateTab, setActiveTemplateTab] = useState<'bday' | 'anniv'>('bday');
  const [templateLang, setTemplateLang] = useState<'en' | 'bn'>(lang);
  const [currentTemplates, setCurrentTemplates] = useState(templates);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleAddEmail = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = newEmail.trim();
    if (!raw) return;

    // Support comma or semicolon separated multi-paste
    const splitEmails = raw
      .split(/[,;\s]+/)
      .map((em) => em.trim())
      .filter((em) => em.includes('@') && em.includes('.'));

    splitEmails.forEach((em) => onAddEmail(em));
    setNewEmail('');
  };

  const handleSaveTemplates = () => {
    onUpdateTemplates(currentTemplates);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleResetDefaults = () => {
    if (
      window.confirm(
        isBn
          ? 'আপনি কি বার্তা টেমপ্লেট ডিফল্ট অবস্থায় ফিরিয়ে নিতে চান?'
          : 'Reset greeting templates to official defaults?'
      )
    ) {
      setCurrentTemplates(DEFAULT_TEMPLATES);
      onUpdateTemplates(DEFAULT_TEMPLATES);
    }
  };

  const t = currentTemplates[templateLang];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs">
        <h1 className="text-lg font-bold text-slate-900 dark:text-white">
          {isBn ? 'ইমেইল তালিকা ও শুভেচ্ছা বার্তা টেমপ্লেট' : 'Email Recipients & Greeting Templates'}
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          {isBn
            ? 'ড্যাশবোর্ড থেকে শুভেচ্ছা পাঠানোর সময় যেসকল ইমেইল আইডিতে বার্তা যাবে এবং যে বয়ানে মেইল হবে তা এখান থেকে কাস্টমাইজ করুন।'
            : 'Configure zone recipients and customize the greeting email format dispatched from the dashboard.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Email Recipients List (4 cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Mail className="w-4 h-4 text-blue-500" />
            <h2 className="font-bold text-sm text-slate-900 dark:text-white">
              {isBn ? 'জোন প্রাপক তালিকা' : 'Zone Email Recipients'}
            </h2>
            <span className="ml-auto font-mono text-xs text-slate-400">
              {emails.length}
            </span>
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 mb-3">
            {isBn
              ? 'আউটলুক বা জিমেইল অপশনে ক্লিক করলে এই মেইলগুলোতে শুভেচ্ছা পাঠানো হবে।'
              : 'These email addresses receive greetings when clicking Send in the dashboard.'}
          </p>

          <form onSubmit={handleAddEmail} className="flex gap-2 mb-3">
            <input
              type="text"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder={isBn ? 'email@example.com (একাধিক পেস্ট করা যায়)' : 'name@sss-bd.org...'}
              className="flex-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden"
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="flex-1 overflow-y-auto max-h-96 divide-y divide-slate-100 dark:divide-slate-800/80">
            {emails.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                {isBn ? 'কোনো ইমেইল যুক্ত নেই।' : 'No emails configured.'}
              </div>
            ) : (
              emails.map((em, idx) => (
                <div key={idx} className="py-2 flex items-center justify-between gap-2 text-xs">
                  <span className="font-mono text-slate-700 dark:text-slate-300 truncate">{em}</span>
                  <button
                    onClick={() => onRemoveEmail(idx)}
                    title={isBn ? 'মুছে ফেলুন' : 'Remove'}
                    className="text-slate-400 hover:text-rose-600 p-1 rounded-md transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Templates Editor (8 cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-500" />
              <h2 className="font-bold text-sm text-slate-900 dark:text-white">
                {isBn ? 'শুভেচ্ছা বার্তার বয়ান ও টেমপ্লেট' : 'Greeting Message Templates'}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              {/* Language Switcher */}
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
                <button
                  onClick={() => setTemplateLang('bn')}
                  className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                    templateLang === 'bn'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  বাংলা
                </button>
                <button
                  onClick={() => setTemplateLang('en')}
                  className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                    templateLang === 'en'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  English
                </button>
              </div>

              {/* Reset to Default */}
              <button
                onClick={handleResetDefaults}
                title={isBn ? 'ডিফল্ট রিসেট' : 'Reset to Default'}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-md cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Template Tab (Birthday vs Anniversary) */}
          <div className="flex gap-2 pt-3">
            <button
              onClick={() => setActiveTemplateTab('bday')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTemplateTab === 'bday'
                  ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300 font-semibold border border-rose-500/30'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              🎂 {isBn ? 'জন্মদিনের বার্তা' : 'Birthday Message'}
            </button>
            <button
              onClick={() => setActiveTemplateTab('anniv')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTemplateTab === 'anniv'
                  ? 'bg-teal-500/15 text-teal-700 dark:text-teal-300 font-semibold border border-teal-500/30'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              🏅 {isBn ? 'কর্মবার্ষিকীর বার্তা' : 'Work Anniversary Message'}
            </button>
          </div>

          {/* Tag Info Pill */}
          <div className="mt-3 p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 text-[11px] text-amber-800 dark:text-amber-300 flex items-start gap-2">
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              {isBn
                ? 'ডায়নামিক ট্যাগ ব্যবহার করতে পারেন: {names} = কর্মীদের নাম, {list} = শাখা ও পদবীসহ পূর্ণ বিবরণ।'
                : 'Available tags: {names} = staff names, {list} = detailed bullet list with branch & designation.'}
            </span>
          </div>

          {/* Form */}
          <div className="mt-4 space-y-3">
            {activeTemplateTab === 'bday' ? (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {isBn ? 'ইমেইল সাবজেক্ট (Subject)' : 'Email Subject'}
                  </label>
                  <input
                    type="text"
                    value={t.bdaySubject}
                    onChange={(e) =>
                      setCurrentTemplates({
                        ...currentTemplates,
                        [templateLang]: { ...t, bdaySubject: e.target.value }
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {isBn ? 'বার্তা বিবরণ (Body)' : 'Email Body'}
                  </label>
                  <textarea
                    rows={8}
                    value={t.bdayBody}
                    onChange={(e) =>
                      setCurrentTemplates({
                        ...currentTemplates,
                        [templateLang]: { ...t, bdayBody: e.target.value }
                      })
                    }
                    className="w-full px-3 py-2 font-sans bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden leading-relaxed"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {isBn ? 'ইমেইল সাবজেক্ট (Subject)' : 'Email Subject'}
                  </label>
                  <input
                    type="text"
                    value={t.annivSubject}
                    onChange={(e) =>
                      setCurrentTemplates({
                        ...currentTemplates,
                        [templateLang]: { ...t, annivSubject: e.target.value }
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {isBn ? 'বার্তা বিবরণ (Body)' : 'Email Body'}
                  </label>
                  <textarea
                    rows={8}
                    value={t.annivBody}
                    onChange={(e) =>
                      setCurrentTemplates({
                        ...currentTemplates,
                        [templateLang]: { ...t, annivBody: e.target.value }
                      })
                    }
                    className="w-full px-3 py-2 font-sans bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden leading-relaxed"
                  />
                </div>
              </>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              {savedSuccess && (
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>{isBn ? 'সফলভাবে সংরক্ষিত!' : 'Template Saved!'}</span>
                </span>
              )}
              <button
                onClick={handleSaveTemplates}
                className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{isBn ? 'টেমপ্লেট সংরক্ষণ করুন' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
