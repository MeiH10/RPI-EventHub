import React, { useState } from 'react';

const AIRobot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: 'user' }]);
      setInput('');
      // Simulate AI response
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: 'This is an AI response.', sender: 'ai' },
        ]);
      }, 1000);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex-grow p-4 overflow-auto">
        <div className="max-w-lg mx-auto">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`p-2 my-2 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-blue-500 text-white self-end'
                  : 'bg-gray-300 text-black self-start'
              }`}
            >
              {message.text}
            </div>
          ))}
        </div>
      </div>
      <div className="p-4 bg-white shadow-md flex">
        <input
          type="text"
          className="flex-grow p-2 border rounded-l-lg focus:outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') handleSend();
          }}
        />
        <button
          className="bg-blue-500 text-white p-2 rounded-r-lg"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default AIRobot;