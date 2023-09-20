import { getUserAuth } from '@/lib/auth/utils';

export default async function Home() {
  const userAuth = await getUserAuth();
  return (
    <main>
      <pre>{JSON.stringify(userAuth, null, 2)}</pre>
    </main>
  );
}
