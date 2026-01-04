import React from 'react';
import Link from 'next/link';
import { PublicLayout } from '@/components/PublicLayout';
import { ArrowLeft } from 'lucide-react';
import { ContactForm } from '@/components/ContactForm';

export default function ContactSupportPage() {
  return (
    <PublicLayout>
      <div className="pt-32 pb-16 px-6">
        <ContactForm />
      </div>
    </PublicLayout>
  );
}
