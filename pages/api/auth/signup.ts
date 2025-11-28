import type { NextApiRequest, NextApiResponse } from 'next'
import { promises as fs } from 'fs'
import path from 'path'

type Data = { ok: boolean; message?: string }

const DATA_PATH = path.join(process.cwd(), 'data', 'users.json')

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, message: 'Method Not Allowed' })
  const { email, password } = req.body || {}
  if (!email || !password) return res.status(400).json({ ok: false, message: 'Missing email or password' })

  try {
    const content = await fs.readFile(DATA_PATH, 'utf-8')
    const users = JSON.parse(content) as Array<{ email: string; password: string }>
    if (users.find(u => u.email === email)) {
      return res.status(409).json({ ok: false, message: 'User already exists' })
    }

    users.push({ email, password })
    await fs.writeFile(DATA_PATH, JSON.stringify(users, null, 2), 'utf-8')
    // return a simple token (not secure) for demo purposes
    return res.status(201).json({ ok: true })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ ok: false, message: 'Server error' })
  }
}
