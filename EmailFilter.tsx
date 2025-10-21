import React from 'react';

interface Props {
  value: string;
  onChange: (val: string) => void;
}

const EmailFilter: React.FC<Props> = ({ value, onChange }) => {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className="email-filter">
      <option value="">All Accounts</option>
      <option value="gmail">Gmail</option>
      <option value="outlook">Outlook</option>
      <option value="yahoo">Yahoo</option>
    </select>
  );
};

export default EmailFilter;
