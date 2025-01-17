import React from "react";

interface StudentCardProps {
  //imageUrl: string;
  firstName: string | undefined;
  lastName: string | undefined;
  className: string | undefined;
}

const StudentCard: React.FC<StudentCardProps> = ({ /*imageUrl,*/ firstName, lastName, className }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg w-80 p-4">
      <div className="flex items-center space-x-4">
        {/* <img src={imageUrl} alt="Student Avatar" className="w-16 h-16 rounded-full" /> */}
        <div>
          <h2 className="text-xl font-semibold">{firstName} {lastName}</h2>
          <p className="text-gray-600">{className}</p>
        </div>
      </div>
    </div>
  );
};

export default StudentCard;