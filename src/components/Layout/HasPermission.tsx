import React, { ReactNode } from "react";
import { FeatureKey } from "../../types/features";
import { useAuth } from "../../contexts/AuthContext";

interface HasPermissionProps {
  permission: FeatureKey;
  children: ReactNode;
}

const HasPermission: React.FC<HasPermissionProps> = ({ permission, children }) => {
  const { permissions } = useAuth();

  return permissions.includes(permission) ? <>{children}</> : null;
};

export default HasPermission;
