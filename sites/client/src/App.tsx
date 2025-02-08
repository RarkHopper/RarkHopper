import React from 'react'
import Message from './components/Message'

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-2xl mx-auto bg-white shadow rounded p-6">
        <h1 className="text-2xl font-bold mb-4">Hono API</h1>
        <Message />
      </div>
    </div>
  );
}

export default App;
