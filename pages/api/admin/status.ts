import { withIronSessionApiRoute } from 'iron-session/edge';
import { adminSessionOptions } from '@/lib/session';
import { NextApiRequest, NextApiResponse } from 'next';

async function statusRoute(req: NextApiRequest, res: NextApiResponse) {
  if (req.session.admin?.isLoggedIn) {
    res.json({ admin: true });
  } else {
    res.json({ admin: false });
  }
}

export default withIronSessionApiRoute(statusRoute, adminSessionOptions);
