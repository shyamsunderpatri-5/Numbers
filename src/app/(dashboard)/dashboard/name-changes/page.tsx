import React from 'react';
import { FamousNameChanges } from '@/components/dashboard/FamousNameChanges';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Vibrational Shifts | NUMERIQ.AI",
  description: "Explore famous names that changed their destiny through vibrational alignment.",
};

export default function NameChangesPage() {
  return (
    <div className="space-y-10">
      <FamousNameChanges />
    </div>
  );
}
