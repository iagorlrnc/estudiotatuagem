import { Instagram, Facebook, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-black border-t border-gold/20 mt-auto">
      <div className="container-safe py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sobre */}
          <div>
            <h3 className="text-gold text-xl font-bold mb-4">Tattoo Studio</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Transformando arte em memórias inesquecíveis. Nosso estúdio
              oferece os melhores artistas e um ambiente profissional para sua
              próxima tatuagem.
            </p>
          </div>

          {/* Contato */}
          <div>
            <h3 className="text-gold text-xl font-bold mb-4">Contato</h3>
            <div className="space-y-3 text-gray-400 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gold" />
                <span>(11) 99999-9999</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gold" />
                <span>contato@tattoostudio.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gold" />
                <span>São Paulo, SP</span>
              </div>
            </div>
          </div>

          {/* Redes Sociais */}
          <div>
            <h3 className="text-gold text-xl font-bold mb-4">Redes Sociais</h3>
            <div className="flex gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-dark-bg p-3 rounded-lg hover:bg-gold/10 transition-colors group"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5 text-gray-400 group-hover:text-gold transition-colors" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-dark-bg p-3 rounded-lg hover:bg-gold/10 transition-colors group"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5 text-gray-400 group-hover:text-gold transition-colors" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gold/20 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {currentYear} Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
