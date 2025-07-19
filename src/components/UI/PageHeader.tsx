import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, description }) => {
  return (
      <div className="bg-gradient-to-r from-[#72c02c] to-[#72c02c] rounded-xl p-6 text-white mb-3">
        <h1 className="text-2xl font-bold mb-2">{title}</h1>
        <p className="text-white">{description}</p>
      </div>
  );
};

export default PageHeader;
