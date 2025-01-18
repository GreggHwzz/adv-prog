'use client';

import React from 'react';

// Types
interface Form {
  id: string;
  title: string;
  courseName: string;
  adminName: string;
}

interface FormListProps {
  forms: Form[];
}

const FormList: React.FC<FormListProps> = ({ forms }) => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Formulaires Disponibles</h1>

      <div className="space-y-4">
        {forms.map((form) => (
          <div key={form.id} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all">
            <h2 className="text-xl font-semibold text-gray-700">{form.title}</h2>
            <p className="text-gray-500">Course: {form.courseName}</p>
            <p className="text-gray-500">Created by: {form.adminName}</p>

            <div className="mt-4 flex justify-between items-center">
              <a
                href={`/forms/${form.id}`}
                className="text-blue-500 hover:text-blue-700 transition-colors"
              >
                Voir les détails
              </a>
              <button className="text-red-500 hover:text-red-700 transition-colors">
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FormList;
