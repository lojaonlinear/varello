# Varello — Sorteio de 50% OFF + Painel de métricas

## O que tem aqui

- **`index.html`** — página do cliente (em espanhol, tom colombiano). Fluxo:
  1. Pergunta persuasiva: *"¿Quieres participar y ganar un descuento exclusivo de nuestra tienda?"* com botões **Sí** / **No**.
     - **No** → redireciona direto para a sua página de vendas.
     - **Sí** → pede o nome da pessoa.
  2. Depois do nome, roda a animação da caixa abrindo (a mesma que já existia).
  3. Revela o prêmio: *"¡Felicidades, fuiste sorteado/a!"* com o cupom de 50%, contador até 00:00 e botão final que redireciona para a página de vendas.
- **`admin.html`** — painel administrativo em português, protegido por senha, com as métricas de cliques.
- **`apps-script.gs`** — código do backend gratuito (Google Apps Script) que recebe e guarda os eventos da página.

## Passo a passo para colocar tudo no ar

### 1. Criar o backend de métricas (gratuito, via Google)

1. Acesse sheets.new e crie uma planilha nova (ex: "Varello - Métricas").
2. No menu, vá em **Extensões → Apps Script**.
3. Apague o conteúdo padrão e cole todo o conteúdo do arquivo `apps-script.gs`.
4. Clique em **Implantar → Nova implantação**.
   - Tipo: **App da Web**
   - Executar como: **Eu**
   - Quem pode acessar: **Qualquer pessoa**
5. Copie a URL gerada (termina em `/exec`). É essa URL que vai em `index.html` e em `admin.html`.

### 2. Configurar o `index.html`

Abra o arquivo e edite estas duas linhas dentro do `<script>` final:

```js
var URL_PAGINA_VENTAS = "https://tutienda-varello.com/coleccion?cupon=VARELLO50";
var APPS_SCRIPT_URL = ""; // cole aqui a URL /exec do passo 1
```

Se `APPS_SCRIPT_URL` ficar vazio, a página funciona normalmente, só não registra métricas.

### 3. Colocar o Pixel do TikTok Ads

No topo do `index.html`, dentro do `<head>`, tem um bloco bem demarcado assim:

```html
<!-- =====================================================
  PIXEL DE TIKTOK ADS — cole aqui o código base...
===================================================== -->
<!--
<script>
  ... código do TikTok ...
  ttq.load('TU_PIXEL_ID');
  ttq.page();
</script>
-->
```

Troque `TU_PIXEL_ID` pelo ID real do seu pixel (TikTok Ads Manager → Recursos → Eventos → Pixel Web → Instalar manualmente) e **remova as tags `<!--` e `-->`** que estão comentando o bloco.

A página já dispara automaticamente estes eventos do pixel nos momentos certos:
- `ViewContent` — quando a pessoa clica em "Sí"
- `CompleteRegistration` — quando envia o nome
- `ClickButton` — quando clica no botão final para resgatar o cupom

### 4. Publicar no GitHub Pages

1. Suba `index.html`, `admin.html` e `apps-script.gs` para um repositório.
2. Vá em **Settings → Pages → Deploy from branch** e selecione `main` (raiz).
3. Sua página fica em algo como `https://seuusuario.github.io/seurepo/`.
4. O painel fica em `https://seuusuario.github.io/seurepo/admin.html` — **não divulgue esse link publicamente**, é só para uso interno.

### 5. Configurar e usar o painel (`admin.html`)

1. Abra `admin.html` e troque a senha padrão:

   ```js
   var SENHA_PAINEL = "varello2026"; // troque antes de publicar
   ```

2. Ao acessar o painel pela primeira vez, cole a mesma URL do Apps Script (`/exec`) no campo do topo e clique em **Salvar**. Ela fica guardada só no seu navegador.
3. O painel mostra:
   - **Pessoas que visitaram a página**
   - **Cliques em "Sim"** e **Cliques em "Não"** (com % sobre o total de visitas)
   - **Saídas sem clicar em nada** (quem abriu e foi embora sem interagir)
   - **Quantos preencheram o nome**
   - **Quantos clicaram para resgatar o cupom** (conversão final)
   - Um funil visual com barras mostrando a queda em cada etapa
4. Atualiza sozinho a cada 30 segundos, ou clique em **Atualizar agora**.

⚠️ Como é uma página estática, a senha do painel protege contra acesso casual, mas não é uma segurança de nível bancário — não é o lugar ideal para dados sensíveis. Para algo mais robusto, futuramente dá pra migrar esse backend para algo com autenticação real (Firebase, Supabase, etc).
