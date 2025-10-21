import React from "react";

interface Email {
  id: string;
  subject: string;
  body: string;
  from: string;
  to: string[];
  date: string;
  aiCategory: string;
}

interface Props {
  emails: Email[];
}

const EmailList: React.FC<Props> = ({ emails }) => {
  return (
    <ul>
      {emails.map((email) => (
        <li key={email.id} style={{ marginBottom: "20px" }}>
          <strong>{email.subject}</strong> - {email.from} <br />
          <small>{new Date(email.date).toLocaleString()}</small>
          <p>{email.body}</p>
          <hr />
        </li>
      ))}
    </ul>
  );
};

export default EmailList;
