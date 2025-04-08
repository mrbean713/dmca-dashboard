"use client"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ModelAnalysisPage() {
  const { id } = useParams()
  const router = useRouter()
  const [showResult, setShowResult] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleScan = () => {
    setLoading(true)
    setTimeout(() => {
      setShowResult(true)
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">DMCA Analysis: Sophie Rain</h1>

      {/* Big profile image */}
      <div className="w-full flex justify-center mb-8">
        <Image
          src="/screenshots/sophie-rain-profile.jpg" // Make sure this image exists!
          alt="Sophie Rain"
          width={400}
          height={400}
          className="rounded-2xl shadow-lg"
        />
      </div>

      {!showResult && (
        <div className="flex justify-center">
          <Button
            onClick={handleScan}
            className="bg-red-600 hover:bg-red-700 text-white text-lg px-6 py-3"
          >
            {loading ? "Performing..." : "Perform DMCA Analysis"}
          </Button>
        </div>
      )}

      {showResult && (
        <div className="mt-10">
          <Link href={`/dashboard/model/${id}/fapello.com`}>
            <div className="cursor-pointer bg-gray-800 hover:bg-gray-700 rounded-lg p-6 shadow-lg transition">
              <h2 className="text-xl font-bold mb-4">fapello.com</h2>
              <Image
                src="/screenshots/fapello-preview.png" // e.g. homepage screenshot or logo
                alt="fapello.com"
                width={600}
                height={300}
                className="rounded-lg"
              />
            </div>
          </Link>
        </div>
      )}
    </div>
  )
}
