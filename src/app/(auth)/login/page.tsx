/**
 * NUMERIQ.AI - Login Page
 */

import { AuthSplitLayout } from "@/components/auth/AuthSplitLayout";
import { LoginForm } from "@/components/auth/LoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | NUMERIQ.AI",
  description: "Secure access to your global numerology intelligence platform.",
};

export default function LoginPage() {
  return (
    <AuthSplitLayout 
      title="Welcome Back" 
      subtitle="Enter your credentials to access your unified numerical matrix."
    >
      <LoginForm />
    </AuthSplitLayout>
  );
}
