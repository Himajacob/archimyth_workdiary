import Login from "./components/Login";
import InviteUser from "./components/InviteUser";
import { getToken, getUserRole } from "./utils/auth";

function App() {
  const token = getToken();

  if (!token) {
    return <Login />;
  }

  const role = getUserRole();

  if (role !== "admin") {
    return <h2>Access Denied (Admin only)</h2>;
  }

  return <InviteUser />;
}

export default App;