function escapeHtml (s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

// camelCase -> kebab-case for HTML attrs (e.g., crossOrigin -> crossorigin)
function toAttrName (key) {
  return key.replace(/[A-Z]/g, m => '-' + m.toLowerCase())
}

function linkTag (attrs) {
  const parts = []
  for (const [k, v] of Object.entries(attrs)) {
    if (v === undefined || v === null || v === false) continue
    parts.push(`${toAttrName(k)}="${escapeHtml(String(v))}"`)
  }
  return `<link ${parts.join(' ')} />`
}

function scriptTag (attrs, nonce) {
  if (attrs.inline) {
    return `<script nonce="${nonce}">${attrs.inline}</script>`
  }
  const parts = []
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'inline') continue
    parts.push(`${k}="${String(v)}"`)
  }
  return `<script nonce="${nonce}" ${parts.join(' ')}></script>`
}

export function renderScriptTags (scripts, nonce) {
  return scripts.map(s => scriptTag(s, nonce)).join('\n')
}

export function renderLinkTags (links) {
  return links.map(linkTag).join('\n')
}
