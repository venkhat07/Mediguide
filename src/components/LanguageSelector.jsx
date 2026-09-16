import { LANGUAGES } from '../data/mockData';

export default function LanguageSelector({ value, onChange, label = 'Preferred Language' }) {
  return (
    <div className="field">
      <label>{label}</label>
      <select className="input" value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="" disabled>Select language</option>
        {LANGUAGES.map((lang) => (
          <option key={lang} value={lang}>{lang}</option>
        ))}
      </select>
    </div>
  );
}
