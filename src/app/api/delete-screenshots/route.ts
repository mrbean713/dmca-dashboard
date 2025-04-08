import fs from 'fs'
import path from 'path'

export async function POST(req: Request) {
  const { modelName } = await req.json()
  if (!modelName) return new Response("Missing modelName", { status: 400 })

  const query = modelName.toLowerCase().replace(/\s+/g, '-')
  const screenshotDir = path.join(process.cwd(), 'public', 'screenshots')
  const files = fs.readdirSync(screenshotDir)

  const deleted: string[] = []

  for (const file of files) {
    if (file.startsWith(query)) {
      fs.unlinkSync(path.join(screenshotDir, file))
      deleted.push(file)
    }
  }

  return Response.json({ success: true, deleted })
}
