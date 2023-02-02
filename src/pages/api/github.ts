import type { NextApiRequest, NextApiResponse } from 'next'
import { octokit } from "@/helpers/octokit";

type Data = {
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    res.status(405).send({ message: 'Only POST requests allowed' })
    return
  }
  
  const body = JSON.parse(req.body)

  if (body.request) {
    const params = body.params ? body.params : {}
    const result = await octokit.request(body.request as string, params)
    res.status(200).json(result.data)
    return
  }

  res.status(500).json({ message: 'internal error' })
  return
}
