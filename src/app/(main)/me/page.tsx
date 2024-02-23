import { getUserAuth } from '@/lib/auth/utils';

export default async function Me() {
  const userAuth = await getUserAuth();

  return (
    <div>
      <pre>{JSON.stringify(userAuth, null, 2)}</pre>
    </div>
  );
}
