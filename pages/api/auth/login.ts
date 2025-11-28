import type { NextApiRequest, NextApiResponse } from 'next'
import { promises as fs } from 'fs'
import path from 'path'

type Data = { ok: boolean; token?: string; message?: string }

const DATA_PATH = path.join(process.cwd(), 'data', 'users.json')

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, message: 'Method Not Allowed' })
  const { email, password } = req.body || {}
  if (!email || !password) return res.status(400).json({ ok: false, message: 'Missing email or password' })

  try {
    const content = await fs.readFile(DATA_PATH, 'utf-8')
    const users = JSON.parse(content) as Array<{ email: string; password: string }>
    const user = users.find(u => u.email === email && u.password === password)
    if (!user) return res.status(401).json({ ok: false, message: 'Invalid credentials' })

    // For demo just return a fake token
    const token = Buffer.from(`${email}:${Date.now()}`).toString('base64')
    return res.status(200).json({ ok: true, token })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ ok: false, message: 'Server error' })
  }
}
