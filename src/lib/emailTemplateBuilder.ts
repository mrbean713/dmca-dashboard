export function buildEmailTemplate({
  siteName,
  modelName,
  aliases,
  onlyfansUrl,
  offendingLinks,
}: {
  siteName: string
  modelName: string
  aliases: string[]
  onlyfansUrl: string
  offendingLinks: string[]
}) {
  const aliasLine = aliases.length ? aliases.join(", ") : modelName

  const body = `
    <p>To the Registered DMCA Agent for <strong>${siteName}</strong>:</p>

    <p>My name is <strong>${modelName}</strong>. I am the exclusive rights holder for content that is appearing on your website.</p>

    <p>This email is official notification under Section 512(c) of the Digital Millennium Copyright Act (“DMCA”), and I seek the immediate removal of the following infringing material:</p>

    <p><strong>Pseudonyms / Handles:</strong> ${aliasLine}</p>
    <p><strong>Original URL:</strong> ${onlyfansUrl}</p>

    <p><strong>Infringing URLs:</strong></p>
    <ul>
      ${offendingLinks
        .map((link) => `<li>https://yourdomain.com${link}</li>`)
        .join("")}
    </ul>

    <p>Contact Info:<br/>
    ${modelName}<br/>
    Email: your-email@gmail.com<br/>
    OnlyFans: ${onlyfansUrl}</p>

    <p>Sincerely,<br/>
    ${modelName}</p>
  `

  return body
}
