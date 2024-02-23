import { useAuth } from '@clerk/nextjs';

export default async function Me() {
  const { getToken } = useAuth();

  const token = await getToken();

  return <div>Token: {token}</div>;
}
