import React from 'react';

const SiteLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full bg-white py-10 dark:bg-[#0E1420]">
      {children}
    </div>
  );
};

export default SiteLayout;