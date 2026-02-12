import { useState } from "react"
import { X } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { signIn, signUp } = useAuth()

  if (!isOpen) return null

  const calculatePasswordStrength = (
    pwd: string,
  ): { strength: number; color: string; label: string } => {
    let strength = 0

    if (pwd.length >= 6) strength++
    if (/[A-Z]/.test(pwd)) strength++
    if (/[0-9]/.test(pwd)) strength++
    if (/[^A-Za-z0-9]/.test(pwd)) strength++

    if (strength <= 1)
      return { strength: 1, color: "bg-red-500", label: "Fraca" }
    if (strength <= 3)
      return { strength: 2, color: "bg-yellow-500", label: "Média" }
    return { strength: 3, color: "bg-green-500", label: "Forte" }
  }

  const passwordStrength =
    !isLogin && password ? calculatePasswordStrength(password) : null

  const isPasswordValid = (pwd: string): boolean => {
    return (
      pwd.length >= 6 &&
      /[A-Z]/.test(pwd) &&
      /[0-9]/.test(pwd) &&
      /[^A-Za-z0-9]/.test(pwd)
    )
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 11)
    setPhone(value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!isLogin) {
      if (phone.length !== 11) {
        setError("Telefone deve ter 11 dígitos")
        return
      }

      if (!isPasswordValid(password)) {
        setError(
          "A senha deve conter no mínimo 6 caracteres, incluindo letra maiúscula, número e caractere especial",
        )
        return
      }

      if (password !== confirmPassword) {
        setError("As senhas não coincidem")
        return
      }
    }

    setLoading(true)

    try {
      if (isLogin) {
        await signIn(email, password)
      } else {
        await signUp(email, password, fullName, phone)
      }
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao autenticar")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-bg rounded-lg max-w-md w-full p-6 relative border border-gold/20">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gold/60 hover:text-gold"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold bg-gradient-to-r from-gold via-gold-dark to-gold bg-clip-text text-transparent mb-6">
          {isLogin ? "Entrar" : "Criar Conta"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-white mb-1"
                >
                  Nome Completo
                </label>
                <input
                  type="text"
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-2 border border-gold/20 rounded-lg bg-dark-secondary text-white placeholder-gray-500 focus:ring-2 focus:ring-gold focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-white mb-1"
                >
                  Telefone
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="11999999999"
                  className="w-full px-4 py-2 border border-gold/20 rounded-lg bg-dark-secondary text-white placeholder-gray-500 focus:ring-2 focus:ring-gold focus:border-transparent"
                  required
                />
                <p className="text-xs text-gray-400 mt-1">
                  {phone.length}/11 dígitos
                </p>
              </div>
            </>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-white mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gold/20 rounded-lg bg-dark-secondary text-white placeholder-gray-500 focus:ring-2 focus:ring-gold focus:border-transparent"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-white mb-1"
            >
              Senha
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gold/20 rounded-lg bg-dark-secondary text-white placeholder-gray-500 focus:ring-2 focus:ring-gold focus:border-transparent"
              required
              minLength={6}
            />
            {!isLogin && password && (
              <div className="mt-2">
                <div className="flex gap-1 h-1 mb-1">
                  <div
                    className={`flex-1 rounded ${passwordStrength && passwordStrength.strength >= 1 ? passwordStrength.color : "bg-gray-700"}`}
                  ></div>
                  <div
                    className={`flex-1 rounded ${passwordStrength && passwordStrength.strength >= 2 ? passwordStrength.color : "bg-gray-700"}`}
                  ></div>
                  <div
                    className={`flex-1 rounded ${passwordStrength && passwordStrength.strength >= 3 ? passwordStrength.color : "bg-gray-700"}`}
                  ></div>
                </div>
                <p className="text-xs text-gray-400">
                  Força da senha:{" "}
                  <span
                    className={
                      passwordStrength?.strength === 1
                        ? "text-red-400"
                        : passwordStrength?.strength === 2
                          ? "text-yellow-400"
                          : "text-green-400"
                    }
                  >
                    {passwordStrength?.label}
                  </span>
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Mínimo: 6 caracteres, 1 maiúscula, 1 número, 1 caractere
                  especial
                </p>
              </div>
            )}
          </div>

          {!isLogin && (
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-white mb-1"
              >
                Confirmar Senha
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gold/20 rounded-lg bg-dark-secondary text-white placeholder-gray-500 focus:ring-2 focus:ring-gold focus:border-transparent"
                required
                minLength={6}
              />
            </div>
          )}

          {error && <div className="text-red-400 text-sm">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gold text-dark-bg py-3 rounded-lg hover:bg-gold-dark transition-colors disabled:opacity-50 font-semibold"
          >
            {loading ? "Carregando..." : isLogin ? "Entrar" : "Criar Conta"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-gray-400 hover:text-gold text-sm transition-colors"
          >
            {isLogin ? "Não tem conta? Criar conta" : "Já tem conta? Entrar"}
          </button>
        </div>
      </div>
    </div>
  )
}
