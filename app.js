
const cfg={easy:[9,9,10],medium:[16,16,40],hard:[16,30,99]};
let board=[],rows,cols,mines,first=true,t=0,intv=null;
const elBoard=document.getElementById('board');
const minesLeft=document.getElementById('minesLeft');
const timer=document.getElementById('timer');

function start(){
const d=document.getElementById('difficulty').value;
[rows,cols,mines]=cfg[d];
board=[]; first=true; t=0; clearInterval(intv);
timer.textContent=0; minesLeft.textContent=mines;
elBoard.style.gridTemplateColumns=`repeat(${cols},28px)`;
for(let r=0;r<rows;r++){board[r]=[];for(let c=0;c<cols;c++)board[r][c]={m:false,r:false,f:false,n:0};}
render();
}
function placeMines(sr,sc){
let p=0;
while(p<mines){
let r=Math.floor(Math.random()*rows),c=Math.floor(Math.random()*cols);
if((r===sr&&c===sc)||board[r][c].m) continue;
board[r][c].m=true;p++;
}
for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){
let n=0;
for(let dr=-1;dr<=1;dr++)for(let dc=-1;dc<=1;dc++){
let rr=r+dr,cc=c+dc;
if(rr>=0&&rr<rows&&cc>=0&&cc<cols&&board[rr][cc].m)n++;
}
board[r][c].n=n;
}
}
function reveal(r,c){
let cell=board[r][c];
if(cell.r||cell.f)return;
if(first){placeMines(r,c); first=false; intv=setInterval(()=>timer.textContent=++t,1000);}
cell.r=true;
if(cell.m){alert('Perdiste'); navigator.vibrate?.(300); revealAll(); return;}
if(cell.n===0){
for(let dr=-1;dr<=1;dr++)for(let dc=-1;dc<=1;dc++){
let rr=r+dr,cc=c+dc;
if(rr>=0&&rr<rows&&cc>=0&&cc<cols) reveal(rr,cc);
}
}
render();
checkWin();
}
function revealAll(){for(let r of board)for(let c of r)c.r=true; render();}
function checkWin(){
let hidden=0;
for(let r of board)for(let c of r)if(!c.r)hidden++;
if(hidden===mines){alert('¡Ganaste!'); clearInterval(intv);}
}
function toggleFlag(r,c){if(board[r][c].r)return; board[r][c].f=!board[r][c].f; render();}
function render(){
elBoard.innerHTML='';
for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){
const d=document.createElement('div');
const cell=board[r][c];
d.className='cell'+(cell.r?' revealed':'')+(cell.f?' flag':'');
if(cell.r)d.textContent=cell.m?'💣':(cell.n||'');
else if(cell.f)d.textContent='🚩';
let press;
d.addEventListener('touchstart',()=>press=setTimeout(()=>toggleFlag(r,c),500));
d.addEventListener('touchend',()=>clearTimeout(press));
d.addEventListener('click',()=>reveal(r,c));
elBoard.appendChild(d);
}
}
document.getElementById('newGame').onclick=start;
if('serviceWorker' in navigator) navigator.serviceWorker.register('service-worker.js');
start();
