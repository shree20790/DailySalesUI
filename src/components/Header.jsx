import React, { useState } from "react";
import logo from "../assets/logo.png";
import { BiBell, BiChevronDown } from "react-icons/bi";
import profile from "../assets/Vector.jpg";
import leftArow from "../assets/left-arrow.jpg";
import rightArrow from "../assets/left-arrow.jpg"; // Add right arrow image

const Header = () => {
  const [isMenuHidden, setIsMenuHidden] = useState(false);

  const toggleMenu = () => {
    setIsMenuHidden(!isMenuHidden);
  };

  return (
    <div className="flex items-center justify-between bg-white shadow-md px-4 py-2 hover:border hover:border-blue-500">
      <div className="flex items-center space-x-2">
        <img src={logo} alt="Finoracles Logo" className="h-8 w-auto" />
        
        {/* Toggle Left/Right Arrow */}
        <img
          src={isMenuHidden ? rightArrow : leftArow}
          alt="Toggle Icon"
          className="h-7 w-auto cursor-pointer"
          onClick={toggleMenu}
        />
      </div>

      <div className="flex items-center justify-between px-4 py-2 w-[80%]">
        <div className="text-lg font-medium text-gray-800 hidden md:block">
          Welcome, Ashish
        </div>

        <div className="flex items-center gap-4">
          <div className="p-1 rounded-md">
            <BiBell className="w-5 h-5 text-gray-600" />
          </div>

          {/* Profile Section */}
          <div className="flex items-center rounded-md p-1">
            <img src={profile} alt="Ashish" className="h-8 w-8 rounded-full" />
            <span className="ml-2 text-sm text-gray-800 hidden sm:block">
              Ashish
            </span>
            <BiChevronDown className="w-4 h-4 ml-1 text-gray-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
