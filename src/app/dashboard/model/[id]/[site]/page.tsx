"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function DomainDetailPage() {
  const params = useParams()
  const router = useRouter()
  const modelId = params.id as string
  const site = decodeURIComponent(params.site as string)

  const [model, setModel] = useState<any>(null)
  const [filteredImages, setFilteredImages] = useState<any[]>([])

  useEffect(() => {
    const fetchModel = async () => {
      const { data } = await supabase.from("models").select("*").eq("id", modelId).single()
      setModel(data)
    }

    const loadImagesFromStorage = () => {
      const stored = localStorage.getItem(`scan-${modelId}`)
      if (!stored) return
      const all = JSON.parse(stored)
      const forSite = all.filter((img: any) => img.site === site)
      setFilteredImages(forSite)
    }

    fetchModel()
    loadImagesFromStorage()
  }, [modelId, site])

  const removeImage = (url: string) => {
    setFilteredImages(filteredImages.filter((img) => img.url !== url))
  }

  const [sendingStatus, setSendingStatus] = useState<string | null>(null)

  const DEMO_MODE = true

  const sendReport = async () => {
    setSendingStatus("Sending email...")
  
    if (DEMO_MODE) {
      setTimeout(() => {
        setSendingStatus("✅ Email successfully sent to nicksobhanian@gmail.com!")
      }, 1500)
      return
    }
  
    const res = await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        siteName: site,
        modelName: model?.name,
        aliases: model?.aliases || [],
        onlyfansUrl: model?.onlyfans_url,
        offendingLinks: filteredImages.map((img) => img.url),
      }),
    })
  
    const data = await res.json()
    if (data.success) {
      setSendingStatus(`✅ Email successfully sent to ${data.to}!`)
    } else {
      setSendingStatus("❌ Failed to send email.")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-700 p-10 text-white">
      <button
        onClick={() => router.push("/dashboard")}
        className="mb-6 text-white bg-gray-800 hover:bg-gray-700 font-semibold py-2 px-4 rounded transition"
      >
        ← Home
      </button>
  
      <h1 className="text-4xl font-bold mb-10 text-center capitalize">{site}</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredImages.map((img, i) => (
          <div
            key={i}
            className="relative bg-gray-800 rounded-lg overflow-hidden group shadow-lg hover:shadow-2xl transition"
          >
            {/* Remove Button */}
            <button
              onClick={() => removeImage(img.url)}
              className="absolute top-2 right-2 bg-white bg-opacity-80 text-red-600 text-lg font-bold rounded-full w-8 h-8 flex items-center justify-center transition-all duration-200 hover:bg-red-600 hover:text-white hover:scale-110"
              title="Remove image"
            >
              ❌
            </button>

            {/* Clickable Image */}
            <a href={img.sourceUrl} target="_blank" rel="noopener noreferrer">
              <Image
                src={img.url}
                alt={`screenshot-${i}`}
                width={600}
                height={400}
                className="object-cover w-full h-[300px] rounded"
              />
            </a>
          </div>
        ))}
      </div>

      {filteredImages.length > 0 && (
        <div className="text-center mt-12">
          <Button
            disabled={sendingStatus === "Sending email..."}
            className={`bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg py-3 px-8 rounded-lg shadow-md transition ${
              sendingStatus === "Sending email..." ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={sendReport}
          >
            📩 Send DMCA Report ({filteredImages.length} item{filteredImages.length > 1 ? "s" : ""})
          </Button>
          {sendingStatus && (
  <p className="mt-4 text-center text-lg text-white">{sendingStatus}</p>
)}
        </div>
      )}
    </div>
  )
}
