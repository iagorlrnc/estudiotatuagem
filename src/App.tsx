import { useState } from "react"
import { AuthProvider, useAuth } from "./contexts/AuthContext"
import { Header } from "./components/Header"
import { Footer } from "./components/Footer"
import { AuthModal } from "./components/AuthModal"
import { Home } from "./pages/Home"
import { Catalog } from "./pages/Catalog"
import { Booking } from "./pages/Booking"
import { MyAppointments } from "./pages/MyAppointments"
import { AdminDashboard } from "./pages/AdminDashboard"

function AppContent() {
  const [currentPage, setCurrentPage] = useState<
    "home" | "catalog" | "booking" | "appointments" | "admin"
  >("home")
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const { loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col">
      <Header
        onNavigate={setCurrentPage}
        onLoginClick={() => setIsAuthModalOpen(true)}
        hideOnTop={currentPage === "home"}
      />

      <main className="flex-1">
        {currentPage === "home" && <Home onNavigate={setCurrentPage} />}
        {currentPage === "catalog" && <Catalog />}
        {currentPage === "booking" && (
          <Booking onLoginClick={() => setIsAuthModalOpen(true)} />
        )}
        {currentPage === "appointments" && (
          <MyAppointments onLoginClick={() => setIsAuthModalOpen(true)} />
        )}
        {currentPage === "admin" && <AdminDashboard />}
      </main>

      <Footer />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
