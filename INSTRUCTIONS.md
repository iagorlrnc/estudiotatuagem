# 🚀 INSTRUÇÕES RÁPIDAS - Execute em 4 Passos

## 📌 PASSO 1: Executar Migration SQL

1. Acesse: https://supabase.com/dashboard/project/fzqcfjnvkteplpykflut/editor
2. Clique em **"New query"**
3. Copie **TODO** o conteúdo do arquivo: `supabase/migrations/20260211190457_create_tattoo_studio_schema.sql`
4. Cole no editor SQL do Supabase
5. Clique em **"RUN"** (ou pressione Ctrl+Enter)

✅ Isso criará:

- Todas as tabelas (profiles, categories, tattoos, appointments)
- 6 categorias de tatuagens
- 12 tatuagens fictícias para o catálogo
- Políticas de segurança

## 📌 PASSO 2: Configurar Upload de Imagens (Storage)

⚠️ **IMPORTANTE**: Para adicionar tatuagens com upload de imagens, configure o bucket de storage:

1. Acesse: https://supabase.com/dashboard/project/fzqcfjnvkteplpykflut/storage/buckets
2. Clique em **"New bucket"**
3. Preencha:
   - **Name**: `portfolio`
   - **Public bucket**: ✅ **MARQUE ESTA OPÇÃO**
4. Clique em **"Create bucket"**

### Configurar Políticas RLS (Segurança)

Clique no bucket **"portfolio"** → aba **"Policies"** → **"New Policy"**

**Política 1: Upload (apenas admins)**

- Policy name: `Admins can upload images`
- Allowed operation: **INSERT**
- Policy definition:

```sql
(bucket_id = 'portfolio'::text) AND (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
)
```

**Política 2: Visualização (todos)**

- Policy name: `Anyone can view images`
- Allowed operation: **SELECT**
- Policy definition:

```sql
bucket_id = 'portfolio'::text
```

👉 **Instruções detalhadas em**: [STORAGE_SETUP.md](STORAGE_SETUP.md)

## 📌 PASSO 3: Iniciar o Projeto

```bash
npm run dev
```

Acesse: http://localhost:5173

## 📌 PASSO 4: Testar Funcionalidades

### ✅ Cadastro

1. Clique em "Entrar" no header
2. Clique em "Criar conta"
3. Preencha:
   - Nome completo
   - Telefone (11 dígitos, ex: 11999887766)
   - Email
   - Senha (use: Senha@123 - tem maiúscula, número e caractere especial)
   - Confirmar senha

### ✅ Catálogo

- Vá em "Catálogo"
- Verá 12 tatuagens fictícias
- Filtre por categoria

### ✅ Agendamento

1. Faça login
2. Vá em "Agendar"
3. Preencha o formulário
4. Envie

### ✅ Admin - Gerenciar Portfólio

Para adicionar/editar tatuagens com upload de imagens:

1. Configure o bucket de storage (PASSO 2)
2. Torne-se admin (veja instruções abaixo)
3. Vá em "Admin" → aba "Portfólio"
4. Clique em "Adicionar Tatuagem"
5. **Selecione uma imagem** do seu computador (PNG, JPG, WEBP - máx. 5MB)
6. Preencha título, preço, categoria, descrição
7. Marque "Destacar" se quiser que apareça na home
8. Clique em "Adicionar"

### ✅ Tornar-se Admin

Para acessar o painel admin:

1. No Supabase, vá em: https://supabase.com/dashboard/project/fzqcfjnvkteplpykflut/editor
2. Clique em "Table Editor"
3. Selecione a tabela **"profiles"**
4. Encontre sua linha (seu email)
5. Edite a coluna `is_admin` e mude para `true`
6. Salve
7. Faça logout e login novamente
8. O menu "Admin" aparecerá no header

---

## 🎯 Resumo de Senha Forte

A senha deve ter:

- ✅ Mínimo 6 caracteres
- ✅ 1 letra maiúscula
- ✅ 1 número
- ✅ 1 caractere especial (@, #, $, !, etc)

**Exemplo válido**: `Senha@123`, `Tattoo#2024`, `Admin$99`

---

## 🆘 Problemas?

### ❌ "Missing Supabase environment variables"

- O arquivo `.env` já está configurado ✅

### ❌ Catálogo vazio

- Execute o PASSO 1 (migration SQL)

### ❌ Não consigo fazer login

- Verifique se o email e senha estão corretos
- A senha deve atender os requisitos de força

### ❌ Barra de força da senha não aparece

- É normal! Só aparece durante o **cadastro**, não no login

---

**Pronto! Seu sistema está completo e funcional! 🎉**
