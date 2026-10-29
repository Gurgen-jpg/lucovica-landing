import { absoluteUrl, config } from '../config.ts'
import { site } from '../content/site.ts'
import { html, jsonScript, raw, type SafeHtml } from '../lib/html.ts'
import type { PageMeta, RenderContext } from '../lib/page.ts'

const OG_IMAGE = { path: '/og-image.jpg', width: 1200, height: 630 }

function metrikaHead(ymId: string): SafeHtml {
  // Стандартный сниппет Метрики; tag.js загружается асинхронно.
  return html`<script>
(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();
for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}
k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
(window,document,"script","https://mc.yandex.ru/metrika/tag.js","ym");
ym(${raw(JSON.stringify(Number(ymId)))},"init",{clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:true});
window.__YM_ID=${raw(JSON.stringify(Number(ymId)))};
</script>`
}

function metrikaNoscript(ymId: string): SafeHtml {
  return html`<noscript><div><img src="https://mc.yandex.ru/watch/${ymId}" style="position:absolute;left:-9999px" alt=""></div></noscript>`
}

const DEV_RELOAD = raw(
  `<script>new EventSource('/__dev/reload').addEventListener('reload',()=>location.reload())</script>`,
)

export function document(meta: PageMeta, body: SafeHtml, ctx: RenderContext): SafeHtml {
  const canonical = absoluteUrl(ctx.path)
  const og = meta.og ?? {}
  const ogImage = absoluteUrl(og.image ?? OG_IMAGE.path)

  return html`<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${meta.title}</title>
<meta name="description" content="${meta.description}">
${meta.noindex ? html`<meta name="robots" content="noindex, nofollow">` : html`<link rel="canonical" href="${canonical}">`}
<meta property="og:type" content="${og.type ?? 'website'}">
<meta property="og:locale" content="ru_RU">
<meta property="og:site_name" content="${site.name}">
<meta property="og:title" content="${og.title ?? meta.title}">
<meta property="og:description" content="${og.description ?? meta.description}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${ogImage}">
${og.image ? null : html`<meta property="og:image:width" content="${OG_IMAGE.width}">
<meta property="og:image:height" content="${OG_IMAGE.height}">`}
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" href="/favicon-32.png" type="image/png" sizes="32x32">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<meta name="theme-color" content="#F7F5F0">
${ctx.assets.preload.map(
  (p) => html`<link rel="preload" href="${p.href}" as="${p.as}"${p.type ? html` type="${p.type}"` : null}${p.as === 'font' ? raw(' crossorigin') : null}>`,
)}
${ctx.assets.css.map((href) => html`<link rel="stylesheet" href="${href}">`)}
${ctx.assets.js.map((src) => html`<script type="module" src="${src}"></script>`)}
${(meta.jsonLd ?? []).map((data) => html`<script type="application/ld+json">${jsonScript(data)}</script>`)}
${config.ymId ? metrikaHead(config.ymId) : null}
${config.dev ? DEV_RELOAD : null}
</head>
<body${meta.pageGoal ? html` data-page-goal="${meta.pageGoal}"` : null}>
${body}
${config.ymId ? metrikaNoscript(config.ymId) : null}
</body>
</html>
`
}
