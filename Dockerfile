# Stage 1: Build the React application
FROM oven/bun:1 as builder
WORKDIR /app

# Copiar arquivos de manifesto e lock
COPY package.json bun.lockb ./

# Instalar dependências
RUN bun install --frozen-lockfile

# Copiar o restante do código da aplicação
COPY . .

# Construir a aplicação para produção
# Precisamos passar as variáveis Supabase aqui, mesmo que vazias por enquanto,
# para que o build não falhe se o código tentar acessá-las durante o build.
# Elas serão substituídas por valores reais no runtime via Portainer.
ARG VITE_SUPABASE_URL=dummy_url
ARG VITE_SUPABASE_ANON_KEY=dummy_key
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
RUN bun run build

# Stage 2: Serve the application with Nginx
FROM nginx:stable-alpine
WORKDIR /usr/share/nginx/html

# Remover o conteúdo padrão do Nginx
RUN rm -rf ./*

# Copiar os arquivos construídos do estágio anterior
COPY --from=builder /app/dist .

# Copiar uma configuração Nginx personalizada (opcional, mas recomendado para SPA)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expor a porta 80
EXPOSE 80

# Comando padrão para iniciar o Nginx
CMD ["nginx", "-g", "daemon off;"]
