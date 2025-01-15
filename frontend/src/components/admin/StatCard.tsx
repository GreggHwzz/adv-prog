interface StatCardProps {
    title: string;
    value?: number | string;
  }
  
  const StatCard: React.FC<StatCardProps> = ({ title, value }) => {
    return (
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    );
  };
  
  export default StatCard;
  