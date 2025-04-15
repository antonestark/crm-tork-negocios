#!/bin/sh

# Script para gerar arquivo de configuração de ambiente em tempo de execução
# Isso permite injetar variáveis de ambiente no momento da execução do contêiner

# Criar arquivo de configuração
echo "window.ENV = {" > /usr/share/nginx/html/env-config.js

# Adicionar variáveis de ambiente que começam com REACT_APP_
env | grep -E '^REACT_APP_' | while read -r line; do
  # Extrair nome e valor da variável
  name=$(echo "$line" | cut -d '=' -f 1)
  value=$(echo "$line" | cut -d '=' -f 2-)
  
  # Adicionar ao arquivo de configuração
  echo "  \"$name\": \"$value\"," >> /usr/share/nginx/html/env-config.js
done

# Adicionar variáveis específicas da aplicação
echo "  \"NODE_ENV\": \"${NODE_ENV:-production}\"," >> /usr/share/nginx/html/env-config.js
echo "  \"API_URL\": \"${API_URL:-/api}\"" >> /usr/share/nginx/html/env-config.js

# Fechar objeto
echo "};" >> /usr/share/nginx/html/env-config.js

# Não executamos o comando passado como argumento, pois este script
# é executado pelo mecanismo de entrypoint do Nginx antes de iniciar o servidor
