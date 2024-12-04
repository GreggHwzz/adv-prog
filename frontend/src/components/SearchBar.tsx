import React, { useState } from "react";
import { FiSearch } from "react-icons/fi"; // Icône de loupe pour la recherche
import { IoMdArrowDropdown } from "react-icons/io"; // Icône de flèche pour les menus de tri

interface SearchBarProps {
  onSearch: (query: string) => void;
  onSort: (criteria: 'date' | 'name') => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onSort }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value); // Appeler la fonction de recherche
  };

  const handleSortChange = (criteria: 'date' | 'name') => {
    onSort(criteria); // Appeler la fonction de tri
  };

  return (
    <div className="flex items-center justify-between  p-4 pb-0 rounded-lg max-w-4xl w-[700px] mx-auto mt-6">
      {/* Barre de recherche */}
      <div className="flex items-center bg-gray-200 rounded-lg w-full max-w-md p-2 m-0">
        <FiSearch className="text-gray-500 mr-2" />
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Rechercher..."
          className="bg-transparent outline-none flex-1"
        />
      </div>

      {/* Options de tri 
      <div className="flex items-center space-x-4 text-sm text-gray-600">
        <span>Trier par :</span>
        <div
          className="flex items-center space-x-1 cursor-pointer"
          onClick={() => handleSortChange('date')}
        >
          <span>Date</span>
          <IoMdArrowDropdown className="text-gray-400" />
        </div>
        <div
          className="flex items-center space-x-1 cursor-pointer"
          onClick={() => handleSortChange('name')}
        >
          <span>Nom</span>
          <IoMdArrowDropdown className="text-gray-400" />
        </div>
      </div>*/}
    </div>
  );
};

export default SearchBar;
