export type Rect={x:number;y:number;w:number;h:number};
export type Pet=Rect&{vx:number;vy:number;ground:boolean;face:number};
export type Mode='solo'|'duo';
export type Input={left:boolean;right:boolean;jump:boolean};
export const W=1200,H=675,FLOOR=591;
export const levels=[
 {name:'The first heist',hint:'Climb the shelves. Grab the snack, then bring both friends home.',platforms:[{x:300,y:490,w:165,h:22},{x:540,y:403,w:165,h:22},{x:785,y:316,w:240,h:22}],snack:{x:905,y:291}},
 {name:'A little lift',hint:'Grey pushes the crate. White reaches the gold button to open the gate.',platforms:[{x:360,y:357,w:155,h:22},{x:710,y:488,w:145,h:22},{x:940,y:390,w:190,h:22}],snack:{x:1030,y:366}},
 {name:'The tight squeeze',hint:'Bring the snack through the purple passage. Rotate it, or nibble it shorter.',platforms:[{x:640,y:493,w:155,h:22},{x:845,y:401,w:140,h:22},{x:1000,y:312,w:175,h:22}],snack:{x:1080,y:287}}
];
export class Game{
 level:number;mode:Mode;active=0;pets:Pet[];snack:{x:number;y:number;length:number;owner:number;vertical:boolean;vy:number};crate:Rect;gate=false;won=false;paused=false;started=false;time=0;message='';messageTime=0;events:string[]=[];together=false;
 constructor(level=0,mode:Mode='solo'){this.level=level;this.mode=mode;this.pets=[110,195].map(x=>({x,y:FLOOR-62,w:48,h:62,vx:0,vy:0,ground:true,face:1}));this.snack={...levels[level].snack,length:178,owner:-1,vertical:false,vy:0};this.crate={x:275,y:FLOOR-65,w:90,h:65};}
 say(s:string){this.message=s;this.messageTime=4;}
 action(a:string,who=this.active){if(!this.started||this.paused||this.won)return;const p=this.pets[who];if(a==='switch'){this.active=1-this.active;this.events.push('switch');return}
 if(a==='tower'){const [white,grey]=this.pets;if(Math.abs(white.x-grey.x)<110&&Math.abs(white.y-grey.y)<85&&grey.ground){white.x=grey.x;white.y=grey.y-white.h;white.vy=-930;white.ground=false;this.active=0;this.events.push('jump');this.say('Teamwork! Guide White onto the high shelf.')}else this.say('Bring both friends together on a ledge to make a tower.');}
 if(a==='grab'){if(this.snack.owner===who){this.snack.owner=-1;this.snack.vy=-80;this.together=false;this.say('Snack set down.')}else if(Math.hypot(p.x+24-this.snack.x,p.y+28-this.snack.y)<115){this.snack.owner=who;this.events.push('grab');this.say('Got it! Bring the snack and both friends to the HOME marker.')}else this.say('Move closer to the snack, then grab it.');}
 if(a==='rotate'&&this.snack.owner>=0){this.snack.vertical=!this.snack.vertical;this.events.push('switch');}
 if(a==='nibble'&&this.snack.owner>=0){this.snack.length=Math.max(64,this.snack.length-19);this.events.push('nibble');this.say(this.snack.length<=64?'Save a little for home!':'A little shorter. A little tastier.');}
 if(a==='team'){if(this.snack.owner>=0&&Math.abs(this.pets[0].x-this.pets[1].x)<135&&Math.abs(this.pets[0].y-this.pets[1].y)<90){this.together=!this.together;this.say(this.together?'Travelling together. In solo mode, your friend follows.':'Moving separately.')}else this.say('With the snack held, bring both friends close to team up.');}
 }
 step(dt:number,inputs:Input[]){if(!this.started||this.paused||this.won)return;dt=Math.min(dt,1/30);this.time+=dt;this.messageTime=Math.max(0,this.messageTime-dt);const plats=[{x:0,y:FLOOR,w:W,h:H-FLOOR},...levels[this.level].platforms];
 this.pets.forEach((p,i)=>{let input=inputs[i]||{left:false,right:false,jump:false};if(this.mode==='solo'&&i!==this.active){input={left:false,right:false,jump:false};if(this.together&&this.snack.owner>=0){const lead=this.pets[this.active],diff=lead.x-p.x;input={left:diff < -76,right:diff > 76,jump:(lead.y<p.y-32||Math.abs(diff)>125)&&p.ground};}}
 const direction=Number(input.right)-Number(input.left);p.vx=direction*(this.snack.owner===i?218:260);if(direction)p.face=direction;if(input.jump&&p.ground){p.vy=i===0?-795:-660;p.ground=false;this.events.push('jump');}
 const oldX=p.x,oldBottom=p.y+p.h;p.x=Math.max(22,Math.min(W-p.w-22,p.x+p.vx*dt));
 if(this.level===1){const c=this.crate;if(p.y+p.h>c.y+5&&p.y<c.y+c.h&&p.x+p.w>c.x&&p.x<c.x+c.w){if(i===1){const shift=p.vx*dt;c.x=Math.max(225,Math.min(535-c.w,c.x+shift));}p.x=oldX<c.x?c.x-p.w:c.x+c.w;}
 if(!this.gate&&p.x+p.w>610&&p.x<630){p.x=oldX<610?610-p.w:630;}}
 if(this.level===2&&this.snack.owner===i&&!this.snack.vertical&&this.snack.length>100&&((oldX<535&&p.x+p.w>=535)||(oldX>535&&p.x<=555))){p.x=oldX;this.say('Too wide! Rotate the snack (R), or nibble it (N).');}
 p.vy+=1800*dt;p.y+=p.vy*dt;p.ground=false;for(const s of this.level===1?[...plats,this.crate]:plats){if(p.vy>=0&&oldBottom<=s.y+4&&p.y+p.h>=s.y&&p.x+p.w>s.x&&p.x<s.x+s.w){p.y=s.y-p.h;p.vy=0;p.ground=true;}}
 if(p.y>H){p.x=100+i*90;p.y=FLOOR-p.h;p.vy=0;}
 });
 if(this.level===1&&!this.gate){const white=this.pets[0];if(white.x+white.w>430&&white.x<487&&Math.abs(white.y+white.h-357)<8){this.gate=true;this.events.push('gate');this.say('Gate open! Find the snack on the far shelf.');}}
 const snack=this.snack;if(snack.owner>=0){const p=this.pets[snack.owner];snack.x=p.x+24;snack.y=p.y+23;snack.vy=0;}else{const last=snack.y;snack.vy+=1800*dt;snack.y+=snack.vy*dt;for(const pl of plats){if(last<=pl.y-10&&snack.y>=pl.y-10&&snack.x>pl.x&&snack.x<pl.x+pl.w){snack.y=pl.y-10;snack.vy=0;}}}
 if(this.pets.every(p=>p.x<215&&p.y+p.h>FLOOR-10)&&snack.x<250&&snack.y>FLOOR-145){this.won=true;this.events.push('win');}
 }
}
