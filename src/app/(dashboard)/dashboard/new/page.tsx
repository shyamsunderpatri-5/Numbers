import HighConversionReadingView from "@/components/dashboard/HighConversionReadingView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Reading | NUMERIQ.AI",
  description: "Initiate your high-conversion numerical analysis.",
};

export default function NewReadingPage() {
  return (
    <div className="max-w-7xl mx-auto py-8">
      <HighConversionReadingView />
    </div>
  );
}
