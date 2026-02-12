# 🎨 Tattoo Studio - Sistema de Agendamentos

Sistema completo de gerenciamento para estúdio de tatuagem com catálogo, agendamentos e painel administrativo.

## 🚀 Funcionalidades

- ✅ **Autenticação completa** (cadastro e login com validação de senha forte)
- ✅ **Catálogo de tatuagens** com categorias e filtros
- ✅ **Sistema de agendamentos** totalmente funcional
- ✅ **Painel administrativo** para gerenciar agendamentos
- ✅ **Tema premium** dourado e escuro
- ✅ **Responsivo** para todos os dispositivos

## 📋 Pré-requisitos

- Node.js (versão 18 ou superior)
- Conta no Supabase (gratuita)

## 🛠️ Configuração do Projeto

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Supabase

1. Acesse [supabase.com](https://supabase.com) e crie uma conta
2. Crie um novo projeto
3. Vá em **Settings > API** e copie:
   - Project URL
   - anon/public key

### 3. Configurar Variáveis de Ambiente

1. Copie o arquivo `.env.example` para `.env`:

```bash
copy .env.example .env
```

2. Edite o arquivo `.env` e adicione suas credenciais:

```
VITE_SUPABASE_URL=sua_url_do_projeto
VITE_SUPABASE_ANON_KEY=sua_chave_publica
```

### 4. Executar Migrations do Banco de Dados

1. No dashboard do Supabase, vá em **SQL Editor**
2. Clique em **New query**
3. Copie todo o conteúdo do arquivo `supabase/migrations/20260211190457_create_tattoo_studio_schema.sql`
4. Cole no editor SQL
5. Clique em **RUN** para executar

Isso criará:

- ✅ Tabelas (profiles, categories, tattoos, appointments)
- ✅ Políticas de segurança (RLS)
- ✅ Categorias padrão
- ✅ 12 tatuagens fictícias para o catálogo

### 5. Criar Usuário Administrador (Opcional)

Para criar um usuário admin:

1. Cadastre-se normalmente no sistema
2. No Supabase, vá em **Table Editor > profiles**
3. Encontre seu perfil e edite a coluna `is_admin` para `true`

## 🎯 Executar o Projeto

### Modo Desenvolvimento

```bash
npm run dev
```

Acesse: http://localhost:5173

### Build para Produção

```bash
npm run build
npm run preview
```

## 📱 Como Usar

### Cadastro de Usuário

1. Clique em "Entrar"
2. Clique em "Criar conta"
3. Preencha:
   - Nome completo
   - Telefone (11 dígitos)
   - Email
   - Senha (mínimo 6 caracteres, 1 maiúscula, 1 número, 1 caractere especial)
   - Confirmar senha

### Fazer Agendamento

1. Faça login
2. Vá em "Agendar"
3. Preencha o formulário com:
   - Data e horário preferidos
   - Descrição da tatuagem
   - Tamanho e localização no corpo
   - Notas adicionais

### Acessar Painel Admin

1. Faça login com conta admin (criada no passo 5)
2. Vá em "Admin"
3. Visualize todos os agendamentos
4. Gerencie status (pendente, confirmado, concluído, cancelado)

## 🎨 Estrutura do Projeto

```
project/
├── src/
│   ├── components/          # Componentes React
│   │   ├── Header.tsx       # Cabeçalho com navegação
│   │   ├── AuthModal.tsx    # Modal de login/cadastro
│   │   ├── AdminCalendar.tsx
│   │   └── AppointmentsList.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx  # Contexto de autenticação
│   ├── pages/
│   │   ├── Home.tsx         # Página inicial
│   │   ├── Catalog.tsx      # Catálogo de tatuagens
│   │   ├── Booking.tsx      # Agendamento
│   │   └── AdminDashboard.tsx
│   ├── lib/
│   │   └── supabase.ts      # Cliente Supabase
│   └── App.tsx              # Componente principal
├── supabase/
│   └── migrations/          # Scripts SQL
└── tailwind.config.js       # Configuração tema dourado
```

## 🔒 Segurança

- ✅ Row Level Security (RLS) habilitado em todas as tabelas
- ✅ Usuários só veem seus próprios agendamentos
- ✅ Apenas admins podem ver/editar todos os agendamentos
- ✅ Validação de senha forte no frontend

## 🎨 Tema

Cores personalizadas:

- **Dourado**: `#D4AF37` (gold)
- **Dourado Escuro**: `#B8860B` (gold-dark)
- **Fundo Escuro**: `#1A1A1A` (dark-bg)
- **Fundo Secundário**: `#2A2A2A` (dark-secondary)

## 🐛 Solução de Problemas

### Erro: "Missing Supabase environment variables"

- Verifique se o arquivo `.env` existe
- Confirme que as variáveis estão corretas

### Não consigo fazer login

- Verifique se executou as migrations SQL
- Confirme que o email está correto
- Tente redefinir a senha pelo Supabase

### Catálogo vazio

- Execute as migrations SQL (passo 4)
- Verifique no Supabase se as tabelas foram criadas

## 📝 Licença

Este projeto é para uso educacional e demonstrativo.
