import React, { useState } from 'react';
import { fetchSuggestedReply } from '../services/emailApi';

interface Props {
  emailId: string;
}

const SuggestedReply: React.FC<Props> = ({ emailId }) => {
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const suggested = await fetchSuggestedReply(emailId);
      setReply(suggested);
    } catch (err) {
      setReply('Failed to fetch suggested reply.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="suggested-reply">
      <button onClick={handleClick} disabled={loading}>
        {loading ? 'Loading...' : 'Get AI Suggested Reply'}
      </button>
      {reply && <p className="reply-text">{reply}</p>}
    </div>
  );
};

export default SuggestedReply;
