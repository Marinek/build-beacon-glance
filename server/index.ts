import express, { Request, Response } from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const JENKINS_URL = process.env.JENKINS_URL as string;
const JENKINS_USER = process.env.JENKINS_USER as string;
const JENKINS_TOKEN = process.env.JENKINS_TOKEN as string;

app.get('/api/jenkins/jobs', async (_req: Request, res: Response) => {
  try {
    const response = await fetch(`${JENKINS_URL}/api/json`, {
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${JENKINS_USER}:${JENKINS_TOKEN}`).toString('base64'),
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      return res.status(response.status).json({ error: response.statusText });
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Jenkins API request failed', details: error instanceof Error ? error.message : error });
  }
});

app.listen(3001, () => console.log('Server läuft auf Port 3001'));
