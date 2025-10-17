import { RegistrationForm } from "@/components/RegistrationForm";

export default function Registration() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#c6d2b8] px-4">
      <div className="flex flex-col items-center">
        {/* Logo */}
        <img
          src="/grepp.svg"
          alt="Grepp logo"
          className="w-24 h-24 object-contain drop-shadow-md"
        />

        {/* Registration Form */}
        <RegistrationForm />
      </div>
    </div>
  );
}
