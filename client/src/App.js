import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Landing from "./pages/Landing";
import Context from "./pages/context";

function App() {
  //const context = useContext(myContext);

  return (
    <BrowserRouter>
      <Context>
        <Routes>
          <Route index element={<Landing />} />
          <Route path="Login" element={<Login />} />
          <Route path="Register" element={<Register />} />
          {/* <Route path="Rentals" element={<ShowAll />} />
      <Route path="Filter" element={<Filter />} />
      <Route path="Search" element={<Search />} />
      <Route path="Property" element={<Property />} /> */}

          {/* {context === "undefined" ? (
          <>
            <Route path="Login" element={<Login />} />
          </>
        ) : (
          <>
            <Route path="PostAd" element={<PostAd />} />
          </>
        )} */}
        </Routes>
      </Context>
    </BrowserRouter>
  );
}

export default App;
