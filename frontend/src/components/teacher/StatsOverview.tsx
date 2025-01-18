import React from "react";

const StatsOverview = () => {
  const stats = {
    averageScore: 4.3,
    feedbackCount: 12,
    unreadComments: 3,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="p-4 bg-white shadow rounded-lg">
        <h3 className="text-lg font-bold">Score moyen</h3>
        <p className="text-2xl">{stats.averageScore}</p>
      </div>
      <div className="p-4 bg-white shadow rounded-lg">
        <h3 className="text-lg font-bold">Nombre de feedbacks</h3>
        <p className="text-2xl">{stats.feedbackCount}</p>
      </div>
      <div className="p-4 bg-white shadow rounded-lg">
        <h3 className="text-lg font-bold">Commentaires non lus</h3>
        <p className="text-2xl">{stats.unreadComments}</p>
      </div>
    </div>
  );
};

export default StatsOverview;
