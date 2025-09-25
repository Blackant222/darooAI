
import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/lib/db';
import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '@/lib/session';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  if (!req.session.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  const userId = req.session.user.id;
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: 'Item ID is required' });
  }

  try {
    const result = await pool.query('DELETE FROM pharmacy_items WHERE id = $1 AND user_id = $2 RETURNING *', [id, userId]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Item not found or you do not have permission to delete it' });
    }
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export default withIronSessionApiRoute(handler, sessionOptions);
