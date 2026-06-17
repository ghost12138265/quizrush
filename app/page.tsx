// app/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import MainMenu from '@/components/MainMenu';
import { loadSave } from '@/lib/save';

export default function HomePage() {
  const router = useRouter();

  const handleStart = (mode: 'level' | 'endless', resumeData?: ReturnType<typeof loadSave>) => {
    if (resumeData) {
      router.push(`/game?mode=${mode}&resume=true`);
    } else {
      router.push(`/game?mode=${mode}`);
    }
  };

  return <MainMenu onStart={handleStart} />;
}
