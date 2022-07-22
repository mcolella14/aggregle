import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
import JSON5 from 'json5';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).send('This is a POST-only ednpoint.');
  }

  const url = process.env['ANSWER_API_URL'];
  if (!url) {
    throw Error('ANSWER_API_URL is not defined');
  }
  const secret = process.env['ANSWER_API_KEY'];
  if (!secret) {
    throw Error('ANSWER_API_KEY is not defined');
  }

  const apiKey = process.env['DATA_API_KEY'];
  if (!apiKey) {
    throw Error('DATA_API_KEY is not defined');
  }

  const headers = {
    'Content-Type': 'application/json',
    'api-key': apiKey,
  };

  const { date, solution } = req.body;
  // Parse to regular JSON.
  const parsedSolution = JSON.stringify(JSON5.parse(solution));
  const body = { date, solution: parsedSolution };

  const { data } = await axios.post(`${url}?secret=${secret}`, body, {
    headers,
  });
  res.status(200).json(data);
};

export default handler;
