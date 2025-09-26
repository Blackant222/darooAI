import { withIronSessionApiRoute } from 'iron-session';
import { adminSessionOptions } from '@/lib/session';
import { NextApiRequest, NextApiResponse } from 'next';

const ADMIN_USERNAME = 'Admin';
const ADMIN_PASSWORD = 'Ashyas2710';

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
  const { username, password } = await req.body;

  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    req.session.admin = {
      isLoggedIn: true,
      username: ADMIN_USERNAME
    };
    await req.session.save();
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, message: 'نام کاربری یا رمز عبور نامعتبر است' });
  }
}

export default withIronSessionApiRoute(loginRoute, adminSessionOptions);
