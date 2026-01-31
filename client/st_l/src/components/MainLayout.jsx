import React from 'react';
import Sidebar from './Sidebar';

const MainLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-[#f8fafc]"> {/* Soft off-white background */}
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        {/* Page title and content go here */}
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;