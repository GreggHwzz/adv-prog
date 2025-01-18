import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
  },
};

const data = {
  labels: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet"],
  datasets: [
    {
      label: "Évaluations moyennes",
      data: [3.5, 4.0, 4.2, 3.8, 4.1, 3.9, 4.5],
      backgroundColor: "rgba(75, 192, 192, 0.2)",
      borderColor: "rgba(75, 192, 192, 1)",
      borderWidth: 1,
    },
  ],
};

const TeacherStatsPage = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Statistiques</h1>
      <Bar options={options} data={data} />
    </div>
  );
};

export default TeacherStatsPage;