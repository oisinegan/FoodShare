import { useEffect, useState, createContext } from "react";
import { decodeToken } from "react-jwt";

export const myContext = createContext();
export default function Context({ children }) {
  const [user, setUser] = useState([{}]);
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("HERE");

    if (token) {
      console.log("HERE");
      const user = decodeToken(token);

      setUser(user);
      if (!user) {
        localStorage.removeItem("token");
      }
    } else {
      setUser("null");
    }
  }, []);
  return <myContext.Provider value={user}>{children}</myContext.Provider>;
}
