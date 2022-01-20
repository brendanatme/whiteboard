import * as React from 'react';
import dynamic from 'next/dynamic';

const DrawingBoard = dynamic(
  () => import('../components/DrawingBoard'),
  { ssr: false }
);

// markup
const IndexPage = () => {
  return (
    <main className="bg-white fullscreen">
      <DrawingBoard />
    </main>
  );
};

export default IndexPage;
