import { useState, useEffect } from "react"
import { ArrowRight, Sparkles, Clock, Shield } from "lucide-react"
import { supabase } from "../lib/supabase"

interface HomeProps {
  onNavigate: (page: "home" | "catalog" | "booking" | "admin") => void
}

interface Tattoo {
  id: string
  title: string
  description: string | null
  category_id: string | null
  price: number
  image_url: string
  is_featured: boolean
  created_at: string
  updated_at: string
}

export function Home({ onNavigate }: HomeProps) {
  const [featuredTattoos, setFeaturedTattoos] = useState<Tattoo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFeaturedTattoos()
  }, [])

  const loadFeaturedTattoos = async () => {
    try {
      const { data, error } = await supabase
        .from("tattoos")
        .select("*")
        .eq("is_featured", true)
        .limit(6)

      if (error) throw error
      setFeaturedTattoos(data || [])
    } catch (error) {
      console.error("Error loading featured tattoos:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/assets/hero-tattoo.jpg"
            alt="Tatto"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black"></div>
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center">
          <p className="mb-4 text-sm uppercase tracking-widest text-gold animate-fade-in">
            Estúdio de Tatuagem
          </p>
          <h1 className="mb-6 text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight text-white animate-fade-in">
            Arte que conta
            <br />
            <span className="bg-gradient-to-r from-gold via-gold-dark to-gold bg-clip-text text-transparent">
              sua história
            </span>
          </h1>
          <p className="mx-auto mb-8 max-w-xl text-base sm:text-lg lg:text-xl text-gray-300 animate-fade-in px-4">
            Transformamos suas ideias em obras de arte na pele. Cada traço é
            único, cada tatuagem é uma expressão da sua personalidade.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center animate-fade-in px-4">
            <button
              onClick={() => onNavigate("catalog")}
              className="bg-gold-dark text-dark-bg px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-gold transition-colors inline-flex items-center gap-2 shadow-lg shadow-gold/50 w-full sm:w-auto justify-center"
            >
              Ver Catálogo
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate("booking")}
              className="bg-transparent border-2 border-gold text-gold px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-gold/10 transition-colors w-full sm:w-auto"
            >
              Agendar Horário
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 lg:py-24 bg-black">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Sparkles,
                title: "Arte Exclusiva",
                desc: "Cada projeto é único e personalizado para você",
              },
              {
                icon: Shield,
                title: "100% Seguro",
                desc: "Materiais descartáveis e ambiente esterilizado",
              },
              {
                icon: Clock,
                title: "Pontualidade",
                desc: "Respeitamos seu tempo com agendamento preciso",
              },
            ].map((feat) => (
              <div
                key={feat.title}
                className="rounded-lg border border-gold/20 bg-dark-bg p-8 text-center transition-all hover:border-gold/50 hover:shadow-lg hover:shadow-gold/30"
              >
                <feat.icon className="mx-auto mb-4 h-8 w-8 text-gold" />
                <h3 className="mb-2 text-xl font-semibold text-white">
                  {feat.title}
                </h3>
                <p className="text-sm text-gray-400">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery/Featured Tattoos Section */}
      <section className="py-12 sm:py-16 lg:py-24 bg-dark-bg">
        <div className="container mx-auto px-4">
          <div className="mb-8 sm:mb-12 text-center">
            <p className="mb-2 text-sm uppercase tracking-widest text-gold">
              Portfólio
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gold via-gold-dark to-gold bg-clip-text text-transparent">
              Nossos Trabalhos
            </h2>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
            </div>
          ) : featuredTattoos.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">
                Nenhuma tatuagem em destaque no momento
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {featuredTattoos.map((tattoo) => (
                <div
                  key={tattoo.id}
                  className="group relative overflow-hidden rounded-lg aspect-square border border-gold/20 hover:border-gold/50 transition-all hover:shadow-lg hover:shadow-gold/30"
                >
                  <img
                    src={tattoo.image_url}
                    alt={tattoo.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/40"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <h3 className="text-gold text-lg font-bold text-center px-4">
                      {tattoo.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <button
              onClick={() => onNavigate("catalog")}
              className="inline-flex items-center gap-2 border-2 border-gold text-gold px-8 py-3 rounded-lg font-semibold hover:bg-gold/10 transition-colors"
            >
              Ver Catálogo Completo
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-24 bg-dark-secondary border-t border-gold/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
            Pronto para sua próxima{" "}
            <span className="bg-gradient-to-r from-gold via-gold-dark to-gold bg-clip-text text-transparent">
              tatuagem
            </span>
            ?
          </h2>
          <p className="mx-auto mb-8 max-w-lg text-gray-300">
            Agende sua sessão agora e transforme sua ideia em arte permanente.
          </p>
          <button
            onClick={() => onNavigate("booking")}
            className="inline-flex items-center gap-2 bg-gold text-dark-bg px-8 py-3 rounded-lg font-semibold hover:bg-gold-dark transition-colors shadow-lg shadow-gold/50"
          >
            Agendar Agora
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  )
}
