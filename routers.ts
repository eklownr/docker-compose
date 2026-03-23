import { PrismaClient } from '@prisma/client';
import express from 'express';

const prisma = new PrismaClient();
const router = express.Router();

// GET /userlanguages - Return all users
router.get('/userlanguages', async (req, res) => {
  try {
    const users = await prisma.userLanguage.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

export default router;   