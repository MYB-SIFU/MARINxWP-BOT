function getHTML(pkg, startTime) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>${pkg.name} — Status</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  :root{
    --cyan:#00FFFF;
    --blue:#00A1E0;
    --dark:#050810;
    --card:#0d1526;
    --border:rgba(0,161,224,0.25);
    --glow:0 0 20px rgba(0,255,255,0.15);
  }
  body{
    background:var(--dark);
    color:#e0f7ff;
    font-family:'Segoe UI',system-ui,sans-serif;
    min-height:100vh;
    overflow-x:hidden;
    position:relative;
  }
  canvas#bg{
    position:fixed;top:0;left:0;width:100%;height:100%;
    z-index:0;opacity:0.35;pointer-events:none;
  }
  .wrap{
    position:relative;z-index:1;
    min-height:100vh;
    display:flex;flex-direction:column;
    align-items:center;justify-content:center;
    padding:2rem 1rem;
    gap:2rem;
  }

  /* ── HEADER ── */
  .header{text-align:center}
  .logo{
    font-size:clamp(2.4rem,8vw,4rem);
    font-weight:900;
    letter-spacing:.12em;
    background:linear-gradient(135deg,var(--blue),var(--cyan),#fff,var(--cyan));
    background-size:300% 300%;
    -webkit-background-clip:text;-webkit-text-fill-color:transparent;
    background-clip:text;
    animation:gradShift 4s ease infinite;
    text-shadow:none;
    filter:drop-shadow(0 0 18px rgba(0,255,255,0.5));
  }
  @keyframes gradShift{
    0%{background-position:0% 50%}
    50%{background-position:100% 50%}
    100%{background-position:0% 50%}
  }
  .tagline{
    margin-top:.5rem;
    font-size:.88rem;
    letter-spacing:.25em;
    text-transform:uppercase;
    color:rgba(0,255,255,.55);
  }

  /* ── STATUS BADGE ── */
  .badge{
    display:inline-flex;align-items:center;gap:.6rem;
    background:rgba(0,255,100,.07);
    border:1px solid rgba(0,255,100,.35);
    border-radius:50px;
    padding:.45rem 1.2rem;
    font-size:.82rem;
    font-weight:700;
    letter-spacing:.1em;
    color:#00ff88;
    box-shadow:0 0 18px rgba(0,255,100,.12);
    margin-top:1rem;
  }
  .dot{
    width:9px;height:9px;
    background:#00ff88;
    border-radius:50%;
    box-shadow:0 0 8px #00ff88;
    animation:pulse 1.6s ease-in-out infinite;
  }
  @keyframes pulse{
    0%,100%{opacity:1;transform:scale(1)}
    50%{opacity:.4;transform:scale(.75)}
  }

  /* ── GRID ── */
  .grid{
    display:grid;
    grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
    gap:1rem;
    width:100%;max-width:900px;
  }
  .card{
    background:var(--card);
    border:1px solid var(--border);
    border-radius:14px;
    padding:1.4rem 1.6rem;
    box-shadow:var(--glow);
    backdrop-filter:blur(8px);
    transition:transform .2s,box-shadow .2s;
    position:relative;overflow:hidden;
  }
  .card::before{
    content:'';
    position:absolute;top:0;left:0;right:0;height:2px;
    background:linear-gradient(90deg,transparent,var(--cyan),transparent);
    opacity:.6;
  }
  .card:hover{
    transform:translateY(-3px);
    box-shadow:0 0 30px rgba(0,161,224,0.25);
  }
  .card-label{
    font-size:.72rem;
    letter-spacing:.2em;
    text-transform:uppercase;
    color:rgba(0,161,224,.7);
    margin-bottom:.5rem;
  }
  .card-value{
    font-size:1.35rem;
    font-weight:700;
    color:#fff;
    line-height:1.2;
    word-break:break-all;
  }
  .card-value.accent{color:var(--cyan)}
  .card-icon{
    font-size:1.6rem;
    margin-bottom:.6rem;
    filter:drop-shadow(0 0 6px rgba(0,255,255,.4));
  }

  /* ── UPTIME ── */
  #uptime{font-variant-numeric:tabular-nums}

  /* ── LINKS ── */
  .links{
    display:flex;gap:1rem;flex-wrap:wrap;justify-content:center;
  }
  .btn{
    display:inline-flex;align-items:center;gap:.5rem;
    padding:.65rem 1.6rem;
    border-radius:8px;
    font-size:.85rem;
    font-weight:700;
    text-decoration:none;
    letter-spacing:.06em;
    transition:all .2s;
    border:1px solid transparent;
  }
  .btn-primary{
    background:linear-gradient(135deg,var(--blue),var(--cyan));
    color:#050810;
  }
  .btn-primary:hover{box-shadow:0 0 22px rgba(0,255,255,.45);transform:translateY(-2px)}
  .btn-ghost{
    background:transparent;
    border-color:var(--border);
    color:var(--cyan);
  }
  .btn-ghost:hover{background:rgba(0,161,224,.1);border-color:var(--cyan)}

  /* ── FOOTER ── */
  .footer{
    font-size:.75rem;
    color:rgba(0,255,255,.3);
    letter-spacing:.1em;
    text-align:center;
  }
  .footer span{color:rgba(0,255,255,.55)}

  /* ── SCAN LINE ── */
  @keyframes scan{
    0%{transform:translateY(-100%)}
    100%{transform:translateY(100vh)}
  }
  .scan{
    position:fixed;top:0;left:0;width:100%;height:3px;
    background:linear-gradient(90deg,transparent,rgba(0,255,255,.18),transparent);
    animation:scan 6s linear infinite;
    z-index:2;pointer-events:none;
  }
</style>
</head>
<body>
<canvas id="bg"></canvas>
<div class="scan"></div>
<div class="wrap">

  <div class="header">
    <div class="logo">${pkg.name}</div>
    <div class="tagline">Advanced WhatsApp Bot · v${pkg.version}</div>
    <div class="badge"><span class="dot"></span>ONLINE &amp; OPERATIONAL</div>
  </div>

  <div class="grid">
    <div class="card">
      <div class="card-icon">🤖</div>
      <div class="card-label">Bot Name</div>
      <div class="card-value accent">${pkg.name}</div>
    </div>
    <div class="card">
      <div class="card-icon">⚡</div>
      <div class="card-label">Version</div>
      <div class="card-value">${pkg.version}</div>
    </div>
    <div class="card">
      <div class="card-icon">⏱️</div>
      <div class="card-label">Uptime</div>
      <div class="card-value accent" id="uptime">—</div>
    </div>
    <div class="card">
      <div class="card-icon">👨‍💻</div>
      <div class="card-label">Developer</div>
      <div class="card-value">SIFAT</div>
    </div>
    <div class="card">
      <div class="card-icon">🌐</div>
      <div class="card-label">Platform</div>
      <div class="card-value">Node.js ${process.version}</div>
    </div>
    <div class="card">
      <div class="card-icon">✅</div>
      <div class="card-label">Status</div>
      <div class="card-value" style="color:#00ff88">Running</div>
    </div>
  </div>

  <div class="links">
    <a class="btn btn-primary" href="https://github.com/MYB-SIFU/MARINxWP-BOT" target="_blank">
      ⭐ GitHub
    </a>
    <a class="btn btn-ghost" href="/api/status" target="_blank">
      📡 JSON Status
    </a>
  </div>

  <div class="footer">
    Developed with ♡ by <span>SIFAT</span> · MARINxWP &copy; ${new Date().getFullYear()}
  </div>

</div>

<script>
  /* ── LIVE UPTIME ── */
  const start = ${startTime};
  function fmt(ms){
    const s=Math.floor(ms/1000),m=Math.floor(s/60),h=Math.floor(m/60),d=Math.floor(h/24);
    if(d>0) return d+'d '+(h%24)+'h '+(m%60)+'m';
    if(h>0) return h+'h '+(m%60)+'m '+(s%60)+'s';
    if(m>0) return m+'m '+(s%60)+'s';
    return s+'s';
  }
  function tick(){
    const el=document.getElementById('uptime');
    if(el) el.textContent=fmt(Date.now()-start);
  }
  tick();setInterval(tick,1000);

  /* ── PARTICLE GRID BACKGROUND ── */
  const cv=document.getElementById('bg');
  const ctx=cv.getContext('2d');
  let W,H,pts=[];
  function resize(){W=cv.width=innerWidth;H=cv.height=innerHeight;init()}
  function rand(a,b){return a+Math.random()*(b-a)}
  function init(){
    pts=[];
    const n=Math.floor((W*H)/14000);
    for(let i=0;i<n;i++) pts.push({
      x:rand(0,W),y:rand(0,H),
      vx:rand(-.3,.3),vy:rand(-.3,.3),
      r:rand(1,2.5)
    });
  }
  function draw(){
    ctx.clearRect(0,0,W,H);
    for(let i=0;i<pts.length;i++){
      const p=pts[i];
      p.x+=p.vx;p.y+=p.vy;
      if(p.x<0||p.x>W) p.vx*=-1;
      if(p.y<0||p.y>H) p.vy*=-1;
      ctx.beginPath();
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle='rgba(0,161,224,0.8)';
      ctx.fill();
      for(let j=i+1;j<pts.length;j++){
        const q=pts[j];
        const dx=p.x-q.x,dy=p.y-q.y;
        const d=Math.sqrt(dx*dx+dy*dy);
        if(d<120){
          ctx.beginPath();
          ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);
          ctx.strokeStyle='rgba(0,255,255,'+(1-d/120)*.25+')';
          ctx.lineWidth=.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  window.addEventListener('resize',resize);
  resize();draw();
</script>
</body>
</html>`;
}

module.exports = { getHTML };
