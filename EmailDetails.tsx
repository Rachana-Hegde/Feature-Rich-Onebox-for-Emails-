import React from 'react';

interface Email {
  id: string;
  subject: string;
  body: string;
  account?: string;
  folder?: string;
}

interface Props {
  email: Email;
}

const EmailDetails: React.FC<Props> = ({ email }) => {
  return (
    <div className="email-details">
      <p><strong>Account:</strong> {email.account || 'N/A'}</p>
      <p><strong>Folder:</strong> {email.folder || 'N/A'}</p>
      <p>{email.body}</p>
    </div>
  );
};

export default EmailDetails;
