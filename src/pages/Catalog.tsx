import { useState, useEffect, useCallback } from "react"
import { supabase } from "../lib/supabase"

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  display_order: number
  created_at: string
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
  categories?: {
    name: string
    slug: string
  }
}

export function Catalog() {
  const [categories, setCategories] = useState<Category[]>([])
  const [tattoos, setTattoos] = useState<Tattoo[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const loadAllTattoos = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("tattoos")
        .select(
          `
          *,
          categories (
            name,
            slug
          )
        `,
        )
        .order("created_at", { ascending: false })

      if (error) throw error
      setTattoos(data || [])
    } catch (error) {
      console.error("Error loading tattoos:", error)
    }
  }, [])

  const loadTattoosByCategory = useCallback(async (categoryId: string) => {
    try {
      const { data, error } = await supabase
        .from("tattoos")
        .select(
          `
          *,
          categories (
            name,
            slug
          )
        `,
        )
        .eq("category_id", categoryId)
        .order("created_at", { ascending: false })

      if (error) throw error
      setTattoos(data || [])
    } catch (error) {
      console.error("Error loading tattoos:", error)
    }
  }, [])

  const loadData = useCallback(async () => {
    try {
      const { data: categoriesData, error: categoriesError } = await supabase
        .from("categories")
        .select("*")
        .order("display_order")

      if (categoriesError) throw categoriesError
      setCategories(categoriesData || [])

      await loadAllTattoos()
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }, [loadAllTattoos])

  useEffect(() => {
    loadData()
  }, [loadData])

  useEffect(() => {
    if (selectedCategory) {
      loadTattoosByCategory(selectedCategory)
    } else {
      loadAllTattoos()
    }
  }, [selectedCategory, loadTattoosByCategory, loadAllTattoos])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center pt-20">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-bg pt-20">
      <div className="bg-dark-secondary text-white py-12 sm:py-16 border-b border-gold/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 pb-2 bg-gradient-to-r from-gold via-gold-dark to-gold bg-clip-text text-transparent leading-tight">
            Catálogo de Tatuagens
          </h1>
          <p className="text-gray-300 text-base sm:text-lg">
            Explore nosso portfólio tattoo
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8 justify-center">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 sm:px-6 py-2 rounded-full text-sm sm:text-base font-medium transition-colors ${
              selectedCategory === null
                ? "bg-gold text-dark-bg"
                : "bg-dark-secondary text-white border border-gold/30 hover:border-gold/70"
            }`}
          >
            Todas
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 sm:px-6 py-2 rounded-full text-sm sm:text-base font-medium transition-colors ${
                selectedCategory === category.id
                  ? "bg-gold text-dark-bg"
                  : "bg-dark-secondary text-white border border-gold/30 hover:border-gold/70"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {tattoos.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              Nenhuma tatuagem encontrada nesta categoria
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-6">
            {tattoos.map((tattoo) => (
              <div
                key={tattoo.id}
                className="bg-dark-secondary rounded-lg overflow-hidden hover:shadow-lg hover:shadow-gold/30 transition-all border border-gold/10 hover:border-gold/50"
              >
                <div className="relative aspect-square">
                  <img
                    src={tattoo.image_url}
                    alt={tattoo.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-white">{tattoo.title}</h3>
                    <span className="bg-gold text-dark-bg px-3 py-1 rounded-full text-sm font-semibold">
                      {formatPrice(tattoo.price)}
                    </span>
                  </div>
                  {tattoo.description && (
                    <p className="text-gray-400 text-sm mb-2 line-clamp-2">
                      {tattoo.description}
                    </p>
                  )}
                  {tattoo.categories && (
                    <span className="inline-block bg-gold/10 text-gold px-3 py-1 rounded-full text-xs border border-gold/30">
                      {tattoo.categories.name}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
