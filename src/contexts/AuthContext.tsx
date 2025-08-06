import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Employee } from "../types/index";
import { mockEmployees } from "../data/mockData";
import { computeFinalPermissions } from "../types/levels";
import { FeatureKey } from "../types/features";

interface AuthContextType {
  user: Employee | null;
  permissions: FeatureKey[];
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<Employee | null>(null);
  const [permissions, setPermissions] = useState<FeatureKey[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("hr_user");
    if (saved) {
      const parsed = JSON.parse(saved) as Employee;
      setUser(parsed);
      console.log(parsed)
      const computed = computeFinalPermissions(
        parsed.level,
        parsed.customOverrides || []
      );
      setPermissions(computed);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const foundUser = mockEmployees.find((u) => u.email === email);
    if (foundUser && password === "password") {
      setUser(foundUser);
      const computed = computeFinalPermissions(
        foundUser.level,
        foundUser.customOverrides || []
      );
      setPermissions(computed);
      localStorage.setItem("hr_user", JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setPermissions([]);
    localStorage.removeItem("hr_user");
  };

  const value: AuthContextType = {
    user,
    permissions,
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};
