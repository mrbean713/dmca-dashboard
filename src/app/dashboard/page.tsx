"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog } from "@headlessui/react"
import Image from "next/image"

type Model = {
  id: number
  name: string
  description: string
  image_url: string
}

type NewModel = {
  name: string
  description: string
  image: string | File
}

export default function DashboardPage() {
  const router = useRouter()
  const [models, setModels] = useState<Model[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [editingModelId, setEditingModelId] = useState<number | null>(null)

  const [newModel, setNewModel] = useState<NewModel>({
    name: "",
    description: "",
    image: "",
  })

  useEffect(() => {
    const fakeUserId = "61a09725-67fd-47c1-b85a-f2b23de27294"
    setUserId(fakeUserId)

    const getModels = async () => {
      const { data, error } = await supabase
        .from("models")
        .select("*")
        .eq("agency_id", fakeUserId)

      if (error) {
        console.error("Error loading models:", error.message)
      } else {
        setModels(data)
      }

      setLoading(false)
    }

    getModels()
  }, [])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setNewModel((prev) => ({ ...prev, image: file }))
    }
  }

  const addOrEditModel = async () => {
    if (!userId) return

    let image_url = typeof newModel.image === "string" ? newModel.image : ""

    if (typeof newModel.image === "object") {
      const filePath = `models/${Date.now()}_${newModel.image.name}`
      const { error: storageError } = await supabase.storage
        .from("profile-pics")
        .upload(filePath, newModel.image)

      if (storageError) {
        console.error("Upload error:", storageError.message)
        return
      }

      image_url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/profile-pics/${filePath}`
    }

    if (editingModelId) {
      const { error, data } = await supabase
        .from("models")
        .update({
          name: newModel.name,
          description: newModel.description,
          image_url,
        })
        .eq("id", editingModelId)
        .select()

      if (error) {
        console.error("Update error:", error.message)
        return
      }

      setModels((prev) =>
        prev.map((model) => (model.id === editingModelId ? data[0] : model))
      )
    } else {
      const { error, data } = await supabase
        .from("models")
        .insert([
          {
            name: newModel.name,
            description: newModel.description,
            image_url,
            agency_id: userId,
          },
        ])
        .select()

      if (error) {
        console.error("Insert error:", error.message)
        return
      }

      setModels((prev) => [...prev, ...data])
    }

    setNewModel({ name: "", description: "", image: "" })
    setEditingModelId(null)
    setIsOpen(false)
  }

  const handleEdit = (model: Model) => {
    setNewModel({
      name: model.name,
      description: model.description,
      image: model.image_url,
    })
    setEditingModelId(model.id)
    setIsOpen(true)
  }

  const handleDelete = async (id: number) => {
    const { error } = await supabase.from("models").delete().eq("id", id)
    if (error) {
      console.error("Delete error:", error.message)
      return
    }
    setModels((prev) => prev.filter((m) => m.id !== id))
  }

  if (loading) {
    return <div className="text-white p-8">Loading models...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 p-8 relative">
      <h1 className="text-4xl font-bold text-white mb-10 text-center">Your Models</h1>

      <button
        onClick={() => {
          setNewModel({ name: "", description: "", image: "" })
          setEditingModelId(null)
          setIsOpen(true)
        }}
        className="absolute top-8 right-8 bg-white text-black font-bold text-2xl w-10 h-10 rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition"
      >
        +
      </button>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {models.map((model) => (
          <div
            key={model.id}
            className="bg-white rounded-2xl shadow-lg overflow-hidden transition-transform hover:scale-105"
          >
            <Image
              src={model.image_url || "/placeholder.jpg"}
              alt={model.name}
              width={500}
              height={300}
              className="object-cover w-full h-48"
            />
            <div className="p-4 flex flex-col justify-between h-[170px]">
              <div>
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-800">{model.name}</h2>
                  <div className="text-sm space-x-2">
                    <button 
                      onClick={() => handleEdit(model)} 
                      title="Edit" 
                      className="hover:scale-110 transition-transform duration-200"
                    >
                      ✏️
                    </button> 
                    <button 
                      onClick={() => handleDelete(model.id)} 
                      title="Delete"
                      className="hover:scale-110 transition-transform duration-200"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                <p className="text-gray-500 text-sm">{model.description}</p>
              </div>
              <Button
                onClick={() => router.push(`/dashboard/model/${model.id}`)}
                className="mt-4 transition-transform hover:scale-105 hover:bg-gray-900"
              >
                DMCA Analysis
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white p-6 rounded-xl shadow-xl space-y-4 w-full max-w-sm">
            <Dialog.Title className="text-xl font-bold">
              {editingModelId ? "Edit Model" : "Add New Model"}
            </Dialog.Title>

            <Input
              placeholder="Model Name"
              value={newModel.name}
              onChange={(e) => setNewModel((p) => ({ ...p, name: e.target.value }))}
            />
            <Input
              placeholder="Description"
              value={newModel.description}
              onChange={(e) => setNewModel((p) => ({ ...p, description: e.target.value }))}
            />
            <Input type="file" accept="image/*" onChange={handleImageUpload} />
            <Button className="w-full" onClick={addOrEditModel}>
              {editingModelId ? "Update" : "Save"}
            </Button>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  )
}
