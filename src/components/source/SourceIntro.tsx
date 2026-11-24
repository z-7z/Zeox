/** An illustrative byte mapping, never a preview of an attached script. */
function EncodingPlate() {
  return <figure className="encoding-plate" aria-label="Encoding example: L, u and a have UTF-8 byte values 76, 117 and 97.">
    <figcaption><span>FIG. 01</span> LITERAL ENCODING</figcaption>
    <svg viewBox="0 0 300 70" fill="none" aria-hidden="true">
      <g stroke="#494641" strokeWidth="1.2"><path d="M26 21h65l26 27h91l25-27h40M26 35h248M26 49h64l27-27h91l26 27h39" /></g>
      <path d="M26 21h65l26 27h91l25-27h40" stroke="#ff8d42" strokeWidth="1.6" />
      <g fill="#96918b">{[21,35,49].map(y => <g key={y}><circle cx="26" cy={y} r="2"/><circle cx="273" cy={y} r="2"/></g>)}</g>
      <g fill="#181715" stroke="#585149"><path d="M134 16h27l7 7v32h-34z"/><path d="M139 11h27l7 7v32h-34z"/></g>
      <g stroke="#ff9d5c" strokeWidth="2"><path d="m151 22-6 6 6 6m11-12 6 6-6 6m-3-15-5 18"/></g>
      <g fill="#d2cdc7" fontFamily="monospace" fontSize="10">{['L','u','a'].map((c,i) => <g key={c}><text x="7" y={24+14*i}>{c}</text><text x="280" y={24+14*i}>{['076','117','097'][i]}</text></g>)}</g>
    </svg>
  </figure>;
}
export function SourceIntro() {
  return <header className="source-intro">
    <div><p className="source-kicker"><i aria-hidden="true"/> SOURCE LAB <span>/</span> LUA + LUAU</p>
      <h1>Lua Obfuscator<span aria-hidden="true">.</span></h1>
      <p className="intro-copy">Attach a script. Choose your transforms. Download a separate copy.</p>
    </div><EncodingPlate />
  </header>;
}
