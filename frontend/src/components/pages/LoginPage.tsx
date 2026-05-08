import AuthLayout from "../layout/AuthLayout";
import LoginForm from "../LoginForm";

type Props = {
  onLogin: () => void;
};

export default function LoginPage({
  onLogin,
}: Props) {

  return (
    <AuthLayout>
      <LoginForm
        onLogin={onLogin}
      />
    </AuthLayout>
  );
}