import { Menu, X, LogOut, User } from "lucide-react"
import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"

interface HeaderProps {
  onNavigate: (
    page: "home" | "catalog" | "booking" | "appointments" | "admin",
  ) => void
  onLoginClick: () => void
  hideOnTop?: boolean
}

export function Header({
  onNavigate,
  onLoginClick,
  hideOnTop = false,
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showHeader, setShowHeader] = useState(!hideOnTop)
  const { user, profile, signOut } = useAuth()

  useEffect(() => {
    if (!hideOnTop) {
      setShowHeader(true)
      return
    }

    const handleScroll = () => {
      const scrollPosition = window.scrollY
      if (scrollPosition > 100) {
        setShowHeader(true)
      } else {
        setShowHeader(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [hideOnTop])

  const handleSignOut = async () => {
    await signOut()
    onNavigate("home")
  }

  return (
    <header
      className={`bg-dark-bg shadow-sm fixed top-0 left-0 right-0 z-40 border-b border-gold/20 transition-transform duration-300 ${
        showHeader ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <button
            onClick={() => onNavigate("home")}
            className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gold via-gold-dark to-gold bg-clip-text text-transparent"
          >
            <span className="hidden sm:inline">Estúdio de Tatuagem</span>
            <span className="sm:hidden">Estúdio de Tatuagem</span>
          </button>

          <nav className="hidden lg:flex items-center space-x-4 xl:space-x-8">
            <button
              onClick={() => onNavigate("home")}
              className="text-white hover:text-gold transition-colors"
            >
              Início
            </button>
            <button
              onClick={() => onNavigate("catalog")}
              className="text-white hover:text-gold transition-colors"
            >
              Catálogo
            </button>
            <button
              onClick={() => onNavigate("booking")}
              className="text-white hover:text-gold transition-colors"
            >
              Agendar
            </button>
            {user && (
              <button
                onClick={() => onNavigate("appointments")}
                className="text-white hover:text-gold transition-colors"
              >
                Acompanhar
              </button>
            )}
            {profile?.is_admin && (
              <button
                onClick={() => onNavigate("admin")}
                className="text-white hover:text-gold transition-colors"
              >
                Painel Admin
              </button>
            )}
          </nav>

          <div className="hidden lg:flex items-center space-x-2 xl:space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-gold" />
                  <span className="text-xs xl:text-sm text-white truncate max-w-[150px] xl:max-w-[200px]">
                    {profile?.full_name || profile?.email}
                  </span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 px-4 py-2 text-white hover:text-gold transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sair</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="bg-gold text-dark-bg px-6 py-2 rounded-lg hover:bg-gold-dark transition-colors font-semibold"
              >
                Entrar
              </button>
            )}
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden text-white"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden py-4 space-y-2 bg-dark-secondary rounded-lg mt-2">
            <button
              onClick={() => {
                onNavigate("home")
                setIsMenuOpen(false)
              }}
              className="block w-full text-left text-white hover:text-gold px-4 py-2"
            >
              Início
            </button>
            <button
              onClick={() => {
                onNavigate("catalog")
                setIsMenuOpen(false)
              }}
              className="block w-full text-left text-white hover:text-gold px-4 py-2"
            >
              Catálogo
            </button>
            <button
              onClick={() => {
                onNavigate("booking")
                setIsMenuOpen(false)
              }}
              className="block w-full text-left text-white hover:text-gold px-4 py-2"
            >
              Agendar
            </button>
            {user && (
              <button
                onClick={() => {
                  onNavigate("appointments")
                  setIsMenuOpen(false)
                }}
                className="block w-full text-left text-white hover:text-gold px-4 py-2"
              >
                Acompanhar
              </button>
            )}
            {profile?.is_admin && (
              <button
                onClick={() => {
                  onNavigate("admin")
                  setIsMenuOpen(false)
                }}
                className="block w-full text-left text-white hover:text-gold px-4 py-2"
              >
                Painel Admin
              </button>
            )}
            {user ? (
              <button
                onClick={handleSignOut}
                className="block w-full text-left text-white hover:text-gold px-4 py-2"
              >
                Sair
              </button>
            ) : (
              <button
                onClick={() => {
                  onLoginClick()
                  setIsMenuOpen(false)
                }}
                className="block w-full text-left bg-gold text-dark-bg px-4 py-2 rounded-lg hover:bg-gold-dark font-semibold"
              >
                Login
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
