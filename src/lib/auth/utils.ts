import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

type AuthSession = {
  session: {
    user: {
      id: string;
      name?: string;
      email?: string;
    };
    id?: string;
    token?: unknown;
    claims?: unknown;
  } | null;
  userId: string;
};

export const getUserAuth = async (): Promise<AuthSession> => {
  const { userId, getToken, sessionId, sessionClaims } = auth();

  if (userId) {
    return {
      session: {
        user: {
          id: userId
        },
        id: sessionId,
        token: getToken,
        claims: sessionClaims
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
