"use client"
import { useParams } from "next/navigation"
import { useState } from "react"
import Image from "next/image"

const images = [
  "/screenshots/sophie-rain-diskussion-sophie-rain-3.png",
  "/screenshots/sophie-rain-sophie-rain-59.png",
  "/screenshots/sophie-rain-sophie-rain-x.png",
  "/screenshots/sophie-rain-sophie-rainn.png",
]

export default function DomainPage() {
  const { site } = useParams()
  const [reportSent, setReportSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSendReport = () => {
    setLoading(true)
    setTimeout(() => {
      setReportSent(true)
      setLoading(false)
    }, 1000) // Simulate sending delay
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Detected Content from {site}</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {images.map((img, idx) => (
          <a key={idx} href={img} target="_blank" rel="noopener noreferrer">
            <Image
              src={img}
              alt={`leak-${idx}`}
              width={300}
              height={300}
              className="rounded-lg hover:scale-105 transition duration-300"
            />
          </a>
        ))}
      </div>

      {!reportSent ? (
        <button
          onClick={handleSendReport}
          disabled={loading}
          className={`px-6 py-3 rounded-lg text-white text-lg transition ${
            loading ? 'bg-green-800 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {loading ? "Sending..." : "Send DMCA Report"}
        </button>
      ) : (
        <div className="text-green-400 text-xl font-semibold">
          ✅ DMCA Report Sent Successfully!
        </div>
      )}
    </div>
  )
}
