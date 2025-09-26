
import { IronSessionOptions } from 'iron-session';

// This file is used for the admin session, not user sessions.
export const adminSessionOptions: IronSessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD as string,
  cookieName: 'daroo-ai-admin-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};
