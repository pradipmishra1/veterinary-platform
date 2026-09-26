const fs = require('fs');
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path');
const OUT = path.resolve('brag-output');
const WORK = path.join(OUT, 'work');
const b64 = p => fs.readFileSync(path.join(WORK,p)).toString('base64');
const hero = `data:image/png;base64,${b64('01-home.png')}`;
const shop = `data:image/png;base64,${b64('shop-screen.png')}`;
const order = `data:image/png;base64,${b64('order-screen.png')}`;
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
*{box-sizing:border-box}html,body{margin:0;width:1920px;height:1080px;overflow:hidden;background:#0a3027;color:#f6f7f2;font-family:Arial,Helvetica,sans-serif}
#stage{position:relative;width:1920px;height:1080px;overflow:hidden;background:radial-gradient(ellipse at 78% 50%,#195541 0%,#0d3a2e 37%,#092d25 76%)}
#stage:before{content:"";position:absolute;inset:-15%;background:radial-gradient(circle at 92% 14%,rgba(93,196,151,.16),transparent 24%),radial-gradient(circle at 11% 92%,rgba(51,144,109,.15),transparent 30%);}
.grain{position:absolute;inset:0;opacity:.055;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.4'/%3E%3C/svg%3E");pointer-events:none}
#ambient{position:absolute;inset:0;opacity:.44;background:linear-gradient(110deg,transparent 42%,rgba(255,255,255,.018) 55%,transparent 68%)}
#copy{position:absolute;left:104px;top:276px;width:500px;z-index:2;will-change:transform,opacity}
.eyebrow{display:flex;align-items:center;gap:11px;font-size:15px;font-weight:700;letter-spacing:2.3px;text-transform:uppercase;color:#96d7b8;margin:0 0 26px}
.dot{width:8px;height:8px;border-radius:50%;background:#6de0a9;box-shadow:0 0 16px #6de0a9}
h1{font-size:70px;line-height:1.055;letter-spacing:-2.3px;margin:0 0 24px;font-weight:750;white-space:pre-line;color:#fff}
.sub{font-size:22px;line-height:1.46;letter-spacing:-.15px;color:rgba(244,249,245,.79);margin:0;white-space:pre-line;max-width:475px}
.rule{margin-top:33px;width:68px;height:3px;border-radius:5px;background:#54bd8e}
#window{position:absolute;left:650px;top:180px;width:1218px;height:718px;padding:8px;background:#fff;border:1px solid rgba(255,255,255,.58);border-radius:23px;box-shadow:0 35px 110px rgba(0,0,0,.42),0 2px 7px rgba(0,0,0,.2);z-index:1;will-change:transform,opacity;overflow:hidden}
#bar{height:33px;margin:-1px -1px 7px;display:flex;align-items:center;padding:0 13px;gap:7px;background:#fff;border-bottom:1px solid #e8ede9;color:#68766f;font-size:11px;letter-spacing:1.2px;font-weight:700}
.wdot{height:9px;width:9px;border-radius:50%;background:#c8d2cb}.wlabel{margin-left:8px}
#screen{display:block;width:1200px;height:675px;object-fit:cover;object-position:top left;border-radius:0 0 14px 14px}
#cursor{position:absolute;z-index:4;left:0;top:0;width:45px;height:54px;opacity:0;pointer-events:none;filter:drop-shadow(0 3px 5px rgba(0,0,0,.55));will-change:left,top,opacity,transform}
#cursor svg{width:100%;height:100%}
.intro{}\n#stage[data-kind="intro"] h1{font-size:60px}\n#stage[data-kind="order"] h1{font-size:58px}\n#stage[data-kind="emergency"] h1{font-size:60px}\n#stage[data-kind="close"] h1{font-size:48px}\n#brand{position:absolute;left:104px;bottom:74px;font-size:13px;font-weight:700;letter-spacing:1.6px;color:rgba(226,245,234,.54);z-index:2}
#brand span{color:rgba(226,245,234,.82)}
</style></head><body><main id="stage"><div id="ambient"></div><div class="grain"></div><section id="copy"><div class="eyebrow"><i class="dot"></i><span id="eyebrowText"></span></div><h1 id="title"></h1><p class="sub" id="subtitle"></p><div class="rule" id="rule"></div></section><div id="window"><div id="bar"><i class="wdot"></i><i class="wdot"></i><i class="wdot"></i><span class="wlabel">SUPPOSEVETERINARY · PET CARE IN KATHMANDU</span></div><img id="screen" src="${hero}"></div><div id="cursor"><svg viewBox="0 0 38 48" xmlns="http://www.w3.org/2000/svg"><path d="M4 3.5c0-1.9 2.2-2.9 3.7-1.5L32 24.2c1.9 1.7.8 4.8-1.7 4.9l-10 .5 5.4 11.1c.8 1.6.1 3.5-1.5 4.3l-2.1 1c-1.6.8-3.5.1-4.3-1.5l-5.3-11-6.4 7.6c-1.6 1.9-4.7.8-4.7-1.7L4 3.5Z" fill="white" stroke="#173f32" stroke-width="2.5" stroke-linejoin="round"/></svg></div><div id="brand"><span>SUPPOSEVETERINARY</span> &nbsp;·&nbsp; KATHMANDU, NEPAL</div></main><script>
const scenes=[
{start:0,end:4,img:${JSON.stringify(hero)},eyebrow:'KATHMANDU · NEPAL',title:'Shop + clinic.\\nUnder one roof.',sub:'SupposeVeterinary brings pet supplies and veterinary care together.',kind:'intro'},
{start:4,end:8,img:${JSON.stringify(shop)},eyebrow:'THE SHOP',title:'Browse pet\\nessentials.',sub:'Four listings. Stock and prices up front.',kind:'shop'},
{start:8,end:12,img:${JSON.stringify(order)},eyebrow:'ORDER ON WHATSAPP',title:'Add to order.\\nSend on WhatsApp.',sub:'No online payment needed.',kind:'order'},
{start:12,end:16,img:${JSON.stringify(hero)},eyebrow:'24/7 EMERGENCY LINE',title:'Pet emergency?\\nWe answer 24/7.',sub:'Call +977 9808486381',kind:'emergency'},
{start:16,end:20,img:${JSON.stringify(hero)},eyebrow:'CARING FOR YOUR PETS LIKE FAMILY',title:'SupposeVeterinary',sub:'Kathmandu, Nepal\\n+977 9808486381',kind:'close'}
];
const copy=document.querySelector('#copy'), title=document.querySelector('#title'), sub=document.querySelector('#subtitle'), eye=document.querySelector('#eyebrowText'), win=document.querySelector('#window'), screen=document.querySelector('#screen'), cursor=document.querySelector('#cursor'), rule=document.querySelector('#rule');
let current=-1;
window.renderAt=(t)=>{let ix=scenes.findIndex(s=>t>=s.start&&t<s.end);if(ix<0)ix=4;const s=scenes[ix],d=s.end-s.start,p=Math.max(0,Math.min(1,(t-s.start)/d));document.querySelector("#stage").dataset.kind=s.kind;if(current!==ix){current=ix;screen.src=s.img;eye.textContent=s.eyebrow;title.textContent=s.title;sub.textContent=s.sub;}
const ease=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x)};
let enter=ix===0?1:ease(p/.24),leave=ease((1-p)/.18),alpha=Math.min(enter,leave);copy.style.opacity=alpha;copy.style.transform='translate3d(0,'+(12*(1-enter))+'px,0)';win.style.opacity=alpha;win.style.transform='translate3d('+(8*(1-enter)+4*Math.sin(p*Math.PI))+'px,'+(8*(1-enter)+3*Math.sin(p*Math.PI*2))+'px,0) scale('+(0.992+.008*ease(p/.42))+')';rule.style.opacity=s.kind==='emergency'?'.92':'.7';rule.style.background=s.kind==='emergency'?'#ed8270':'#54bd8e';
if(s.kind==='shop'){const click=ease((p-.43)/.24);cursor.style.opacity=click*(1-ease((p-.89)/.08));cursor.style.left=(650+8+380*.75-4+150*(1-click))+'px';cursor.style.top=(180+33+7+560*.75+18*(1-click))+'px';cursor.style.transform='scale('+(1-.12*ease((p-.72)/.08)+.12*ease((p-.8)/.1))+')'}else{cursor.style.opacity=0}
};
window.renderAt(0);
</script></body></html>`;
fs.writeFileSync(path.join(WORK,'video-stage.html'),html,'utf8');
(async()=>{
 const browser=await chromium.launch({headless:true});const page=await browser.newPage({viewport:{width:1920,height:1080},deviceScaleFactor:1});
 await page.goto('file:///'+path.join(WORK,'video-stage.html').replace(/\\/g,'/'),{waitUntil:'load'});await page.evaluate(()=>document.fonts.ready);await page.waitForFunction(()=>[...document.images].every(i=>i.complete&&i.naturalWidth>0));
 const qaTimes=[0.8,4.8,8.8,12.8,16.8,3.9,7.9,11.9,15.9];for(let i=0;i<qaTimes.length;i++){await page.evaluate(t=>window.renderAt(t),qaTimes[i]);await page.screenshot({path:path.join(WORK,`qa-${String(i+1).padStart(2,'0')}.png`)})}
 await page.evaluate(()=>window.renderAt(.8));await page.screenshot({path:path.join(OUT,'brag.jpg'),type:'jpeg',quality:96});
 const ffmpeg='C:/Users/hp/AppData/Local/Programs/Python/Python314/Lib/site-packages/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe';
 const video=path.join(WORK,'video-silent.mp4');const proc=spawn(ffmpeg,['-y','-hide_banner','-loglevel','error','-f','image2pipe','-vcodec','mjpeg','-framerate','30','-i','-','-frames:v','600','-c:v','libx264','-preset','medium','-crf','18','-pix_fmt','yuv420p','-an','-movflags','+faststart',video],{stdio:['pipe','ignore','inherit']});
 const poster=fs.readFileSync(path.join(OUT,'brag.jpg'));proc.stdin.write(poster);
 for(let i=1;i<600;i++){await page.evaluate(t=>window.renderAt(t),i/30);const jpg=await page.screenshot({type:'jpeg',quality:93});if(!proc.stdin.write(jpg))await new Promise(resolve=>proc.stdin.once('drain',resolve));if(i%120===0)console.log(`Rendered ${i}/599 frames`)}
 proc.stdin.end();await new Promise((resolve,reject)=>proc.once('close',c=>c===0?resolve():reject(new Error(`ffmpeg video exit ${c}`))));await browser.close();console.log(video);
})().catch(e=>{console.error(e);process.exitCode=1});


