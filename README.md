# Comercial PVC — Landing Page

Landing Page oficial da Comercial PVC (Caruaru - PE), focada na conversão de tráfego pago para ripados WPC, forros de PVC, teto vinílico, papel de parede autoadesivo e telhas de PVC.

## 🚀 Estrutura do Projeto

- `index.html` — Landing page principal com hero imersivo, catálogo de 9 produtos reais, especificações, medidas, tabela de preços e FAQ. Sem formulário: todos os CTAs vão direto para `obrigado.html`.
- `obrigado.html` — Página pós-clique com botões diretos para o WhatsApp de cada um dos 4 vendedores da loja.
- `privacidade.html` — Política de Privacidade (adequada para conformidade com Meta Ads / Google Ads).
- `termos.html` — Termos e Condições de Uso.
- `style-guide.html` — Guia de estilos vivo com documentação visual de componentes e design tokens.
- `tokens.css` — Fonte de verdade de cores, tipografia e espaçamentos.
- `assets/` — Fotos reais da loja física, mostruários montados no showroom e vídeo demonstrativo do forro frisado.
- `sitemap.xml`, `robots.txt`, `llms.txt` — Arquivos de SEO e indexação.
- `api/capi.js` — Função serverless (Vercel) que encaminha eventos de conversão pra Meta Conversion API server-side. Ver seção Rastreamento abaixo.

## 🛠️ Tecnologias

- **HTML5 Semântico**
- **CSS3 Moderno** com Design Tokens (paleta Carvão `#1C1A17` + Dourado `#D9A441` + Creme)
- **Tipografia:** Sora (títulos/display) e Inter (corpo) via Google Fonts
- **JavaScript Vanilla** (sem frameworks ou dependências pesadas)
- **SEO Estruturado:** Schema.org (`HomeGoodsStore` e `FAQPage`)

## 📊 Rastreamento (Google Analytics, Meta Pixel e Conversion API)

- **Google Analytics (gtag.js):** `G-QBTDK39BDL`, carregado em `index.html` e `obrigado.html`.
- **Meta Pixel:** `1061442156739147`, carregado em `index.html` e `obrigado.html`. Dispara `PageView` nas duas páginas e `Lead` em `obrigado.html` (só se chega lá clicando em algum CTA de orçamento).
- **Meta Conversion API (server-side):** `obrigado.html` também chama `POST /api/capi` com o mesmo `event_id` do `fbq('track', 'Lead', ...)`, pra Meta deduplicar o evento client-side e server-side. `api/capi.js` roda como função serverless na Vercel e faz a chamada real pra Graph API.
  - **Nunca commitar o token de acesso da Conversion API neste repositório — ele é público.** O token fica só na variável de ambiente `META_CAPI_TOKEN`, cadastrada em Vercel → Project → Settings → Environment Variables.
  - Sem essa variável configurada, `/api/capi` responde erro 500 (`capi_not_configured`) mas isso não quebra o site: o `fetch` do `obrigado.html` falha silenciosamente (só um `console.warn`) e o Pixel client-side continua funcionando normalmente.
