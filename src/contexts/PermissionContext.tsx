import React, { createContext, useContext, ReactNode } from "react";
import { FeatureKey } from "../types/features";

const PermissionsContext = createContext<FeatureKey[]>([]);

interface PermissionsProviderProps {
  permissions: FeatureKey[];
  children: ReactNode;
}

export const PermissionsProvider: React.FC<PermissionsProviderProps> = ({
  permissions,
  children,
}) => {
  return (
    <PermissionsContext.Provider value={permissions}>
      {children}
    </PermissionsContext.Provider>
  );
};

export const usePermissions = () => useContext(PermissionsContext);
