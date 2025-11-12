import { RegistrationForm } from "@/components/RegistrationForm";

export default function Registration() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">      
      <img src="../../public/grepp.svg" alt="grepp logo" className="w-28 absolute top-8 left-5"/>
      <RegistrationForm />
    </div>
  );
}
