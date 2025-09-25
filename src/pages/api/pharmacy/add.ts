
import { NextApiRequest, NextApiResponse } from 'next';
import pool from '@/lib/db';
import { withIronSessionApiRoute } from 'iron-session/next';
import { sessionOptions } from '@/lib/session';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  if (!req.session.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  const userId = req.session.user.id;
  const { drug_name, category, tags } = req.body;

  if (!drug_name || !category) {
    return res.status(400).json({ message: 'Drug name and category are required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO pharmacy_items (user_id, drug_name, category, tags) VALUES ($1, $2, $3, $4) RETURNING *',
      [userId, drug_name, category, tags]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export default withIronSessionApiRoute(handler, sessionOptions);
