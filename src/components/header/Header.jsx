import React from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
    <div
      className="bg-black text-white w-full sticky top-0 z-50 px-4 sm:py-0.5 md:py-1.5"
      style={{ height: "35px" }}
    >
      <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-center justify-center text-center">
        <span className="text-[12px] md:text-sm  leading-tight font-ubuntu">
          Sign up and get 20% off your first order.
        </span>
        <button
          className="text-white underline text-[12px] md:text-[13px] font-ubuntu whitespace-nowrap"
          onClick={() => navigate("/")}
        >
          Sign Up Now
        </button>
      </div>
    </div>
  );
};

export default Header;
