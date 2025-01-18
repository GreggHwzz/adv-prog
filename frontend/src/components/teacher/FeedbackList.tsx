import React from "react";

interface Feedback {
  id: number;
  content: string;
  read: boolean;
}

const FeedbackList: React.FC<{
  feedbacks: Feedback[];
  onMarkAsRead: (id: number) => void;
}> = ({ feedbacks, onMarkAsRead }) => {
  return (
    <ul>
      {feedbacks.map((feedback) => (
        <li
          key={feedback.id}
          className={`p-4 mb-2 border rounded ${
            feedback.read ? "bg-gray-100" : "bg-white"
          }`}
        >
          <p>{feedback.content}</p>
          {!feedback.read && (
            <button
              onClick={() => onMarkAsRead(feedback.id)}
              className="text-blue-500 hover:underline mt-2"
            >
              Marquer comme lu
            </button>
          )}
        </li>
      ))}
    </ul>
  );
};

export default FeedbackList;
