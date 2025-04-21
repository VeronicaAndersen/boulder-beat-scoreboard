import { useState } from "react";
import LogInPage from "@/components/LogInPage";

const Index = () => {
  const [userName, setUserName] = useState<string | null>(null);

  const handleLogin = (name: string) => {
    setUserName(name); // Save the logged-in user's name
    console.log(`User logged in: ${name}`);
  };

  if (!userName) {
    return <LogInPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#505654] to-[#c6d1b8] text-gray-100">
      <h1 className="text-4xl font-bold mb-6">Welcome, {userName}!</h1>
      <p className="text-lg">You are now logged in.</p>
    </div>
  );
};
export default Index;