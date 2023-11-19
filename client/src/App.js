import "./App.css";
import { useContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Landing from "./pages/Landing";

import Post from "./pages/Post";
import Donation from "./pages/Donation";
import Profile from "./pages/Profile";
import ContextUser, { myContext } from "./pages/Context";

function App() {
  const context = useContext(myContext);
  console.log(context);

  return (
    <BrowserRouter>
      <ContextUser>
        <Routes>
          <Route index element={<Landing />} />
          <Route path="Login" element={<Login />} />
          <Route path="Register" element={<Register />} />
          <Route path="Post" element={<Post />} />
          <Route path="Donation" element={<Donation />} />
          <Route path="Profile" element={<Profile />} />

          {context === "null" ? <></> : <></>}
        </Routes>
      </ContextUser>
    </BrowserRouter>
  );
}

export default App;
