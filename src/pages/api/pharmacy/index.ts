
import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/lib/db';
import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '@/lib/session';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  const userId = req.session.user.id;

  try {
    const result = await pool.query('SELECT * FROM pharmacy_items WHERE user_id = $1 ORDER BY added_at DESC', [userId]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export default withIronSessionApiRoute(handler, sessionOptions);
