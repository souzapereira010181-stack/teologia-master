# Teologia Master

## Requisitos
- Node.js 18+
- npm 9+

## Instalação
```bash
npm install
cp backend/.env.example backend/.env
cp web/.env.example web/.env
npm run db:init
```

## Executar em desenvolvimento (backend + web juntos)
```bash
npm run dev
```
- API: http://localhost:4000/api/health
- Web: http://localhost:5173

## Executar separadamente
```bash
npm run dev:backend
npm run dev:web
```

## Build de produção (web)
```bash
npm run build:web
```
Gera os arquivos estáticos em `web/dist/`, prontos para publicar em qualquer hospedagem estática (Vercel, Netlify, Cloudflare Pages, Nginx etc.).

## Publicar o backend
```bash
npm run start:backend
```
Defina `PORT`, `JWT_SECRET`, `DATABASE_PATH`, `CORS_ORIGIN` e `OLLAMA_URL` como variáveis de ambiente no serviço de hospedagem (Render, Railway, Fly.io, VPS etc.).

## Assistente de IA (Ollama local — sem chave de API)
O endpoint `/api/ai` usa exclusivamente o [Ollama](https://ollama.com) rodando localmente. Nenhuma `ANTHROPIC_API_KEY` ou chave de API paga é usada.
```bash
ollama serve
ollama pull llama3
```
- O backend detecta automaticamente o primeiro modelo instalado (consulta `GET /api/tags` do Ollama) — não é preciso configurar o nome do modelo manualmente.
- Para forçar um modelo específico, defina `OLLAMA_MODEL` no `backend/.env`.
- Antes de responder qualquer pergunta, o backend testa a conexão com o Ollama; se o serviço não estiver acessível, retorna erro 503 com uma mensagem clara em vez de travar.
- `GET /api/ai/status` (autenticado) permite ao frontend checar a qualquer momento se o Ollama está conectado e qual modelo está em uso.
