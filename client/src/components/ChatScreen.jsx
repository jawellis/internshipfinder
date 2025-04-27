import React, { useState, useEffect, useRef } from 'react';

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  backgroundColor: '#f4f4f9',
  fontSize: '16px',
};

const chatWrapperStyle = {
  flex: 1,
  flexGrow: 1,
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  maxWidth: '768px',
  width: '100%',
  margin: '0 auto',
  padding: '2rem clamp(1rem, 5vw, 3rem)',
};

const messageStyle = (sender) => ({
  alignSelf: sender === 'user' ? 'flex-end' : 'flex-start',
  backgroundColor: sender === 'user' ? '#2563eb' : '#e0e0e0',
  color: sender === 'user' ? 'white' : 'black',
  padding: '0.75rem 1rem',
  borderRadius: '1rem',
  maxWidth: '70%',
  fontSize: '1rem',
  lineHeight: '1.5',
  marginBottom: '0.5rem',
  wordBreak: 'break-word',
});

const inputContainerStyle = {
  padding: '1rem',
  borderTop: '1px solid #ccc',
  backgroundColor: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const inputWrapperStyle = {
  display: 'flex',
  gap: '0.75rem',
  width: '100%',
  maxWidth: '768px',
};

const inputStyle = {
  flex: 1,
  padding: '0.75rem 1rem',
  borderRadius: '9999px',
  border: '1px solid #ccc',
  fontSize: '1rem',
  outline: 'none',
};

const sendButtonStyle = {
  backgroundColor: '#2563eb',
  color: '#fff',
  border: 'none',
  padding: '0.75rem 1.25rem',
  borderRadius: '9999px',
  fontSize: '1rem',
  cursor: 'pointer',
};

function ChatScreen() {
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const startChat = async () => {
      try {
        const res = await fetch('http://localhost:8000/');
        const data = await res.json();
        if (data.reply) {
          setMessages((prev) => [...prev, { sender: 'ai', text: data.reply }]);
        }
      } catch (error) {
        console.error('Failed to start conversation:', error);
        setMessages([{ sender: 'ai', text: 'Oops! Failed to start the conversation.' }]);
      }
    };

    startChat();
  }, []);

  const sendUserMessage = async () => {
    if (isTyping || !input.trim()) return;
    setIsTyping(true);

    const userMessage = input;
    setInput('');
    setMessages((prev) => [...prev, { sender: 'user', text: userMessage }]);

    try {
      const res = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();
      console.log('Response from server:', data);

      if (data.internships && Array.isArray(data.internships) && data.internships.length > 0) {
        const shuffled = data.internships.sort(() => 0.5 - Math.random());
        const topInternships = shuffled.slice(0, 3);

        const internshipMessages = topInternships.map((job) => {
          const title = job.title || "Title not specified";
          const organization = job.organization || "Organization not specified";
          const location = job.cities_derived?.[0] || "Location not specified";
          const workArrangement = job.ai_work_arrangement || "Work arrangement not specified";
          const salary = job.ai_salary_minvalue ? `€${job.ai_salary_minvalue}/${job.ai_salary_unittext?.toLowerCase() || 'month'}` : "Salary not specified";
          const description = job.description_text
            ? job.description_text.split(' ').slice(0, 100).join(' ') + "..."
            : "No description available";
          const url = job.url || "#";

          return (
            `🔹 Title: ${title}\n` +
            `🔹 Organization: ${organization}\n` +
            `🔹 Location: ${location}\n` +
            `🔹 Work Arrangement: ${workArrangement}\n` +
            `🔹 Salary: ${salary}\n` +
            `🔹 Description: ${description}\n` +
            `🔗 <a href="${url}" target="_blank" rel="noopener noreferrer">View Internship</a>`
          );
        }).join('\n\n---\n\n');

        setMessages((prev) => [...prev, { sender: 'ai', text: `Here are some internships I found:\n\n${internshipMessages}` }]);
        setIsTyping(false); 
      } else if (data.reply) {
        let words = data.reply.split(' ');
        let currentText = '';

        setMessages((prev) => [...prev, { sender: 'ai', text: '' }]);

        const streamReply = async () => {
          for (let i = 0; i < words.length; i++) {
            currentText += words[i] + ' ';
            setMessages((prev) => {
              const updated = [...prev];
              updated[updated.length - 1] = { sender: 'ai', text: currentText };
              return updated;
            });
            await new Promise(resolve => setTimeout(resolve, 50));
          }
          setIsTyping(false); 
        };

        await streamReply();
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setMessages((prev) => [...prev, { sender: 'ai', text: 'Failed to connect to the server.' }]);
      setIsTyping(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={chatWrapperStyle}>
        {messages.map((msg, idx) => (
          <div key={idx} style={messageStyle(msg.sender)}>
            <div dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br />') }} />
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div style={inputContainerStyle}>
        <div style={inputWrapperStyle}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            style={inputStyle}
            disabled={isTyping}
          />
          <button
            style={sendButtonStyle}
            onClick={sendUserMessage}
            disabled={isTyping}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatScreen;
