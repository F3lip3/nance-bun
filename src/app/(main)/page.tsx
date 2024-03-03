'use client';

import { Button } from '@/components/ui/button';

// eslint-disable-next-line @next/next/no-async-client-component
export default function Home() {
  // const userAuth = await getUserAuth();

  const handleClick = () => {
    console.info('A');
  };

  return (
    <main>
      {/* <pre>{JSON.stringify(userAuth, null, 2)}</pre> */}
      <Button onClick={handleClick}>Click Me</Button>
    </main>
  );
}
