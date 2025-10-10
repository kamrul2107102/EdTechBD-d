import React from "react";

const StatsCard = ({ icon: Icon, title, value, color }) => {
  return (
    <div className="flex items-center gap-4 p-4 w-56 bg-white shadow-md border border-gray-200 rounded-lg transition-transform hover:scale-105">
      <Icon className={`w-10 h-10 ${color}`} />
      <div>
        <p className="text-2xl font-semibold text-gray-700">{value}</p>
        <p className="text-sm text-gray-500">{title}</p>
      </div>
    </div>
  );
};

export default StatsCard;
