import React from "react";
import { useAppContext } from "../context/AppContext";
import type { UserRole } from "../../types";

interface OnlyForProps {
  roles: UserRole[];
  children: React.ReactNode;
}

const OnlyFor: React.FC<OnlyForProps> = ({ roles, children }) => {
  const { userRole } = useAppContext();
  if (!userRole || !roles.includes(userRole)) return null;
  return <>{children}</>;
};

export default OnlyFor;
