import React, { useState, useEffect } from "react";
import FormCard from "@/components/FormCard";
import FormDetails from "@/components/FormDetails";
import Navbar from "@/components/NavBar";
import formsData from "@/data/forms.json";
import SearchBar from "@/components/SearchBar";

const Forms: React.FC = () => {
  const [questionnaires, setQuestionnaires] = useState(formsData);
  const [filteredQuestionnaires, setFilteredQuestionnaires] = useState(formsData);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortCriteria, setSortCriteria] = useState<'date' | 'name'>('date');
  const [selectedFormId, setSelectedFormId] = useState<number | null>(null);
  const isAdmin = true;

  // Existing search and sort logic remains the same
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleSort = (criteria: 'date' | 'name') => {
    setSortCriteria(criteria);
  };

  useEffect(() => {
    let filtered = [...questionnaires];

    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter((form) => {
        const courseTitle = form.courseTitle ? form.courseTitle.toLowerCase() : "";
        const professors = form.professors
          ? form.professors.join(" ").toLowerCase()
          : "";
        return courseTitle.includes(lowerCaseQuery) || professors.includes(lowerCaseQuery);
      });
    }

    if (sortCriteria === 'date') {
      filtered.sort((a, b) => {
        const dateA = a.deadline ? new Date(a.deadline).getTime() : 0;
        const dateB = b.deadline ? new Date(b.deadline).getTime() : 0;
        return dateA - dateB;
      });
    } else if (sortCriteria === 'name') {
      filtered.sort((a, b) => {
        const courseTitleA = a.courseTitle || "";
        const courseTitleB = b.courseTitle || "";
        return courseTitleA.localeCompare(courseTitleB);
      });
    }

    setFilteredQuestionnaires(filtered);
  }, [searchQuery, sortCriteria]);

  const handleFormSelect = (id: number) => {
    setSelectedFormId(id);
  };

  const handleBackToList = () => {
    setSelectedFormId(null);
  };

  return (
    <div className="relative min-h-screen bg-gray-100">
      <Navbar role="ADMIN"/>
      <div className={``}>
      <h1 className={`text-5xl font-bold text-center text-[#1E0E62] py-2 pt-10 transition-all duration-300 ease-in-out ${selectedFormId ? 'w-3/5' : 'w-full'}`}>
        Questionnaires
      </h1>
      
      <div className={`px-6 transition-all duration-300 ease-in-out ${selectedFormId ? 'w-3/5' : 'w-full'}`}>
        <SearchBar onSearch={handleSearch} onSort={handleSort} />
      </div>
      
      <div className="flex relative">
        {/* Form Cards - now taking 2/3 of the width when details are shown */}
        <div className={`transition-all duration-300 ease-in-out ${selectedFormId ? 'w-3/5' : 'w-full'}`}>
          <div className="flex justify-center py-6">
            <FormCard 
              initialQuestionnaires={filteredQuestionnaires} 
              onSelect={handleFormSelect} 
              isAdmin={isAdmin} 
            />
          </div>
        </div>
        
        {/* Form Details - sliding in from the right */}
        {selectedFormId && (
          <div className="fixed top-20 right-0 w-2/5 h-[calc(100vh-5rem)] transform transition-transform duration-300 ease-in-out translate-x-0 bg-white shadow-lg z-50 overflow-y-auto">
            <FormDetails
              formId={selectedFormId}
              onBackToList={handleBackToList}
            />
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

export default Forms;