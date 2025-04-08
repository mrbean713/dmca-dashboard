"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function ModelAnalysisPage() {
  const router = useRouter()
  const params = useParams()
  const modelId = params.id as string

  const [model, setModel] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [checkingStatus, setCheckingStatus] = useState<string[]>([])
  const [detectedImages, setDetectedImages] = useState<any[]>([])

  useEffect(() => {
    const fetchModel = async () => {
      const { data, error } = await supabase
        .from("models")
        .select("*")
        .eq("id", modelId)
        .single()
      if (error) console.error("Error fetching model:", error.message)
      else setModel(data)
      setLoading(false)
    }

    const cached = localStorage.getItem(`scan-${modelId}`)
    if (cached) setDetectedImages(JSON.parse(cached))

    fetchModel()
  }, [modelId])

  const performDMCAAnalysis = async () => {
    if (!model?.name) return
    setCheckingStatus(["Performing DMCA Analysis..."])
    setDetectedImages([])

    try {
      const res = await fetch("https://dmca-backend.onrender.com/scan-leaks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ modelName: model.name }),
      })      
      const data = await res.json()
      if (data.success) {
        setDetectedImages(data.foundLinks)
        localStorage.setItem(`scan-${modelId}`, JSON.stringify(data.foundLinks))
        setCheckingStatus((prev) => [...prev, "Scan complete."])
      } else {
        setCheckingStatus((prev) => [...prev, "Scan failed."])
      }
    } catch (err) {
      console.error("Scan request error:", err)
      setCheckingStatus((prev) => [...prev, "Scan failed due to error."])
    }
  }

  const resetDMCAAnalysis = async () => {
    if (!modelId) return

    localStorage.removeItem(`scan-${modelId}`)

    await fetch("/api/delete-screenshots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ modelName: model?.name }),
    })

    router.refresh()
  }

  const groupedBySite: Record<string, any[]> = detectedImages.reduce((acc, img) => {
    acc[img.site] = acc[img.site] || []
    acc[img.site].push(img)
    return acc
  }, {})

  if (loading || !model) return <div className="text-white p-8">Loading...</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-700 p-10 text-white">
      <button
        onClick={() => router.push("/dashboard")}
        className="text-white bg-gray-800 hover:bg-gray-700 font-semibold py-2 px-4 rounded mb-6"
      >
        ← Home
      </button>

      <div className="flex gap-10">
        <div className="w-1/2">
          <Image
            src={model.image_url}
            alt={model.name}
            width={600}
            height={600}
            className="rounded-xl object-cover w-full h-auto"
          />
        </div>

        <div className="w-1/2 space-y-4">
          <h1 className="text-4xl font-bold">{model.name}</h1>
          <p className="text-gray-300">{model.description}</p>
          <div className="bg-gray-800 p-4 rounded-lg">
            <p className="text-lg font-semibold">DMCA Reports</p>
            <p className="text-2xl font-bold text-green-400">8 takedowns</p>
          </div>

          <div className="flex gap-4">
            <Button onClick={performDMCAAnalysis} className="bg-red-600 hover:bg-red-700">
              Perform DMCA Analysis
            </Button>
            <Button onClick={resetDMCAAnalysis} className="bg-yellow-600 hover:bg-yellow-700 text-white">
              🔄 Reset DMCA Scan
            </Button>
          </div>

          <div className="mt-4 space-y-1 text-sm text-gray-400">
            {checkingStatus.map((msg, idx) => (
              <div key={idx}>{msg}</div>
            ))}
          </div>
        </div>
      </div>

      {Object.keys(groupedBySite).length > 0 && (
        <div className="mt-12">
          <h2 className="text-3xl font-bold text-white text-center mb-8">Detected Content</h2>
          <div className="grid grid-cols-3 gap-8">
            {Object.entries(groupedBySite).map(([site, images]) => (
              <Link key={site} href={`/dashboard/model/${modelId}/${site}`}>
                <div className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 cursor-pointer transition">
                  <Image
                    src={images[0].url}
                    alt="screenshot preview"
                    width={400}
                    height={300}
                    className="rounded-lg w-full h-auto"
                  />
                  <p className="text-center text-white font-bold mt-4 text-xl">{site}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
