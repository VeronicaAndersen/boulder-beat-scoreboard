import { LoginForm } from "@/components/LoginForm";

export default function Login() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#c6d2b8] px-4">
      <div className="flex flex-col items-center">
        {/* Logo */}
        <img
          src="/grepp.svg"
          alt="Grepp logo"
          className="w-48 h-28 object-contain drop-shadow-md"
        />

        <LoginForm />
      </div>
    </div>
  );
}
