// pages/api/health.ts
import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        res.status(200).json({ message: 'Frontend is running!' });
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
