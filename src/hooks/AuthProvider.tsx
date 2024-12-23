// React
import { useEffect, useContext, createContext, useState, ReactNode } from "react";
// Routing
import { useNavigate } from "react-router-dom";
// APIs
import AuthAPI from "../apis/AuthAPI.ts";
// Hooks
import { usePopup } from "./PopupProvider.tsx";
// Types
import { User } from "../types/index.ds.ts";

interface AuthContextType {
  authUser: User | null;
  login: (username: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  authUser: null,
  login: () => {},
  logout: () => {},
});

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  // Hooks
  const popup = usePopup();
  const navigate = useNavigate();

  useEffect(() => {
    AuthAPI.getAuthUser()
      .then(res => {
        if(res.data.success) {
          setAuthUser(res.data.user);
        }
      })
      .catch(err => console.log(err));
  }, []);

  const login = async (username: string, password: string) => {
    try {
      let res = await AuthAPI.login(username, password);
      if(res.data.success) {
        setAuthUser(res.data.user);
        navigate("/");
        popup.openPopup("User logged-in");
      } else {
        popup.openPopup(res.data.message);
      }
    } catch(err) {
      console.log(err);
    }
  };

  const logout = async () => {
    try {
      let res = await AuthAPI.logout();
      if(res.data.success) {
        setAuthUser(null);
        navigate("/");
        popup.openPopup("User logged-out");
      }
    } catch(err) {
      console.log(err);
    } 
  };
  
  return (
    <AuthContext.Provider value={{authUser, login, logout}}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};