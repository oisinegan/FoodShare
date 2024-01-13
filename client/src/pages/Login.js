import React, { useContext, useState } from "react";
import { Context } from "../App";
import { decodeToken } from "react-jwt";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [info, setInfo] = useState([{}]);
  const [user, setUser] = useContext(Context);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setInfo((prev) => {
      return { ...prev, [name]: value.trim() };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("/Login", {
      method: "post",
      body: JSON.stringify(info),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();
    if (result.user) {
      alert(result.user);
      localStorage.setItem("token", result.user);
      const decoded = decodeToken(result.user);

      setUser(decoded);
      alert(`Logged in as ${decoded.name}`);
      navigate("/");
      // window.location.href = "https://localhost:3000";
    } else {
      alert("ERROR: wrong user or pass");
    }
  };

  return (
    <>
      <div className="flex h-screen bg-[#fafaf9] flex-1 flex-col justify-center  px-6 py-12 lg:px-8 ">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm rounded-full ">
          <h2 className="mt-8 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in
          </h2>
        </div>
        <div className="mt-10 mx-4 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-4 " onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  name="username"
                  id="email"
                  type="email"
                  onChange={handleChange}
                  autoComplete="email"
                  required
                  className="block w-full rounded-md border-0 pl-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <br /> <br />
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="pass"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
                <div className="text-sm">
                  {/* <a
        href="#"
        className="font-semibold text-cyan-600 hover:text-cyan-500"
      >
        Forgot password?
      </a> */}
                </div>
              </div>
              <div className="mt-2">
                <input
                  name="password"
                  type="password"
                  id="pass"
                  autoComplete="current-password"
                  onChange={handleChange}
                  required
                  className="block w-full rounded-md border-0 pl-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <br /> <br />
            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-blue-700 hover:bg-blue-800 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
        <p className="mt-10 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <a
            href="/Register"
            className="font-semibold leading-6 text-cyan-600 hover:text-cyan-500"
          >
            Sign up now
          </a>
        </p>
      </div>
    </>
  );
}
