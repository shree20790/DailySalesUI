import React from "react";
import Financeleaders from "../assets/Login.png";
import logo from "../assets/logo.png";

const LoginPage = () => {
  return (
    <>
     <div
      className="relative w-screen h-screen flex justify-center items-center bg-cover bg-center"
      style={{ backgroundImage: `url(${Financeleaders})` }}
    >
      {/* White Form Card */}
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-lg w-[95%] md:w-[400px] ml-auto mr-auto md:mr-28">
        <div className="flex justify-center items-center w-full h-[80px]">
          <img
            src={logo}
            alt="Logo"
            className="w-[100px] md:w-[120px] h-auto object-contain"
          />
        </div>

        <h2 className="text-xl md:text-xl font-bold">Welcome back!</h2>
        <p className="text-sm text-gray-500">Please sign in to continue.</p>

        <div className="mt-2">
          <label className="text-sm font-medium">Email</label>
          <input
            type="email"
            className="w-full border rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="johndoe123@gmail.com"
          />
        </div>

        <div className="mt-2">
          <label className="text-sm font-medium">Password</label>
          <div className="relative">
            <input
              type="password"
              className="w-full border rounded-lg p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="********"
            />
            <button className="absolute right-2 top-3 text-gray-500">👁️</button>
          </div>
        </div>

        <div className="flex justify-between items-center mt-2">
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" /> Remember me
          </label>
          <a href="#" className="text-red-500 text-sm">
            Forgot Password?
          </a>
        </div>

        <button className="w-full bg-red-500 text-white py-2 rounded-lg mt-4">
          Login
        </button>

        <p className="text-center text-sm mt-2">
          Don't have an account?{" "}
          <a href="#" className="text-red-500">
            Create Account
          </a>
        </p>
      </div>
    </div>
    </>
  );
};

export default LoginPage;
