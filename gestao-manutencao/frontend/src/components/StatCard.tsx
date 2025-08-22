// frontend/src/components/StatCard.tsx
import React from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
  description: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, description }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-sm font-medium text-gray-500 truncate">{title}</h3>
      <p className="mt-1 text-3xl font-semibold text-gray-900">{value}</p>
      <p className="text-sm text-gray-600 mt-2">{description}</p>
    </div>
  );
};

export default StatCard;
