import React from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode; // A tout hasard on peut mettre des icones avec ca sur les cards
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 w-60 flex items-center space-x-4">
      {icon && <div className="text-blue-500">{icon}</div>}
      <div>
        <h4 className="text-sm text-gray-600">{title}</h4>
        <p className="text-xl font-semibold">{value}</p>
      </div>
    </div>
  );
};

export default StatsCard;