'use client';

import { Suspense } from 'react';
import { useRouter } from 'next/navigation';
import WrongBook from '@/components/WrongBook';

function WrongBookPageContent() {
  const router = useRouter();

  const handleBack = () => {
    router.push('/');
  };

  return <WrongBook onBack={handleBack} />;
}

export default function WrongBookPage() {
  return (
    <Suspense fallback={
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', color: '#888', fontSize: 18,
      }}>
        ⏳ 加载中…
      </div>
    }>
      <WrongBookPageContent />
    </Suspense>
  );
}
