import React from "react";
import Logo from "../assets/Logo.avif";
import { Columns2 } from "lucide-react";

const Header = ({ flipped, setFlipped }) => {
  return (
    <div className="h-[50px] shadow-xl z-10 flex items-center px-5 justify-between">
      <div className="h-full flex gap-3 items-center">
        <img src={Logo} alt="Fencing Club Logo" className="h-[35px] w-[50px]" />
        <span className="text-2xl font-semibold text-[#353535]">
          Fencing Club
        </span>
      </div>
      <Columns2 strokeWidth={1} onClick={() => setFlipped(!flipped)} />
    </div>
  );
};

export default Header;
