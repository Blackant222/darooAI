import { withIronSessionApiRoute } from 'iron-session/edge';
import { adminSessionOptions } from '@/lib/session';
import { NextApiRequest, NextApiResponse } from 'next';

function logoutRoute(req: NextApiRequest, res: NextApiResponse) {
  req.session.destroy();
  res.status(200).json({ success: true });
}

export default withIronSessionApiRoute(logoutRoute, adminSessionOptions);
