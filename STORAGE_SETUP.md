# 📸 Configuração de Upload de Imagens - Supabase Storage

## ⚠️ IMPORTANTE: Configure antes de usar o upload de imagens

Para que o upload de imagens funcione no portfólio e nos agendamentos, você precisa criar buckets de storage no Supabase.

## 🔧 Passo a Passo

### 1. Acessar o Supabase Storage

1. Acesse: https://supabase.com/dashboard/project/fzqcfjnvkteplpykflut/storage/buckets
2. Faça login com sua conta Supabase

### 2. Criar o Bucket

1. Clique em **"New bucket"** (ou "+ Create bucket")
2. Preencha os dados:
   - **Name**: `portfolio`
   - **Public bucket**: ✅ **MARQUE ESTA OPÇÃO** (importante para as imagens serem acessíveis)
   - **File size limit**: 5MB (ou deixe em branco para usar o padrão)
3. Clique em **"Create bucket"**

### 2.1 Criar Bucket para Imagens de Referência (Agendamentos)

1. Clique em **"New bucket"** novamente
2. Preencha os dados:
   - **Name**: `appointment-references`
   - **Public bucket**: ❌ **NÃO MARQUE** (imagens privadas dos clientes)
   - **File size limit**: 10MB (para permitir múltiplas imagens de referência)
3. Clique em **"Create bucket"**

### 3. Configurar Políticas de Segurança (RLS)

Após criar o bucket, você precisa configurar as políticas de acesso:

1. Clique no bucket **"portfolio"** que você acabou de criar
2. Vá na aba **"Policies"**
3. Clique em **"New Policy"**

#### Política 1: Permitir Upload (INSERT)

1. Escolha **"For full customization"** → **"Create policy"**
2. Preencha:
   - **Policy name**: `Admins can upload images`
   - **Allowed operation**: SELECT **INSERT**
   - **Policy definition**: Cole este código:

```sql
(bucket_id = 'portfolio'::text) AND (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
)
```

3. Clique em **"Review"** → **"Save policy"**

#### Política 2: Permitir Visualização (SELECT)

1. Clique em **"New Policy"** novamente
2. Escolha **"For full customization"** → **"Create policy"**
3. Preencha:
   - **Policy name**: `Anyone can view images`
   - **Allowed operation**: SELECT **SELECT**
   - **Policy definition**: Cole este código:

```sql
bucket_id = 'portfolio'::text
```

4. Clique em **"Review"** → **"Save policy"**

#### Política 3: Permitir Deleção (DELETE) - Opcional

1. Clique em **"New Policy"** novamente
2. Escolha **"For full customization"** → **"Create policy"**
3. Preencha:
   - **Policy name**: `Admins can delete images`
   - **Allowed operation**: SELECT **DELETE**
   - **Policy definition**: Cole este código:

```sql
(bucket_id = 'portfolio'::text) AND (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
)
```

4. Clique em **"Review"** → **"Save policy"**

### 3.1 Configurar Políticas para Bucket de Imagens de Referência

Agora configure as políticas para o bucket **"appointment-references"**:

1. Clique no bucket **"appointment-references"**
2. Vá na aba **"Policies"**

#### Política 1: Usuários podem fazer upload de suas referências

1. Clique em **"New Policy"**
2. Escolha **"For full customization"** → **"Create policy"**
3. Preencha:
   - **Policy name**: `Users can upload their references`
   - **Allowed operation**: SELECT **INSERT**
   - **Policy definition**:

```sql
(bucket_id = 'appointment-references'::text) AND (auth.uid() IS NOT NULL)
```

4. Clique em **"Review"** → **"Save policy"**

#### Política 2: Usuários podem ver suas próprias imagens

1. Clique em **"New Policy"**
2. Escolha **"For full customization"** → **"Create policy"**
3. Preencha:
   - **Policy name**: `Users can view their own references`
   - **Allowed operation**: SELECT **SELECT**
   - **Policy definition**:

```sql
(bucket_id = 'appointment-references'::text) AND (
  (storage.foldername(name))[1] = auth.uid()::text
)
```

4. Clique em **"Review"** → **"Save policy"**

#### Política 3: Admins podem ver todas as referências

1. Clique em **"New Policy"**
2. Escolha **"For full customization"** → **"Create policy"**
3. Preencha:
   - **Policy name**: `Admins can view all references`
   - **Allowed operation**: SELECT **SELECT**
   - **Policy definition**:

```sql
(bucket_id = 'appointment-references'::text) AND (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  )
)
```

4. Clique em **"Review"** → **"Save policy"**

## ✅ Pronto! Agora você pode fazer upload

### Upload no Portfólio (Admin)

Após configurar o bucket `portfolio` e as políticas:

1. Acesse o painel administrativo
2. Vá em **"Portfólio"**
3. Clique em **"Adicionar Tatuagem"**
4. Selecione uma imagem do seu computador
5. Preencha os dados e clique em **"Adicionar"**

### Upload de Referências no Agendamento

Após configurar o bucket `appointment-references`:

1. Acesse a página **"Agendar Sessão"**
2. Preencha os dados do formulário
3. No campo **"Imagens de Referência"**, clique para selecionar arquivos
4. Escolha uma ou mais imagens (até 10MB no total)
5. Continue preenchendo o formulário e clique em **"Confirmar Agendamento"**

## 🖼️ Formatos Suportados

### Portfólio (Admin):

- **PNG** - Imagens com transparência
- **JPG/JPEG** - Fotos
- **WEBP** - Formato moderno e otimizado
- **Tamanho máximo**: 5MB por imagem

### Imagens de Referência (Agendamentos):

- **PNG, JPG/JPEG, WEBP, GIF**
- **Tamanho máximo total**: 10MB (múltiplas imagens)

## 🔍 Solução de Problemas

### ❌ "Erro ao fazer upload da imagem"

**Causa**: Bucket não criado ou políticas não configuradas.

**Solução**:

1. Verifique se os buckets `portfolio` e `appointment-references` existem
2. Verifique se o bucket `portfolio` está marcado como **"Public bucket"**
3. Verifique se o bucket `appointment-references` está como **privado**
4. Confirme que as políticas foram criadas corretamente

### ❌ "Access denied" ou "Permission denied"

**Causa**: Políticas RLS não configuradas ou permissões incorretas.

**Solução**:

- **Para portfolio**: Confirme que seu usuário tem `is_admin = true` na tabela `profiles`
- **Para referências**: Verifique se você está autenticado (logged in)

### ❌ Imagem não aparece após upload (Portfólio)

**Causa**: Bucket não marcado como público.

**Solução**:

1. Vá em Storage > portfolio > Configuration
2. Marque a opção **"Public bucket"**
3. Salve as alterações

## 📊 Visualizar Imagens Enviadas

### Imagens do Portfólio:

1. Acesse: https://supabase.com/dashboard/project/fzqcfjnvkteplpykflut/storage/buckets/portfolio
2. Entre na pasta **"tattoos"**
3. Todas as imagens enviadas estarão listadas aqui

### Imagens de Referência dos Agendamentos:

1. Acesse: https://supabase.com/dashboard/project/fzqcfjnvkteplpykflut/storage/buckets/appointment-references
2. As imagens são organizadas por pastas com o ID do usuário
3. Dentro de cada pasta de usuário, há subpastas com o ID do agendamento

## 🗑️ Deletar Imagens Antigas

### Imagens do Portfólio:

Quando você remove uma tatuagem do portfólio, a imagem permanece no storage. Para economia de espaço:

1. Vá em Storage > portfolio > tattoos
2. Selecione as imagens não utilizadas
3. Clique em **"Delete"**

### Imagens de Referência:

As imagens de referência podem acumular no storage. Para limpar:

1. Vá em Storage > appointment-references
2. Navegue pelas pastas de usuários
3. Delete pastas de agendamentos antigos ou cancelados

---

**🎉 Tudo configurado! Agora os sistemas de upload estão 100% funcionais!**

## 📝 Resumo da Configuração

✅ **Bucket `portfolio`**: Público, para imagens do catálogo (apenas admins podem fazer upload)
✅ **Bucket `appointment-references`**: Privado, para imagens de referência dos clientes (usuários logados podem fazer upload)

**Próximos passos**: Use os formulários de agendamento e portfólio normalmente!
