# Instruções para Docker

Este documento contém instruções para construir e executar a aplicação usando Docker.

## Construindo a imagem

Para construir a imagem Docker, execute o seguinte comando na raiz do projeto:

```bash
docker build -t crm-tork-negocios .
```

## Executando o contêiner

Para executar o contêiner, use o seguinte comando:

```bash
docker run -p 8080:80 crm-tork-negocios
```

Isso iniciará a aplicação e a disponibilizará na porta 8080 do seu host.

## Variáveis de ambiente

O contêiner suporta a configuração de variáveis de ambiente que serão injetadas na aplicação em tempo de execução. Você pode definir variáveis de ambiente usando a flag `-e` ao executar o contêiner:

```bash
docker run -p 8080:80 \
  -e API_URL=https://api.exemplo.com \
  -e REACT_APP_SUPABASE_URL=https://seu-projeto.supabase.co \
  -e REACT_APP_SUPABASE_ANON_KEY=sua-chave-anonima \
  crm-tork-negocios
```

### Variáveis de ambiente suportadas

- `API_URL`: URL da API backend (padrão: `/api`)
- `NODE_ENV`: Ambiente de execução (padrão: `production`)
- Qualquer variável começando com `REACT_APP_` será disponibilizada para a aplicação

## Acessando a aplicação

Após iniciar o contêiner, a aplicação estará disponível em:

```
http://localhost:8080
```

## Construindo para diferentes ambientes

Para construir a aplicação para um ambiente específico, você pode usar o argumento `--build-arg` durante a construção da imagem:

```bash
docker build \
  --build-arg NODE_ENV=staging \
  --build-arg VITE_API_URL=https://api-staging.exemplo.com \
  -t crm-tork-negocios:staging .
```

### Argumentos de build disponíveis

- `NODE_ENV`: Ambiente de execução para o build (padrão: `production`)
- `VITE_API_URL`: URL da API para o build (padrão: `/api`)

Observe que os argumentos de build são usados durante o processo de construção da aplicação, enquanto as variáveis de ambiente são usadas durante a execução do contêiner. Para configurações que precisam ser definidas no momento do build, use argumentos de build. Para configurações que podem mudar entre diferentes ambientes de execução, use variáveis de ambiente.

## Usando Docker Compose

Para facilitar o desenvolvimento e a implantação, você pode usar o Docker Compose. Um arquivo `docker-compose.yml` já está incluído no projeto com a seguinte configuração:

```yaml
version: '3'

services:
  app:
    build:
      context: .
      args:
        NODE_ENV: production
        VITE_API_URL: /api
    ports:
      - "8080:80"
    environment:
      - NODE_ENV=production
      - API_URL=/api
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://localhost:80/"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 10s
```

Para iniciar a aplicação com Docker Compose, execute:

```bash
docker-compose up
```

Para executar em segundo plano:

```bash
docker-compose up -d
```

Para parar a aplicação:

```bash
docker-compose down
```

### Healthcheck

O contêiner inclui uma verificação de saúde (healthcheck) que verifica periodicamente se a aplicação está respondendo corretamente. Isso é útil para orquestradores de contêineres como Docker Swarm ou Kubernetes, que podem reiniciar automaticamente o contêiner se a verificação falhar.

## Otimizações

O Dockerfile foi otimizado para:

1. Usar multi-stage builds para reduzir o tamanho da imagem final
2. Aproveitar o cache do Docker para acelerar builds subsequentes
3. Executar como usuário não-root para melhor segurança
4. Configurar o Nginx para lidar corretamente com aplicações SPA
5. Suportar injeção de variáveis de ambiente em tempo de execução
