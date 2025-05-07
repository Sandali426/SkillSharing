import React from "react";
import { Link } from "react-router-dom";
import { FaGraduationCap } from "react-icons/fa";

const Header = () => {
  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center">
      <div className="flex items-center gap-2 text-blue-600 text-xl font-bold">
        <FaGraduationCap />
        <span>LearnMate</span>
      </div>

      <Link
        to="/"
        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition"
      >
        Go to Dashboard
      </Link>
    </header>
  );
};

export default Header;
