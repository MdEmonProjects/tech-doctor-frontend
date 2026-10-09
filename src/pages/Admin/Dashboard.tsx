import { useEffect, useRef, useState } from 'react';

const STOCK_REPLIES = [
  "Got it — that's noted. What else is on your mind?",
  "Here's a placeholder reply. Wire this up to your real API when ready.",
  "Makes sense. Anything you'd like me to expand on?",
];

export default function Dashboard() {
  const [draft, setDraft] = useState('');
  const scrollRef = useRef(null);


  return (
    <>
        <p className="text-gray-500">Start a conversation below.</p>
    </>
  );
}
