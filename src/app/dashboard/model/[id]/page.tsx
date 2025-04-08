"use client"
import { useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function ModelAnalysisPage() {
  const [detected, setDetected] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const { id } = useParams()

  const handleScan = () => {
    setLoading(true)

    // Simulate a delay for realism
    setTimeout(() => {
      const fakeResults = [
        {
          domain: "fapello.com",
          images: [
            "/screenshots/sophie-rain-diskussion-sophie-rain-3.png",
            "/screenshots/sophie-rain-sophie-rain-59.png",
            "/screenshots/sophie-rain-sophie-rain-x.png",
            "/screenshots/sophie-rain-sophie-rainn.png",
          ],
        },
      ]

      setDetected(fakeResults)
      setLoading(false)
    }, 1000) // 1-second delay to simulate scanning
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">DMCA Analysis</h1>

      {!detected.length && (
        <div>
          <Button onClick={handleScan} className="bg-red-600 hover:bg-red-700 text-white">
            {loading ? "Performing..." : "Perform DMCA Analysis"}
          </Button>
        </div>
      )}

      {detected.length > 0 && (
        <div className="space-y-8 mt-8">
          {detected.map((site) => (
            <div key={site.domain}>
              <Link href={`/dashboard/model/${id}/${site.domain}`}>
                <h2 className="text-xl font-bold mb-2 underline hover:text-blue-300 cursor-pointer">
                  {site.domain}
                </h2>
              </Link>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {site.images.map((img: string, idx: number) => (
                  <Image
                    key={idx}
                    src={img}
                    alt={`leak-${idx}`}
                    width={300}
                    height={300}
                    className="rounded-lg"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
