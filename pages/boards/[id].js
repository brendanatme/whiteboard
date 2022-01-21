import * as React from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

const DrawingBoard = dynamic(
  () => import('../../components/DrawingBoard'),
  { ssr: false }
);

// markup
const BoardPage = () => {
  const router = useRouter();
  const { id } = router.query;
  return (
    <main className="bg-white fullscreen">
      <DrawingBoard id={id} />
    </main>
  );
};

export default BoardPage;
