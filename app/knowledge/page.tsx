'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import KnowledgeBase from '@/components/KnowledgeBase';

function KnowledgePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleBack = () => {
    router.push('/');
  };

  return <KnowledgeBase onBack={handleBack} />;
}

export default function KnowledgePage() {
  return (
    <Suspense fallback={
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', color: '#888', fontSize: 18,
      }}>
        ⏳ 加载中…
      </div>
    }>
      <KnowledgePageContent />
    </Suspense>
  );
}
