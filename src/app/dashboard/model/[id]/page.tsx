"use client"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ModelAnalysisPage() {
  const { id } = useParams()
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [scanDone, setScanDone] = useState(false)

  const handleScan = () => {
    setLoading(true)
    setTimeout(() => {
      setScanDone(true)
      setLoading(false)
    }, 1000)
  }

  const handleReset = () => {
    setScanDone(false)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8 flex flex-col md:flex-row gap-10">
      {/* Left side: Profile image */}
      <div className="flex flex-col items-center">
        <Image
          src="/screenshots/sophie-rain-profile.jpg"
          alt="Sophie Rain"
          width={150}
          height={150}
          className="rounded-full object-cover border-4 border-white shadow-md mb-4"
        />
        <span className="text-xl font-semibold">Sophie Rain</span>
      </div>

      {/* Right side: Details */}
      <div className="flex-1">
        <h1 className="text-4xl font-bold mb-2">Sophie Rain</h1>
        <p className="text-gray-400 mb-4">test 2</p>

        <div className="bg-gray-800 p-4 rounded-lg mb-6">
          <p className="text-lg font-semibold">DMCA Reports</p>
          <p className="text-2xl text-green-400 font-bold">8 takedowns</p>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mb-4">
          <Button
            onClick={handleScan}
            disabled={loading || scanDone}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2"
          >
            {loading ? "Performing DMCA Analysis..." : "Perform DMCA Analysis"}
          </Button>

          <Button
            onClick={handleReset}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2"
          >
            Reset DMCA Scan
          </Button>
        </div>

        {/* Result card */}
        {scanDone && !loading && (
          <Link href={`/dashboard/model/${id}/fapello.com`}>
            <div className="bg-gray-700 hover:bg-gray-600 transition cursor-pointer rounded-lg p-6 mt-6 shadow-lg">
              <h2 className="text-xl font-bold mb-4">fapello.com</h2>
              <Image
                src="/screenshots/fapello-preview.png"
                alt="fapello"
                width={600}
                height={300}
                className="rounded-md"
              />
            </div>
          </Link>
        )}
      </div>
    </div>
  )
}
