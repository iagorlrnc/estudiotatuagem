import { useState, FormEvent } from "react"
import {
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  FileText,
  MapPin,
} from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import { supabase } from "../lib/supabase"

interface BookingProps {
  onLoginClick: () => void
}

export function Booking({ onLoginClick }: BookingProps) {
  const { user, profile } = useAuth()
  const [formData, setFormData] = useState({
    fullName: profile?.full_name || "",
    email: profile?.email || "",
    phone: profile?.phone || "",
    appointmentDate: "",
    appointmentTime: "",
    tattooDescription: "",
    tattooSize: "",
    bodyPlacement: "",
    referenceImages: "",
    notes: "",
  })
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!user) {
      onLoginClick()
      return
    }

    setLoading(true)
    setError("")

    try {
      let imageUrls: string[] = []

      // Upload images to Supabase Storage if any
      if (imageFiles.length > 0) {
        const uploadPromises = imageFiles.map(async (file) => {
          const fileExt = file.name.split(".").pop()
          const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

          const { error: uploadError } = await supabase.storage
            .from("appointment-references")
            .upload(fileName, file, {
              cacheControl: "3600",
              upsert: false,
            })

          if (uploadError) throw uploadError

          // Get public URL
          const {
            data: { publicUrl },
          } = supabase.storage
            .from("appointment-references")
            .getPublicUrl(fileName)

          return publicUrl
        })

        imageUrls = await Promise.all(uploadPromises)
      }

      const { error: insertError } = await supabase
        .from("appointments")
        .insert({
          user_id: user.id,
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          appointment_date: formData.appointmentDate,
          appointment_time: formData.appointmentTime,
          tattoo_description: formData.tattooDescription,
          tattoo_size: formData.tattooSize,
          body_placement: formData.bodyPlacement,
          reference_images: imageUrls.length > 0 ? imageUrls.join(",") : null,
          notes: formData.notes,
          status: "pending",
        })

      if (insertError) throw insertError

      setSuccess(true)
      setFormData({
        fullName: profile?.full_name || "",
        email: profile?.email || "",
        phone: profile?.phone || "",
        appointmentDate: "",
        appointmentTime: "",
        tattooDescription: "",
        tattooSize: "",
        bodyPlacement: "",
        referenceImages: "",
        notes: "",
      })
      setImageFiles([])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar agendamento")
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center pt-20">
        <div className="max-w-md mx-auto px-4 text-center">
          <User className="w-16 h-16 text-gold/60 mx-auto mb-4" />
          <h2 className="text-2xl font-bold bg-gradient-to-r from-gold via-gold-dark to-gold bg-clip-text text-transparent mb-4">
            Faça login para agendar
          </h2>
          <p className="text-gray-400 mb-6">
            Você precisa estar autenticado para fazer um agendamento
          </p>
          <button
            onClick={onLoginClick}
            className="bg-gold text-dark-bg px-8 py-3 rounded-lg font-semibold hover:bg-gold-dark transition-colors"
          >
            Fazer Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-bg py-12 pt-32">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-dark-secondary rounded-lg border border-gold/20 p-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gold via-gold-dark to-gold bg-clip-text text-transparent mb-2">
            Agendar Sessão de Tatuagem
          </h1>
          <p className="text-gray-400 mb-8">
            Preencha o formulário abaixo com seus dados e preferências
          </p>

          {success && (
            <div className="bg-green-900/30 border border-green-700/50 text-green-300 px-4 py-3 rounded-lg mb-6">
              Agendamento realizado com sucesso! Entraremos em contato em breve.
            </div>
          )}

          {error && (
            <div className="bg-red-900/30 border border-red-700/50 text-red-300 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  <User className="w-4 h-4 inline mr-2 text-gold" />
                  Nome Completo
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gold/20 rounded-lg bg-dark-bg text-white placeholder-gray-500 focus:ring-2 focus:ring-gold focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  <Mail className="w-4 h-4 inline mr-2 text-gold" />
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gold/20 rounded-lg bg-dark-bg text-white placeholder-gray-500 focus:ring-2 focus:ring-gold focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  <Phone className="w-4 h-4 inline mr-2 text-gold" />
                  Telefone
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gold/20 rounded-lg bg-dark-bg text-white placeholder-gray-500 focus:ring-2 focus:ring-gold focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Tamanho Aproximado
                </label>
                <select
                  required
                  value={formData.tattooSize}
                  onChange={(e) =>
                    setFormData({ ...formData, tattooSize: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gold/20 rounded-lg bg-dark-bg text-white focus:ring-2 focus:ring-gold focus:border-transparent"
                >
                  <option value="">Selecione</option>
                  <option value="pequena">Pequena (até 5cm)</option>
                  <option value="media">Média (5-15cm)</option>
                  <option value="grande">Grande (15-30cm)</option>
                  <option value="muito-grande">
                    Muito Grande (acima de 30cm)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  <Calendar className="w-4 h-4 inline mr-2 text-gold" />
                  Data Preferida
                </label>
                <input
                  type="date"
                  required
                  value={formData.appointmentDate}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      appointmentDate: e.target.value,
                    })
                  }
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-2 border border-gold/20 rounded-lg bg-dark-bg text-white placeholder-gray-500 focus:ring-2 focus:ring-gold focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  <Clock className="w-4 h-4 inline mr-2 text-gold" />
                  Horário Preferido
                </label>
                <input
                  type="time"
                  required
                  value={formData.appointmentTime}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      appointmentTime: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gold/20 rounded-lg bg-dark-bg text-white placeholder-gray-500 focus:ring-2 focus:ring-gold focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                <MapPin className="w-4 h-4 inline mr-2 text-gold" />
                Localização no Corpo
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Braço direito, costas, perna esquerda..."
                value={formData.bodyPlacement}
                onChange={(e) =>
                  setFormData({ ...formData, bodyPlacement: e.target.value })
                }
                className="w-full px-4 py-2 border border-gold/20 rounded-lg bg-dark-bg text-white placeholder-gray-500 focus:ring-2 focus:ring-gold focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                <FileText className="w-4 h-4 inline mr-2 text-gold" />
                Descrição da Tatuagem
              </label>
              <textarea
                required
                rows={4}
                placeholder="Descreva sua ideia de tatuagem em detalhes..."
                value={formData.tattooDescription}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tattooDescription: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border border-gold/20 rounded-lg bg-dark-bg text-white placeholder-gray-500 focus:ring-2 focus:ring-gold focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Imagens de Referência
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  const files = e.target.files
                  if (files) {
                    const filesArray = Array.from(files)
                    setImageFiles(filesArray)
                    const fileNames = filesArray.map((f) => f.name).join(", ")
                    setFormData({ ...formData, referenceImages: fileNames })
                  }
                }}
                className="w-full px-4 py-2 border border-gold/20 rounded-lg bg-dark-bg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gold file:text-dark-bg hover:file:bg-gold-dark focus:ring-2 focus:ring-gold focus:border-transparent"
              />
              {imageFiles.length > 0 && (
                <p className="mt-2 text-sm text-gray-400">
                  {imageFiles.length}{" "}
                  {imageFiles.length === 1
                    ? "imagem selecionada"
                    : "imagens selecionadas"}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Observações Adicionais
              </label>
              <textarea
                rows={3}
                placeholder="Alguma informação adicional que gostaria de compartilhar?"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                className="w-full px-4 py-2 border border-gold/20 rounded-lg bg-dark-bg text-white placeholder-gray-500 focus:ring-2 focus:ring-gold focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold text-dark-bg py-3 rounded-lg font-semibold hover:bg-gold-dark transition-colors disabled:opacity-50"
            >
              {loading ? "Enviando..." : "Confirmar Agendamento"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
