import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';

const { EJSON } = require('bson');

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
  // Filter out anything else.
  const parsedSolution = EJSON.stringify(
    EJSON.parse(solution, { relaxed: false })
  );
  const body = { date, solution };

  const { data } = await axios.post(`${url}?secret=${secret}`, body, {
    headers,
  });
  res.status(200).json(data);
};

export default handler;
