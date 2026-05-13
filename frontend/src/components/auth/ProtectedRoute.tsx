import {
  Navigate,
} from "react-router-dom";

import {
  getToken,
  isTokenExpired,
} from "../../utils/auth";

type Props = {
  children: React.ReactNode;
};

export default function ProtectedRoute({
  children,
}: Props) {

  const token = getToken();

  if (
    !token ||
    isTokenExpired(token)
  ) {

    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}