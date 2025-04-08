import { contactDirectory } from "@/lib/contactDirectory"
import { buildEmailTemplate } from "@/lib/emailTemplateBuilder"
import { sendEmail } from "@/lib/gmailSender" // ✅ Make sure this import is correct

export async function POST(req: Request) {
  const body = await req.json()
  const { siteName, modelName, aliases, onlyfansUrl, offendingLinks } = body

  const contact = contactDirectory[siteName]
  if (!contact) {
    return Response.json({ success: false, error: "No contact found for site." })
  }

  const message = buildEmailTemplate({
    siteName,
    modelName,
    aliases,
    onlyfansUrl,
    offendingLinks,
  })

  try {
    await sendEmail(contact.email, `DMCA Takedown for ${modelName}`, message)
    return Response.json({ success: true, to: contact.email })
  } catch (err) {
    console.error("❌ Email failed:", err)
    return Response.json({ success: false, error: "Email failed to send." })
  }
}
