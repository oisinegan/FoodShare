import { useEffect, useState, createContext } from "react";
import { decodeToken } from "react-jwt";

export const myContext = createContext();
export default function ContextUser({ children }) {
  const [user, setUser] = useState([{}]);
  console.log(user);
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const user = decodeToken(token);

      setUser(user);
      if (!user) {
        localStorage.removeItem("token");
      }
    } else {
      setUser("null");
    }

    console.log(user);
  }, [user]);
  return <myContext.Provider value={user}>{children}</myContext.Provider>;
}
