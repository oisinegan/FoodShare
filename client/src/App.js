import "./App.css";
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Landing from "./pages/Landing";

import Post from "./pages/Post";
import Donation from "./pages/Donation";
import Profile from "./pages/Profile";
import React from "react";
import { decodeToken } from "react-jwt";
export const Context = React.createContext();

function App() {
  //const context = useContext(myContext);

  const [user, setUser] = useState(null);

  console.log(localStorage.getItem("token"));
  useEffect(() => {
    if (localStorage.getItem("token") != null) {
      const decoded = decodeToken(localStorage.getItem("token"));
      setUser(decoded);
    }
  }, []);

  return (
    <BrowserRouter>
      <Context.Provider value={[user, setUser]}>
        <Routes>
          <Route index element={<Landing />} />

          {user ? (
            <>
              <Route path="Post" element={<Post />} />
              <Route path="Donation" element={<Donation />} />
              <Route path="Profile" element={<Profile />} />
            </>
          ) : (
            <>
              {" "}
              <Route path="Login" element={<Login />} />
              <Route path="Register" element={<Register />} />
            </>
          )}
        </Routes>
      </Context.Provider>
    </BrowserRouter>
  );
}

export default App;
