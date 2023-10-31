import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

type AuthSession = {
  session: {
    user: {
      id: string;
      name?: string;
      email?: string;
    };
  } | null;
  userId: string;
};

export const getUserAuth = async (): Promise<AuthSession> => {
  const { userId } = auth();
  if (userId) {
    return {
      session: {
        user: {
          id: userId
        }
      },
      userId
    } as AuthSession;
  } else {
    return { session: null, userId: '' };
  }
};

export const checkAuth = async () => {
  const { userId } = auth();
  if (!userId) redirect('/sign-in');
};
