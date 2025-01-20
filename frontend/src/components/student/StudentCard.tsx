import React from "react";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

interface StudentCardProps {
  firstName: string | undefined;
  lastName: string | undefined;
  className: string | undefined;
}

const StudentCard: React.FC<StudentCardProps> = ({ firstName, lastName, className }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg w-80 p-4 flex items-center justify-center h-full">
      <div className="flex items-center flex-col space-x-4 justify-center text-center">
        <AccountCircleIcon sx={{ fontSize: 50 }} />
        <div>
          <h2 className="text-xl font-semibold">{firstName} {lastName}</h2>
          <p className="text-gray-600">{className}</p>
        </div>
      </div>
    </div>
  );
};

export default StudentCard;