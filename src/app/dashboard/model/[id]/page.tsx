"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import Image from "next/image"
import { Button } from "@/components/ui/button"

const websitesToCheck = [
  "reddit.com",
  "xvideos.com",
  "piratesnapz.cc",
  "onlyfansleaks.net",
  "tumblr.com",
]

export default function ModelAnalysisPage() {
  const router = useRouter()
  const params = useParams()
  const modelId = params.id as string

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [model, setModel] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [checkingStatus, setCheckingStatus] = useState<string[]>([])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [detectedImages, setDetectedImages] = useState<any[]>([])
  // const [scanning, setScanning] = useState(false)

  useEffect(() => {
    const fetchModel = async () => {
      const { data, error } = await supabase
        .from("models")
        .select("*")
        .eq("id", modelId)
        .single()

      if (error) {
        console.error("Error fetching model:", error.message)
      } else {
        setModel(data)
      }

      setLoading(false)
    }

    fetchModel()
  }, [modelId])

  const performDMCAAnalysis = async () => {
    // setScanning(true)
    setCheckingStatus(["Performing DMCA Analysis..."])
    for (const site of websitesToCheck) {
      await new Promise((r) => setTimeout(r, 1000))
      setCheckingStatus((prev) => [...prev, `Checking ${site}...`])
    }

    // Simulated results
    const results = [
      {
        url: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
        site: "reddit.com",
      },
      {
        url: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg",
        site: "xvideos.com",
      },
      {
        url: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
        site: "piratesnapz.cc",
      },
    ]

    setDetectedImages(results)
  }

  if (loading || !model) {
    return <div className="text-white p-8">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-700 p-10 text-white">
      {/* Home Button */}
      <button
        onClick={() => router.push("/dashboard")}
        className="text-white bg-gray-800 hover:bg-gray-700 font-semibold py-2 px-4 rounded mb-6"
      >
        ← Home
      </button>

      {/* Header Info */}
      <div className="flex gap-10">
        {/* Left Image */}
        <div className="w-1/2">
          <Image
            src={model.image_url}
            alt={model.name}
            width={600}
            height={600}
            className="rounded-xl object-cover w-full h-auto"
          />
        </div>

        {/* Right Info */}
        <div className="w-1/2 space-y-4">
          <h1 className="text-4xl font-bold">{model.name}</h1>
          <p className="text-gray-300">{model.description}</p>
          <div className="bg-gray-800 p-4 rounded-lg">
            <p className="text-lg font-semibold">DMCA Reports</p>
            <p className="text-2xl font-bold text-green-400">8 takedowns</p>
          </div>

          <Button
            className="bg-red-600 hover:bg-red-700 text-white font-semibold"
            onClick={performDMCAAnalysis}
          >
            Perform DMCA Analysis
          </Button>

          <div className="mt-4 space-y-1 text-sm text-gray-400">
            {checkingStatus.map((msg, idx) => (
              <div key={idx}>{msg}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Detected Content Grid */}
      {detectedImages.length > 0 && (
        <div className="mt-12">
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Detected Content
          </h2>

          <div className="grid grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, colIdx) => (
              <div className="flex flex-col gap-6" key={colIdx}>
                {detectedImages
                  .filter((_, i) => i % 3 === colIdx)
                  .map((img, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-800 p-4 rounded-lg flex flex-col items-center"
                    >
                      <Image
                        src={img.url}
                        alt={`Detected content ${idx + 1}`}
                        width={300}
                        height={200}
                        className="rounded"
                      />
                      <p className="text-white mt-2">{img.site}</p>
                      <button className="mt-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition">
                        Send DMCA Report
                      </button>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
