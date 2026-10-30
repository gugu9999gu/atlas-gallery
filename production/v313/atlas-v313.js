/* ATLAS v3.13 — 24 existing cards / 23 original, editable CSS visual studies.
 * These are illustrative interpretations, not exhaustive definitions of historical styles.
 * Self-contained, no external requests, tracking, fonts or third-party artwork.
 */
(function initAtlasStyleLab(global) {
'use strict';
const ITEMS=[
 ['dar-f1f166433dc9','st-blur','Blur Effect','블러 효과'],
 ['dar-2d34f4c380fd','st-backdrop','Backdrop Blur','배경 블러'],
 ['dar-40060ccb344d','st-glass','Glassmorphism','글래스모피즘'],
 ['dar-2e8318e2a883','st-soft','Neumorphism','뉴모피즘'],
 ['dar-bc1cc2175ada','st-soft','Neumorphism','뉴모피즘'],
 ['dar-1a5a5608f55b','st-minimal','Minimalism','미니멀리즘'],
 ['dar-d502c3b56db6','st-maximal','Maximalism','맥시멀리즘'],
 ['dar-1b5c8b3b178a','st-swiss','Swiss / International Style','스위스·국제 타이포그래피 스타일'],
 ['dar-0c6af8473a85','st-bauhaus','Bauhaus-inspired Design','바우하우스 계열 디자인'],
 ['dar-098c64ab7d2b','st-brutal','Brutalist Web Design','브루탈리스트 웹디자인'],
 ['dar-43fd8047c55b','st-neo','Neo-brutalism','네오브루탈리즘'],
 ['dar-d6f2375db099','st-flat','Flat Design','플랫 디자인'],
 ['dar-883cb89f7cd3','st-skeuo','Skeuomorphism','스큐어모피즘'],
 ['dar-daa488b0e624','st-bento','Bento Layout','벤토 레이아웃'],
 ['dar-c69e33170658','st-editorial','Editorial Design','에디토리얼 디자인'],
 ['dar-9571d74b074a','st-y2k','Y2K Aesthetic','Y2K 미학'],
 ['dar-c219f9245cbf','st-retro','Retro-futurism','레트로퓨처리즘'],
 ['dar-2b54780d3fca','st-cyber','Cyberpunk Aesthetic','사이버펑크 미학'],
 ['dar-a81b28b53ff7','st-deco','Art Deco','아르데코'],
 ['dar-e9c59f688df3','st-memphis','Memphis Style','멤피스 스타일'],
 ['dar-b0d87ce69dac','st-organic','Organic Design','유기적 디자인'],
 ['dar-e39aa25af783','st-pixel','Pixel Art','픽셀 아트'],
 ['dar-5ee3fff7162b','st-paper','Paper-cut Style','페이퍼컷 스타일'],
 ['dar-37976245ec19','st-crt','CRT Aesthetic','CRT 미학']
];
// label KO, label EN, minimum, maximum, initial value, step, unit
const CONFIG={
 'st-blur':['흐림','Blur',0,14,4,1,'px'],
 'st-backdrop':['배경 흐림','Backdrop',0,20,8,1,'px'],
 'st-glass':['불투명도','Opacity',10,85,25,5,'%'],
 'st-soft':['그림자','Shadow',0,12,7,1,'px'],
 'st-minimal':['여백','Space',8,32,20,2,'px'],
 'st-maximal':['장식 수','Ornaments',1,7,5,1,''],
 'st-swiss':['열 수','Columns',2,5,3,1,''],
 'st-bauhaus':['회전','Rotation',0,180,30,15,'°'],
 'st-brutal':['테두리','Border',1,8,3,1,'px'],
 'st-neo':['오프셋','Offset',0,12,7,1,'px'],
 'st-flat':['색상각','Hue',0,360,210,15,'°'],
 'st-skeuo':['다이얼','Dial',0,270,135,15,'°'],
 'st-bento':['간격','Gap',4,18,8,2,'px'],
 'st-editorial':['제목','Headline',18,32,26,2,'px'],
 'st-y2k':['색상각','Hue',0,360,270,15,'°'],
 'st-retro':['태양 위치','Sun',18,55,30,1,'%'],
 'st-cyber':['광채','Glow',0,20,8,1,'px'],
 'st-deco':['선 간격','Spacing',5,18,10,1,'px'],
 'st-memphis':['각도','Angle',0,180,30,15,'°'],
 'st-organic':['곡률','Curve',20,70,45,5,'%'],
 'st-pixel':['격자 수','Grid',8,16,12,4,''],
 'st-paper':['층 간격','Layer gap',3,12,7,1,'px'],
 'st-crt':['주사선','Scanlines',0,60,25,5,'%']
};
const byId=new Map(ITEMS.map(x=>[x[0],x]));
const byKey=new Map(ITEMS.map(x=>[x[1],x]));
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const txt=(ko,a,b)=>ko?a:b;
const css=`
.st-stage{display:grid;grid-template-rows:minmax(0,1fr) auto auto;position:relative;width:100%;height:100%;min-height:0;isolation:isolate;overflow:hidden;background:#17263d;color:#edf5ff;font:14px/1.4 system-ui,sans-serif;--st-v:20;--st-px:20px;--st-hue:210;--st-accent:#7054d8}
.st-stage *,.st-stage *::before,.st-stage *::after{box-sizing:border-box}
.st-visual{position:relative;min-width:0;min-height:0;overflow:hidden;display:flex;align-items:center;justify-content:center;padding:12px;background:#e7eaf1;color:#172a43}
.st-visual>div{max-width:100%;max-height:100%}.st-stage p,.st-stage span,.st-stage b,.st-stage strong,.st-stage label,.st-stage output,.st-stage button,.st-stage small{font-size:14px;line-height:1.25}
.st-toolbar{display:flex;align-items:center;justify-content:center;gap:6px;min-width:0;flex-wrap:wrap;padding:6px;background:#1b3050;border-top:1px solid #53691}
.st-knob{flex:1 1 130px;display:flex;align-items:center;gap:6px;min-width:0;margin:0;color:#eef5ff}.st-knob>span{white-space:nowrap}.st-knob input{flex:1 1 55px;width:55px;min-width:30px;height:26px;margin:0;accent-color:#8be7d5}.st-knob output{min-width:34px;text-align:right;font-variant-numeric:tabular-nums}
.st-toolbar button,.st-visual button{border:1px solid #91afce;border-radius:7px;background:#345578;color:#fff;padding:6px 9px;min-height:32px;font:600 14px/1.2 system-ui;cursor:pointer}
.st-stage button:focus-visible,.st-stage input:focus-visible,.st-stage canvas:focus-visible{outline:3px solid #f2c75a;outline-offset:2px}.st-toolbar button:hover{background:#436e98}.st-status{margin:0;padding:5px 8px;min-height:28px;text-align:center;background:#13253d;color:#bdeade;white-space:normal;overflow-wrap:anywhere}
.st-caption{position:absolute;left:10px;bottom:8px;margin:0;font-size:14px;color:inherit}.st-big{font-weight:850!important;font-size:30px!important;line-height:1!important;letter-spacing:-1px}.st-sample{position:relative;width:248px;height:136px;max-height:100%;overflow:hidden;border-radius:12px}
.st-art{position:absolute;inset:0;background:repeating-linear-gradient(55deg,#8cc7c2 0 14px,#236581 14px 28px,#b5d0e2 28px 42px);transition:filter .25s}.st-art::after{content:'';position:absolute;width:75px;height:75px;border-radius:50%;background:#f0ae4c;left:35%;top:18%;box-shadow:64px 28px 0 #a4519c}
[data-style='st-blur'] .st-art{filter:blur(var(--st-px))}.st-overlay{position:absolute;inset:18px 25px;display:flex;flex-direction:column;gap:8px;justify-content:center;align-items:center;border:1px solid #ffffffa6;color:white;text-shadow:0 1px 2px #163747;background:#183d5755;backdrop-filter:blur(var(--st-px));-webkit-backdrop-filter:blur(var(--st-px));border-radius:12px}
[data-style='st-glass'] .st-visual{background:#182a58}[data-style='st-glass'] .st-art{background:linear-gradient(35deg,#30499a,#c659ab 50%,#ffbf6d)}[data-style='st-glass'] .st-overlay{inset:15px 30px;background:rgb(255 255 255 / var(--st-alpha));color:#172945;text-shadow:none;backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);box-shadow:0 8px 18px #151b3a40}.st-alternate[data-style='st-glass'] .st-art{background:linear-gradient(35deg,#164d66,#3bad9c,#e2ba64)}
@supports not ((backdrop-filter:blur(1px)) or (-webkit-backdrop-filter:blur(1px))){.st-overlay{background:#244867e8!important;color:white!important}}
.st-soft-base{width:228px;height:132px;display:flex;align-items:center;justify-content:center;background:#dfe5ee;border-radius:16px;gap:24px}.st-soft-base .st-soft-button{width:86px;height:86px;border:none;border-radius:22px;background:#dfe5ee;color:#354765;box-shadow:var(--st-px) var(--st-px) calc(var(--st-px)*2) #aeb8c7,calc(var(--st-px)*-1) calc(var(--st-px)*-1) calc(var(--st-px)*2) #fff;transition:box-shadow .2s}.st-soft-base .st-soft-button[aria-pressed='true']{box-shadow:inset var(--st-px) var(--st-px) calc(var(--st-px)*2) #aeb8c7,inset calc(var(--st-px)*-1) calc(var(--st-px)*-1) calc(var(--st-px)*2) #fff}.st-soft-mark{width:38px;height:38px;border:4px solid #687da0;border-radius:50%;display:block;margin:0 auto 8px}
.st-minimal{width:246px;height:140px;padding:var(--st-px);background:#faf9f5;display:flex;flex-direction:column;justify-content:center;gap:10px;border:1px solid #d7d8d9;transition:padding .25s}.st-minimal strong{font-size:25px}.st-minimal p{margin:0;color:#526075}.st-minimal i{width:30px;height:3px;background:#1b334f}.st-alternate .st-minimal p{visibility:hidden}
.st-maximal{width:250px;height:142px;background:repeating-linear-gradient(45deg,#533d9e 0 16px,#48318c 16px 32px);position:relative;overflow:hidden;border:5px solid #e9ae4d;color:#fff}.st-maximal .st-big{position:absolute;inset:0;display:grid;place-items:center;font:900 30px Georgia!important;text-shadow:2px 3px #943b65;z-index:2}.st-ornament{position:absolute;width:38px;height:38px;border:6px solid #f4b9bd;border-radius:50%;left:calc(9% + var(--i)*12%);top:calc(10% + var(--j)*22%);transform:rotate(calc(var(--i)*25deg));background:#eaaa49}.st-ornament:nth-child(2n){border-radius:0;background:#7fbfae}.st-alternate .st-maximal{background:#234d49;border-color:#e799ab}
.st-swiss{position:relative;width:254px;height:142px;background:#f5eee1;color:#181e29;padding:12px;display:grid;grid-template-columns:repeat(var(--st-cols),minmax(0,1fr));gap:8px;overflow:hidden}.st-swiss::after{content:'';position:absolute;inset:0;pointer-events:none;background:repeating-linear-gradient(90deg,transparent 0 calc(100% / var(--st-cols) - 1px),#b6525240 calc(100% / var(--st-cols) - 1px) calc(100% / var(--st-cols)))}.st-swiss .st-big{grid-column:1/-1;text-align:left;font-size:29px!important}.st-swiss .st-red{background:#d84c3e;min-height:40px}.st-swiss span{border-top:2px solid #1e2430;padding-top:5px;overflow-wrap:anywhere}.st-alternate .st-swiss::after{display:none}
.st-geometry{width:245px;height:143px;background:#e8ddbf;position:relative;overflow:hidden}.st-geo-orbit{position:absolute;width:115px;height:115px;left:calc(50% - 57px);top:calc(50% - 57px);transform:rotate(var(--st-deg)) scale(.7);transition:transform .3s}.st-geo-orbit i{position:absolute;display:block;width:68px;height:68px;background:#c84534;left:-21px;top:-2px;border-radius:50%}.st-geo-orbit i:nth-child(2){background:#284e89;border-radius:0;left:67px;top:37px;width:55px;height:55px}.st-geo-orbit i:nth-child(3){border-radius:0;background:#e2ac31;clip-path:polygon(50% 0,100% 100%,0 100%);left:3px;top:66px}.st-geometry::after{content:'';position:absolute;left:14px;top:12px;width:5px;height:113px;background:#272a32}.st-alternate .st-geometry{background:#f4ede2}
.st-brutal{width:246px;padding:12px;background:#fff;border:var(--st-px) solid #121212;color:#111;display:flex;flex-direction:column;gap:8px;font-family:monospace}.st-brutal strong{font:800 24px/1 monospace!important;word-break:break-word}.st-brutal button{border:2px solid #111!important;border-radius:0!important;background:#f2ef53!important;color:#111!important;box-shadow:none!important}.st-alternate .st-brutal{background:#ffeb60}
.st-neo{width:220px;padding:16px;background:#d7b8ff;border:3px solid #1b1830;border-radius:10px;box-shadow:var(--st-px) var(--st-px) 0 #262037;display:flex;align-items:center;gap:16px;transition:box-shadow .2s,transform .2s}.st-neo strong{font-size:24px}.st-neo button{flex:none;white-space:nowrap;border:2px solid #211b30!important;background:#fff36d!important;color:#211b30!important;box-shadow:3px 3px 0 #211b30}.st-alternate .st-neo{transform:translate(3px,3px);box-shadow:2px 2px 0 #262037}
.st-flat{width:235px;display:flex;gap:14px;align-items:center;padding:18px;background:hsl(var(--st-hue) 68% 40%);color:white;border:0;border-radius:0;box-shadow:none}.st-flat-icon{width:62px;height:62px;flex:none;background:#ffde86;position:relative;clip-path:polygon(50% 0,100% 40%,85% 40%,85% 100%,15% 100%,15% 40%,0 40%)}.st-flat strong{display:block;font-size:23px;margin-bottom:8px}.st-alternate .st-flat-icon{clip-path:polygon(50% 0,63% 35%,100% 38%,73% 62%,81% 100%,50% 80%,19% 100%,27% 62%,0 38%,37% 35%)}
.st-device{width:234px;height:138px;border:4px solid #696b6d;border-radius:18px;background:repeating-linear-gradient(0deg,#bdc2c6 0 1px,#d7dadd 1px 3px);box-shadow:inset 0 3px 4px #fff,0 5px 9px #29323c42;display:flex;align-items:center;justify-content:center;gap:22px}.st-dial{position:relative;width:76px;height:76px;border:5px solid #64686c;border-radius:50%;background:linear-gradient(145deg,#fafafa,#b2b7bd);box-shadow:3px 4px 6px #5558;transform:rotate(var(--st-deg));transition:transform .2s}.st-dial::after{content:'';position:absolute;top:4px;left:calc(50% - 2px);width:4px;height:18px;background:#3d5059;border-radius:2px}.st-device button{background:linear-gradient(#eef4ee,#8c9f93)!important;border:2px solid #62786a!important;color:#20382b!important;box-shadow:0 4px 0 #54695a;min-width:66px}.st-alternate .st-device button{box-shadow:inset 0 2px 5px #203c3970;transform:translateY(3px);background:#a9cfaa!important}
.st-bento{display:grid;width:260px;height:144px;grid-template-columns:1.4fr 1fr 1fr;grid-template-rows:1fr 1fr;gap:var(--st-px)}.st-bento>span{display:grid;place-items:center;min-width:0;border-radius:12px;background:#a9c4de;color:#193c5c;font-weight:800}.st-bento>span:first-child{grid-row:1/3;background:#224e68;color:white;font-size:28px}.st-bento>span:last-child{grid-column:2/4;background:#e0c3a0}.st-alternate .st-bento>span:first-child{grid-row:auto;grid-column:1/3}.st-alternate .st-bento>span:last-child{grid-column:1/4}
.st-editorial{width:260px;height:146px;background:#fffaf0;color:#253947;padding:10px 12px;display:grid;grid-template-columns:1.4fr 1fr;gap:8px}.st-editorial h3{margin:0;font:700 var(--st-px)/.95 Georgia,serif;grid-column:1/3;max-width:100%}.st-editorial p{margin:0;font:14px/1.2 Georgia,serif}.st-editorial-art{min-height:48px;background:linear-gradient(140deg,#a3b3a0 50%,#476a65 50%)}.st-alternate .st-editorial{grid-template-columns:1fr 1.4fr}.st-alternate .st-editorial h3{text-align:right;font-style:italic}
.st-y2k{width:250px;height:144px;position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:16px;background:radial-gradient(ellipse at 20% 30%,#fff8,transparent 40%),linear-gradient(140deg,hsl(var(--st-hue) 75% 83%),#eeeaff);border:2px solid #fff;border-radius:34px}.st-chrome{font:900 38px/.9 system-ui!important;font-style:italic!important;letter-spacing:-2px;color:#4c5776;background:linear-gradient(#fcfdff 5%,#68749b 42%,#fbffff 50%,#7a85a0 75%,#f4faff);background-clip:text;-webkit-background-clip:text;-webkit-text-fill-color:transparent;filter:drop-shadow(1px 2px 0 #fff)}.st-y2k span:last-child{border:1px solid #fff9;border-radius:30px;padding:5px 16px;background:#ffffff7a;color:#364364}.st-alternate .st-y2k{border-radius:10px 50px 10px 50px}
.st-retro{width:260px;height:144px;position:relative;overflow:hidden;background:linear-gradient(#272851,#80527c 66%,#313762);color:#ffdfa7}.st-sun{position:absolute;left:calc(50% - 36px);top:var(--st-percent);width:72px;height:72px;border-radius:50%;background:repeating-linear-gradient(0deg,#ffd18f 0 8px,#ca8867 8px 11px);transform:translateY(-50%)}.st-retro-grid{position:absolute;inset:65% -10% -10%;background:repeating-linear-gradient(0deg,transparent 0 12px,#f4b1a377 12px 13px),repeating-linear-gradient(90deg,transparent 0 24px,#f4b1a377 24px 25px);clip-path:polygon(23% 0,77% 0,100% 100%,0 100%);border-top:1px solid #f9cc9b}.st-retro .st-big{position:absolute;left:12px;bottom:10px;top:auto;font-size:16px!important;padding:5px 8px;background:#151b36e6;border:1px solid #a7809b}.st-alternate .st-retro{background:linear-gradient(#153f48,#478b89 66%,#183942)}
.st-cyber{position:relative;width:252px;height:144px;background:#101b2d;border:1px solid #4ed7d1;color:#7cf8ec;overflow:hidden;display:flex;flex-direction:column;justify-content:center;gap:9px;padding:17px}.st-cyber::before{content:'';position:absolute;right:0;top:0;width:38px;height:100%;background:repeating-linear-gradient(135deg,#e1c56b 0 8px,transparent 8px 16px);opacity:.65}.st-cyber .st-big{text-shadow:0 0 var(--st-px) #4fffe0;font-size:25px!important;max-width:80%}.st-cyber-code{border-top:1px solid #4ce2d477;padding-top:7px;margin-right:36px;white-space:nowrap}.st-alternate .st-cyber{color:#ffa5de;border-color:#ec73c0}.st-alternate .st-cyber .st-big{text-shadow:0 0 var(--st-px) #ff6fbd}
.st-deco{width:248px;height:145px;position:relative;background:#173b3c;color:#efce8f;border:2px solid #c4a569;overflow:hidden;display:grid;place-items:center}.st-deco::before,.st-deco::after{content:'';position:absolute;inset:var(--st-px);border:1px solid #d9bb7b;clip-path:polygon(0 0,38% 0,50% 15%,62% 0,100% 0,100% 100%,62% 100%,50% 85%,38% 100%,0 100%)}.st-deco::after{inset:calc(var(--st-px)*2);opacity:.7}.st-deco strong{font:700 22px/1.3 Georgia!important;letter-spacing:5px;text-align:center;z-index:1}.st-alternate .st-deco{background:#2e273f}
.st-memphis{width:255px;height:145px;background:radial-gradient(#393154 1.5px,transparent 1.5px) 0 0/13px 13px,#f3dabc;position:relative;overflow:hidden}.st-memphis i{position:absolute;width:62px;height:62px;background:#df748b;left:17%;top:22%;border:5px solid #36325d;border-radius:50%;transform:rotate(var(--st-deg))}.st-memphis i:nth-child(2){left:52%;top:45%;background:#64b8b0;border-radius:0;clip-path:polygon(50% 0,100% 100%,0 100%)}.st-memphis i:nth-child(3){left:65%;top:12%;height:22px;width:54px;border-radius:0;background:repeating-linear-gradient(90deg,#343659 0 6px,transparent 6px 12px);border:0}.st-alternate .st-memphis{background-color:#b7e1e0}
.st-organic{width:252px;height:144px;position:relative;background:#e3ebd9;overflow:hidden;display:flex;align-items:center;justify-content:center}.st-blob{position:absolute;width:145px;height:115px;background:#83aa8d;left:30%;top:10%;border-radius:var(--st-percent) calc(100% - var(--st-percent)) 48% 52% / 42% 65% 35% 58%;transition:border-radius .35s}.st-blob:nth-child(2){width:95px;height:85px;left:12%;top:35%;background:#bdceab;transform:rotate(50deg)}.st-organic strong{position:relative;z-index:1;color:#183f33;font:700 22px Georgia!important}.st-alternate .st-organic .st-blob{background:#88a8be}.st-alternate .st-organic .st-blob:nth-child(2){background:#bfd1df}
.st-pixel-wrap{display:flex;align-items:center;gap:16px;max-width:100%}.st-pixel-wrap canvas{width:132px;height:132px;max-height:100%;image-rendering:pixelated;image-rendering:crisp-edges;touch-action:manipulation;border:4px solid #4b546d;background:#e2eafa;cursor:crosshair}.st-pixel-wrap p{max-width:92px;margin:0;color:#30435d}
.st-paper{width:252px;height:144px;position:relative;background:#efd9ad;overflow:hidden;box-shadow:inset 0 2px 6px #785b3933}.st-paper i{position:absolute;inset:calc(var(--i)*var(--st-px));border-radius:46% 50% 42% 55%;background:var(--paper);box-shadow:0 3px 6px #273e4955;transition:inset .25s,transform .25s}.st-paper strong{position:absolute;inset:0;display:grid;place-items:center;color:#f4f3de;font:700 19px Georgia!important;text-shadow:0 1px 3px #103b4e}.st-alternate .st-paper i{transform:translateX(calc(var(--i)*2px))}
.st-crt{position:relative;width:246px;height:143px;border:10px solid #4a505a;border-radius:22px;background:#142c28;color:#a1e4b3;overflow:hidden;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:8px;box-shadow:inset 0 0 18px #020909}.st-crt::after{content:'';position:absolute;inset:0;pointer-events:none;background:repeating-linear-gradient(0deg,#00170b 0 2px,transparent 2px 5px);opacity:var(--st-alpha)}.st-crt strong{font:700 25px/1 monospace!important;text-shadow:0 0 6px #9be9b077}.st-crt span{font-family:monospace}.st-alternate .st-crt{background:#302517;color:#efd094}
.st-visual .st-replay{animation:st-intro .55s ease-out both}@keyframes st-intro{from{opacity:.4;translate:0 10px}to{opacity:1;translate:0 0}}
@media(max-width:390px){.st-toolbar{gap:5px;padding:5px}.st-toolbar button{padding:6px}.st-knob{gap:4px}.st-knob input{width:62px}.st-visual{padding:9px}.st-pixel-wrap{gap:9px}.st-pixel-wrap p{max-width:80px}}
@media(prefers-reduced-motion:reduce){.st-stage *,.st-stage *::before,.st-stage *::after{animation:none!important;transition:none!important}}
html.motion-paused .st-stage *,html[data-motion='off'] .st-stage *,body.motion-paused .st-stage *{animation:none!important;transition:none!important}
@media(forced-colors:active){.st-toolbar button,.st-knob input{forced-color-adjust:auto}.st-status{border-top:1px solid CanvasText}}
`;
function installStyle(){if(!document.getElementById('atlas-style-lab-v313')){const style=document.createElement('style');style.id='atlas-style-lab-v313';style.textContent=css;document.head.append(style);}}
function bodyFor(key,ko){const t=(a,b)=>txt(ko,a,b);
 switch(key){
 case 'st-blur':return '<div class="st-sample"><div class="st-art"></div></div>';
 case 'st-backdrop':case 'st-glass':return '<div class="st-sample"><div class="st-art"></div><div class="st-overlay"><strong>'+t('또렷한 앞면','Sharp foreground')+'</strong><span>'+t('뒤쪽만 흐리게','Only the backdrop blurs')+'</span></div></div>';
 case 'st-soft':return '<div class="st-soft-base"><button type="button" class="st-soft-button" data-st="variant" aria-pressed="false"><i class="st-soft-mark" aria-hidden="true"></i>'+t('누르기','Press')+'</button></div>';
 case 'st-minimal':return '<div class="st-minimal"><i></i><strong>Less, but better.</strong><p>'+t('여백으로 만드는 위계','Hierarchy through space')+'</p></div>';
 case 'st-maximal':return '<div class="st-maximal">'+Array.from({length:7},(_,i)=>'<i class="st-ornament" style="--i:'+i+';--j:'+(i%3)+'" aria-hidden="true"></i>').join('')+'<strong class="st-big">MORE / MORE</strong></div>';
 case 'st-swiss':return '<div class="st-swiss"><strong class="st-big">Form follows grid.</strong><i class="st-red" aria-hidden="true"></i><span style="grid-column:2/-1">Type / 01<br>'+t('질서와 정렬','Order & alignment')+'</span></div>';
 case 'st-bauhaus':return '<div class="st-geometry"><div class="st-geo-orbit" aria-hidden="true"><i></i><i></i><i></i></div></div>';
 case 'st-brutal':return '<div class="st-brutal"><strong>RAW. DIRECT.</strong><button type="button" data-st="variant">'+t('꾸밈없는 버튼 →','Unstyled action →')+'</button></div>';
 case 'st-neo':return '<div class="st-neo"><strong>BOLD<br>BY DESIGN</strong><button type="button" data-st="variant">'+t('누르기','Press')+'</button></div>';
 case 'st-flat':return '<div class="st-flat"><i class="st-flat-icon" aria-hidden="true"></i><div><strong>Simple shapes.</strong><span>'+t('그림자 없이','No shadows')+'</span></div></div>';
 case 'st-skeuo':return '<div class="st-device"><div class="st-dial" aria-hidden="true"></div><button type="button" data-st="variant" aria-pressed="false">POWER</button></div>';
 case 'st-bento':return '<div class="st-bento"><span>01</span><span>02</span><span>03</span><span>04 / WIDE</span></div>';
 case 'st-editorial':return '<div class="st-editorial"><h3>The shape<br>of a story.</h3><p>'+t('제목과 본문, 이미지가 읽는 순서를 만듭니다.','Headline, text and image create a reading sequence.')+'</p><div class="st-editorial-art" aria-hidden="true"></div></div>';
 case 'st-y2k':return '<div class="st-y2k"><strong class="st-chrome">FUTURE</strong><span>CHROME / 2000</span></div>';
 case 'st-retro':return '<div class="st-retro"><i class="st-sun" aria-hidden="true"></i><i class="st-retro-grid" aria-hidden="true"></i><strong class="st-big">TOMORROW / 1984</strong></div>';
 case 'st-cyber':return '<div class="st-cyber"><strong class="st-big">NEON / CITY</strong><span class="st-cyber-code">SYS_01 · ONLINE</span></div>';
 case 'st-deco':return '<div class="st-deco"><strong>ATLAS<br>1925</strong></div>';
 case 'st-memphis':return '<div class="st-memphis" aria-label="'+t('점·원·삼각형의 비대칭 구성','Asymmetrical dots, circle and triangle')+'"><i></i><i></i><i></i></div>';
 case 'st-organic':return '<div class="st-organic"><i class="st-blob" aria-hidden="true"></i><i class="st-blob" aria-hidden="true"></i><strong>Grow naturally.</strong></div>';
 case 'st-pixel':return '<div class="st-pixel-wrap"><canvas width="12" height="12" tabindex="0" role="img" aria-label="'+t('픽셀 그림. 클릭하거나 Enter 키로 픽셀 변경','Pixel drawing. Click or press Enter to change a pixel')+'"></canvas><p>'+t('클릭으로 픽셀 편집 · Enter 지원','Click to edit a pixel · Enter supported')+'</p></div>';
 case 'st-paper':return '<div class="st-paper">'+['#e8bc80','#ba9a73','#73988d','#467f83','#2d6574'].map((c,i)=>'<i style="--i:'+(i+1)+';--paper:'+c+'" aria-hidden="true"></i>').join('')+'<strong>Layer by layer.</strong></div>';
 case 'st-crt':return '<div class="st-crt"><strong>READY_</strong><span>ATLAS TERMINAL</span></div>';
 default:throw Error('Unknown style '+key);
 }
}
function hint(key,ko){if(key==='st-blur')return txt(ko,'요소 자체에 filter: blur 적용','filter: blur affects the element itself');if(key==='st-backdrop')return txt(ko,'앞면 텍스트는 유지 · 뒤쪽만 흐림','Foreground stays sharp; backdrop blurs');if(key==='st-pixel')return txt(ko,'원본 픽셀을 최근접 확대해 표시','Nearest-neighbor scaling preserves pixels');if(key==='st-skeuo')return txt(ko,'물리 도구를 닮은 2D CSS 조작부','A 2D CSS control resembling a physical device');if(key==='st-crt')return txt(ko,'정적 주사선 시연 · 깜빡임 없음','Static scanline study; no flicker');return txt(ko,'직접 제작한 CSS 스타일 해석 예제','An original, editable CSS interpretation');}
function markup(key,lang='ko'){
 const item=byKey.get(key),c=CONFIG[key];if(!item||!c)throw Error('Unknown ATLAS style key: '+key);const ko=lang!=='en';
 return '<div class="st-stage" data-style="'+key+'" lang="'+(ko?'ko':'en')+'"><div class="st-visual" aria-label="'+esc(ko?item[3]:item[2])+'">'+bodyFor(key,ko)+'</div><div class="st-toolbar"><label class="st-knob"><span>'+esc(c[ko?0:1])+'</span><input data-st-range type="range" min="'+c[2]+'" max="'+c[3]+'" value="'+c[4]+'" step="'+c[5]+'"><output>'+c[4]+c[6]+'</output></label><button type="button" data-st="variant" aria-pressed="false">'+txt(ko,'변형','Swap')+'</button><button type="button" data-st="reset" aria-label="'+txt(ko,'초기화','Reset')+'" title="'+txt(ko,'초기화','Reset')+'">↺</button></div><p class="st-status" role="status" aria-live="polite">'+hint(key,ko)+'</p></div>';
}
function mount(root,key=root.dataset.style,lang=root.lang||'ko'){
 if(root.__stStudy)return root.__stStudy;const config=CONFIG[key];if(!config)throw Error('Unknown style '+key);const ko=lang!=='en',t=(a,b)=>txt(ko,a,b),ac=new AbortController();let alternate=false,changed=0,pixels=[],n=0,replay=null;
 const q=s=>root.querySelector(s),all=s=>[...root.querySelectorAll(s)],range=q('[data-st-range]'),visual=q('.st-visual'),out=q('output'),status=q('.st-status');
 function announce(text){status.textContent=text;root.dataset.changes=String(++changed);}
 function drawPixel(reset=false){const canvas=q('canvas');if(!canvas)return;const size=Number(range.value);if(reset||n!==size){n=size;pixels=Array.from({length:n*n},(_,i)=>{const x=i%n,y=Math.floor(i/n),a=Math.abs(x-(n-1)/2),b=Math.abs(y-(n-1)/2);return a+b<n*.48&&(x+y)%3!==0;});canvas.width=canvas.height=n;}
  const ctx=canvas.getContext('2d');if(!ctx){status.textContent=t('Canvas 2D를 지원하지 않는 브라우저입니다.','Canvas 2D is not supported.');return;}ctx.imageSmoothingEnabled=false;ctx.fillStyle=alternate?'#e3d5ef':'#e0ecf2';ctx.fillRect(0,0,n,n);pixels.forEach((v,i)=>{if(v){ctx.fillStyle=alternate?'#8a4f97':'#305e84';ctx.fillRect(i%n,Math.floor(i/n),1,1);}});root.dataset.pixelCount=String(pixels.filter(Boolean).length);}
 function apply(value,notify=false){const v=Math.max(config[2],Math.min(config[3],Number(value)));root.style.setProperty('--st-v',v);root.style.setProperty('--st-px',v+'px');root.style.setProperty('--st-deg',v+'deg');root.style.setProperty('--st-percent',v+'%');root.style.setProperty('--st-alpha',v/100);root.style.setProperty('--st-hue',v);root.style.setProperty('--st-cols',v);root.dataset.value=String(v);range.value=String(v);range.setAttribute('aria-valuetext',(ko?config[0]:config[1])+' '+v+config[6]);out.value=v+config[6];out.textContent=v+config[6];
  if(key==='st-maximal')all('.st-ornament').forEach((el,i)=>{el.hidden=i>=v;el.style.display=i>=v?'none':'';});if(key==='st-pixel')drawPixel();if(notify)announce((ko?config[0]:config[1])+' '+v+config[6]+' · '+hint(key,ko));
 }
 function intro(){const target=visual.firstElementChild;if(!target)return;target.classList.remove('st-replay');void target.offsetWidth;target.classList.add('st-replay');if(replay)clearTimeout(replay);replay=setTimeout(()=>{target.classList.remove('st-replay');replay=null;},650);}
 function variant(){alternate=!alternate;root.classList.toggle('st-alternate',alternate);root.dataset.variant=alternate?'1':'0';all('[data-st="variant"]').forEach(b=>b.setAttribute('aria-pressed',String(alternate)));if(key==='st-pixel')drawPixel();if(key==='st-blur'){apply(alternate?0:config[4]);}if(key==='st-backdrop'){apply(alternate?0:config[4]);}intro();announce(t('변형 ','Variant ')+(alternate?'2':'1')+' · '+hint(key,ko));}
 root.addEventListener('input',e=>{if(e.target===range)apply(range.value,true);},{signal:ac.signal});
 root.addEventListener('click',e=>{const b=e.target.closest('[data-st]');if(!b||!root.contains(b))return;if(b.dataset.st==='variant')variant();if(b.dataset.st==='reset'){alternate=false;root.classList.remove('st-alternate');root.dataset.variant='0';all('[data-st="variant"]').forEach(x=>x.setAttribute('aria-pressed','false'));apply(config[4]);if(key==='st-pixel')drawPixel(true);intro();announce(t('초기화 완료 · ','Reset · ')+hint(key,ko));}},{signal:ac.signal});
 const canvas=q('canvas');if(canvas){const edit=index=>{pixels[index]=!pixels[index];drawPixel();announce(t('픽셀 변경 · 채워진 칸 ','Pixel changed · filled cells ')+pixels.filter(Boolean).length);};canvas.addEventListener('click',e=>{const r=canvas.getBoundingClientRect(),border=4,w=r.width-border*2,h=r.height-border*2,x=Math.max(0,Math.min(n-1,Math.floor((e.clientX-r.left-border)/w*n))),y=Math.max(0,Math.min(n-1,Math.floor((e.clientY-r.top-border)/h*n)));edit(y*n+x);},{signal:ac.signal});canvas.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();edit(Math.floor(n/2)*n+Math.floor(n/2));}},{signal:ac.signal});}
 root.dataset.variant='0';apply(config[4]);if((key==='st-backdrop'||key==='st-glass')&&!CSS.supports('backdrop-filter','blur(1px)')&&!CSS.supports('-webkit-backdrop-filter','blur(1px)'))status.textContent=t('배경 필터 미지원: 불투명 패널로 대체','Backdrop filter unsupported: opaque fallback');
 const study={key,dispose(){ac.abort();if(replay)clearTimeout(replay);delete root.__stStudy;}};root.__stStudy=study;return study;
}
function code(entry,lang='ko'){
 const item=byId.get(entry?.id);if(!item)throw Error('Unknown style entry');const title=esc(lang==='en'?item[2]:item[3]);
 return '<!doctype html><html lang="'+(lang==='en'?'en':'ko')+'"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+title+' — ATLAS</title><style>body{margin:0;padding:20px;font:16px/1.6 system-ui;background:#eef1f7;color:#172c43}main{max-width:640px;margin:auto}h1{font-size:24px}.demo{height:330px;overflow:hidden;border-radius:14px}p{font-size:14px}</style></head><body><main><h1>'+title+'</h1><div class="demo" id="demo"></div><p>'+esc(hint(item[1],lang!=='en'))+'</p></main><script>(()=>{('+initAtlasStyleLab.toString()+')(window);const box=document.getElementById("demo");box.innerHTML=AtlasStyleLab.markup('+JSON.stringify(item[1])+','+JSON.stringify(lang)+');const study=AtlasStyleLab.mount(box.firstElementChild);window.addEventListener("pagehide",()=>study.dispose(),{once:true});})();</'+'script></body></html>';
}
function attach(){const A=global.Atlas32;if(!A||A.__styleLab313)return false;A.__styleLab313=true;const prev={recipe:A.recipe,art:A.art,markup:A.markup,mount:A.mount,code:A.code};
 A.recipe=e=>byId.get(e?.id)?.[1]||prev.recipe(e);A.markup=(key,lang)=>byKey.has(key)?markup(key,lang):prev.markup(key,lang);
 A.art=(entry,lang)=>{const item=byId.get(entry?.id);return item?{html:'<div class="scene scene-style-lab" data-preview-key="'+item[1]+'">'+markup(item[1],lang)+'</div>',key:item[1],mode:'native',previewType:'직접 조작하는 CSS 스타일 예제',specific:true}:prev.art(entry,lang);};
 A.mount=(scope=document)=>{prev.mount(scope);const roots=scope.matches?.('.st-stage')?[scope]:[...scope.querySelectorAll('.st-stage')];roots.forEach(root=>mount(root));};A.code=(entry,lang)=>byId.has(entry?.id)?code(entry,lang):prev.code(entry,lang);return true;}
installStyle();global.AtlasStyleLab={ITEMS,CONFIG,byId,byKey,markup,mount,code,css,attach,version:'3.13.0'};attach();
})(window);
