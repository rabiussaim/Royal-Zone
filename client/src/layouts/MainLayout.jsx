import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import DemoModeBanner from '../components/common/DemoModeBanner';

const MainLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-cream-50 dark:bg-navy-900 transition-colors duration-300">
      <Navbar />
      <main className="flex-1">
        <DemoModeBanner />
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;


