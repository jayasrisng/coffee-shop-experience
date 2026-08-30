import {brand} from './brand.mjs';
export function photoCup(type='latte',config=defaults,name=false){
 const photo=type==='latte';
 return `<div class="photo-cup ${photo?'single-photo':'menu-sprite sprite-'+type}" data-ice="${config.ice}">${photo?`<img class="cup-photograph" src="assets/${config.ice==='none'?'latte-noice-photo':'latte-photo'}.png" alt="">`:''}<img class="cup-decal" src="assets/coffee-shop-mark.svg" alt="">${name?'<span class="photo-name">Jayasri</span>':''}</div>`;
}
import {defaults,options} from './customization.mjs';
export function cup(id,{level='full',lid=true,type='latte',animate=false,name=false,config=defaults}={}){
 const espresso=level==='espresso';
 const dark=type==='matcha'?'#718945':type==='americano'?'#42271a':type==='mocha'?'#79503a':Number(config.shots)>2?'#ad8057':'#c69c70';
 const light=type==='matcha'?'#c8d797':type==='americano'?'#966344':config.milk==='oat'?'#ead6b3':'#f1ddbd';
 const iceCount=config.ice==='none'?0:config.ice==='light'?3:7;
 const cubes=[[65,100,-16],[109,94,12],[138,118,-20],[85,132,26],[122,152,-10],[59,164,9],[101,184,-21]].slice(0,iceCount);
 const body='M39 73Q110 84 181 73L163 251Q110 271 57 251Z';
 return `<svg viewBox="0 0 220 290" xmlns="http://www.w3.org/2000/svg" class="product-cup" data-ice="${config.ice}" data-milk="${config.milk}"><defs>
 <linearGradient id="coffee-${id}" x1="0" y1="0" x2=".8" y2="1"><stop stop-color="${espresso?'#b47a36':light}"/><stop offset=".22" stop-color="${espresso?'#673818':dark}"/><stop offset="1" stop-color="${espresso?'#30170d':light}"/></linearGradient>
 <linearGradient id="glass-${id}"><stop stop-color="#fff" stop-opacity=".75"/><stop offset=".09" stop-color="#fff" stop-opacity=".06"/><stop offset=".28" stop-color="#fff" stop-opacity=".3"/><stop offset=".48" stop-color="#fff" stop-opacity="0"/><stop offset=".88" stop-color="#685c4b" stop-opacity=".14"/><stop offset="1" stop-color="#fff" stop-opacity=".75"/></linearGradient>
 <linearGradient id="ice-${id}" x2="1" y2="1"><stop stop-color="#fff" stop-opacity=".88"/><stop offset=".45" stop-color="#e8f5f1" stop-opacity=".23"/><stop offset="1" stop-color="#fff" stop-opacity=".55"/></linearGradient>
 <linearGradient id="lid-${id}" x2="0" y2="1"><stop stop-color="#fff" stop-opacity=".95"/><stop offset=".45" stop-color="#e3e9e5" stop-opacity=".8"/><stop offset=".6" stop-color="#fff"/><stop offset="1" stop-color="#bdc8c2" stop-opacity=".7"/></linearGradient>
 <radialGradient id="shadow-${id}"><stop stop-color="#1b251a" stop-opacity=".28"/><stop offset="1" stop-color="#1b251a" stop-opacity="0"/></radialGradient>
 <clipPath id="clip-${id}"><path d="${body}"/></clipPath></defs>
 <ellipse cx="110" cy="270" rx="88" ry="15" fill="url(#shadow-${id})"/>
 <path d="${body}" fill="#ffffff30" stroke="#ffffffa0" stroke-width="1.2"/>
 <g clip-path="url(#clip-${id})"><g class="${animate?(espresso?'espresso-fill':level==='milk'?'milk-fill':''):''}"><rect x="36" y="${espresso?212:84}" width="150" height="180" fill="url(#coffee-${id})"/><ellipse cx="110" cy="${espresso?212:86}" rx="70" ry="9" fill="${espresso?'#c98d47':dark}"/></g>
 ${!espresso&&type==='latte'?`<g fill="none" stroke="${light}" opacity=".55" stroke-linecap="round" class="${animate&&level==='milk'?'cream-bloom':''}"><path d="M50 83C154 125 61 158 136 213S103 236 64 249" stroke-width="17"/><path d="M145 77C92 110 164 157 103 183S153 230 156 253" stroke-width="8"/></g>`:''}
 ${['full','ice','lid'].includes(level)?cubes.map(([x,y,r],i)=>`<g class="${animate&&level==='ice'?'cube-drop':''}" style="--cube-delay:${i*.35}s"><g transform="rotate(${r} ${x+13} ${y+13})"><rect x="${x}" y="${y}" width="27" height="29" rx="6" fill="url(#ice-${id})" stroke="#fff9" stroke-width="1"/><path d="M${x+3} ${y+24}V${y+5}H${x+22}" fill="none" stroke="#ffffffb0" stroke-width="2"/><path d="M${x+7} ${y+25}L${x+21} ${y+9}" stroke="#fff4" stroke-width="2"/></g></g>`).join(''):''}
 </g><path d="${body}" fill="url(#glass-${id})" stroke="#83978c66" stroke-width="1"/>
 <ellipse cx="110" cy="74" rx="71" ry="8" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="2"/>
 <path d="M47 87L62 244M54 94L63 195" stroke="#fff" stroke-opacity=".48" stroke-width="3" stroke-linecap="round"/>
 ${Array.from({length:22},(_,i)=>`<circle cx="${55+(i*37)%105}" cy="${98+(i*29)%143}" r="${1+i%3*.5}" fill="#fff" opacity=".45" stroke="#746c5d" stroke-opacity=".18" stroke-width=".6"/>`).join('')}
 <image href="${brand.logo}" x="82" y="155" width="56" height="56"/>
 ${name?'<text x="110" y="236" text-anchor="middle" fill="#274736" font-size="14" font-family="Georgia" font-style="italic">Jayasri</text>':''}
 ${lid?`<g class="${animate?'lid-settle':''}"><path d="M41 65L49 57Q110 42 169 57L179 65V74Q110 90 41 74Z" fill="url(#lid-${id})" stroke="#b9c7bf" stroke-width="1"/><ellipse cx="110" cy="64" rx="72" ry="11" fill="none" stroke="#fff" stroke-width="2"/><ellipse cx="110" cy="60" rx="62" ry="8" fill="#f7ffff22" stroke="#e8eeea"/><path d="M43 73Q110 87 178 73" fill="none" stroke="#fff" stroke-width="2"/><ellipse cx="147" cy="57" rx="10" ry="3" fill="#5b7061" opacity=".7"/></g>`:''}</svg>`;
}
const guide=`<div class="brand-guide"><span class="guide-orbit"></span><img src="${brand.logo}" alt=""></div>`;
const bean=(i)=>`<span class="roasted-bean" style="--i:${i};--x:${17+(i*19)%67}%;--y:${61+(i*13)%25}%"><i></i></span>`;
export function sceneArt(kind,config=defaults){
 const farm=['welcome','origins'].includes(kind);
 const backdrop=`<img class="scene-backdrop" src="assets/${farm?'coffee-colombia':'coffee-bar-brown'}.png" alt="">`;
 if(farm)return `${backdrop}<div class="country-tag"><span class="colombia-flag"></span>COLOMBIA<span>Illustrated coffee-growing stop</span></div><svg class="harvest-path" viewBox="0 0 400 500"><path d="M48 270Q235 180 204 385M357 341Q251 261 204 385" fill="none" stroke="#ffe4a3" stroke-width="1" stroke-dasharray="2 8"/></svg>${Array.from({length:10},(_,i)=>`<span class="coffee-cherry ${i%2?'right':'left'}" style="--delay:${i*.83}s"></span>`).join('')}${guide}<div class="story-location">04° N &nbsp; 74° W <span>A journey before your order</span></div>`;
 if(kind==='roast')return `${backdrop}<div class="roast-vignette"></div><div class="roast-dish"></div>${Array.from({length:18},(_,i)=>bean(i)).join('')}<div class="roast-steam"><i></i><i></i><i></i></div>${guide}<div class="process-label">HARVESTED <span>→</span> PROCESSED <span>→</span> ROASTED</div>`;
 const noIce=config.ice==='none';
 const level=kind==='brew'?'espresso':kind==='milk'?'milk':kind==='ice'?'ice':'lid';
 const pour=kind==='brew'||kind==='milk';
 return `${backdrop}<div class="counter-shadow"></div><div class="hero-cup ${config.size} ${kind}" data-shots="${config.shots}">${cup('scene-'+kind,{level,lid:kind==='lid'||kind==='ready',animate:true,name:true,config})}${kind==='lid'?`<div class="photo-finish">${photoCup('latte',config,true)}</div>`:''}</div>
 ${pour?`<div class="pour-vessel ${kind}"><span>${kind==='milk'?options.milk[config.milk]:config.shots+' shots'}</span></div><div class="liquid-stream ${kind}"></div>`:''}
 ${kind==='milk'&&config.sweet!=='none'?`<div class="syrup-note">✦ ${options.sweet[config.sweet]}</div><div class="syrup-vessel"><span>VANILLA</span></div><div class="syrup-stream"></div>`:''}
 ${kind==='ice'&&noIce?'<div class="finish-note">NO ICE. JUST YOUR WAY.</div>':''}${guide}<div class="recipe-chip">${options.size[config.size]} <span>·</span> ${options.milk[config.milk]}</div>`;
}
