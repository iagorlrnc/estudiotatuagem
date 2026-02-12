# Estúdio de Tatuagem - Sistema de Agendamento

Sistema completo de gerenciamento de tatuagens com agendamento online, portfólio e painel administrativo.

## 🚀 Deploy no Vercel

### Passo 1: Configurar Variáveis de Ambiente

No painel do Vercel, adicione as seguintes variáveis de ambiente:

```
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

### Passo 2: Deploy

1. Conecte seu repositório GitHub ao Vercel
2. As configurações de build já estão no `vercel.json`
3. Clique em "Deploy"

### Passo 3: Configurar Supabase Storage

Siga as instruções em [STORAGE_SETUP.md](STORAGE_SETUP.md) para configurar os buckets de upload de imagens.

## 📦 Desenvolvimento Local

### Instalação

```bash
npm install
```

### Executar em modo desenvolvimento

```bash
npm run dev
```

### Build para produção

```bash
npm run build
```

### Preview da build

```bash
npm run preview
```

## 🛠️ Tecnologias

- **React** + **TypeScript** + **Vite**
- **Tailwind CSS** - Estilização
- **Supabase** - Backend e autenticação
- **Lucide React** - Ícones

## 📝 Estrutura do Projeto

```
src/
├── components/     # Componentes reutilizáveis
├── contexts/       # Contextos React (Auth)
├── lib/           # Configurações (Supabase)
├── pages/         # Páginas principais
└── index.css      # Estilos globais
```

## 🔐 Funcionalidades

- ✅ Autenticação de usuários
- ✅ Catálogo de tatuagens com categorias
- ✅ Sistema de agendamento online
- ✅ Upload de imagens de referência
- ✅ Painel administrativo completo
- ✅ Calendário de agendamentos
- ✅ Gerenciamento de portfólio
- ✅ Responsivo para todos os dispositivos

## 📱 Responsividade

O site é totalmente responsivo e otimizado para:
- 📱 Celulares (320px+)
- 📱 Tablets (768px+)
- 💻 Laptops (1024px+)
- 🖥️ Desktops (1920px+)
- 📺 TVs/4K (2560px+)

## 🔧 Resolução de Problemas

### Erro de dependências obsoletas

Se aparecer avisos sobre `glob` ou outras dependências:

```bash
rm -rf node_modules package-lock.json
npm install
```

O `package.json` já inclui overrides para forçar versões atualizadas.

### Build falha no Vercel

Certifique-se de que:
1. As variáveis de ambiente estão configuradas
2. O `vercel.json` está no repositório
3. A versão do Node.js no Vercel é >= 18

## 📄 Licença

MIT
