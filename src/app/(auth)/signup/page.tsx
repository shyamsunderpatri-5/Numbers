/**
 * NUMERIQ.AI - Sign Up Page
 */

import { AuthSplitLayout } from "@/components/auth/AuthSplitLayout";
import { SignupForm } from "@/components/auth/SignupForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account | NUMERIQ.AI",
  description: "Join the world's most advanced Chaldean numerology platform.",
};

export default function SignupPage() {
  return (
    <AuthSplitLayout 
      title="Begin Your Journey" 
      subtitle="Complete the initiation to access ancient wisdom powered by modern AI."
    >
      <SignupForm />
    </AuthSplitLayout>
  );
}
