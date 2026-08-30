import {realCup,realPour} from './pouring.mjs?v=6';
export function photoCup(type='latte',config=defaults,name=false){
 const photo=type==='latte';
 return `<div class="photo-cup ${photo?'single-photo':'menu-sprite sprite-'+type}" data-ice="${config.ice}">${photo?`<img class="cup-photograph" src="assets/${config.ice==='none'?'latte-noice-photo':'latte-photo'}.png" alt="">`:''}<img class="cup-decal" src="assets/coffee-shop-mark.svg" alt="">${name?'<span class="photo-name">Jayasri</span>':''}</div>`;
}
import {defaults,options} from './customization.mjs';
export function sceneArt(kind,config=defaults){
 const farm=['welcome','origins'].includes(kind);
 const backdrop=`<img class="scene-backdrop" src="assets/${farm?'coffee-colombia':'coffee-bar-brown'}.png" alt="">${kind==='origins'?'<img class="harvest-full" src="assets/coffee-colombia-full.png" alt="">':''}`;
 if(farm)return `${backdrop}<div class="country-tag"><span class="colombia-flag"></span>COLOMBIA<span>Illustrated coffee-growing stop</span></div><svg class="harvest-path" viewBox="0 0 400 500"><path d="M48 270Q235 180 204 385M357 341Q251 261 204 385" fill="none" stroke="#ffe4a3" stroke-width="1" stroke-dasharray="2 8"/></svg>${Array.from({length:10},(_,i)=>`<span class="coffee-cherry ${i%2?'right':'left'}" style="--delay:${i*.83}s"><img src="assets/coffee-cherry.png" alt=""></span>`).join('')}<div class="story-location">04° N &nbsp; 74° W <span>A journey before your order</span></div>`;
 if(kind==='grind')return `<img class="scene-backdrop grinder-backdrop" src="assets/coffee-grinder.png" alt="Roasted beans in a grinder hopper, with ground coffee in the portafilter below"><div class="process-label">ROASTED BEANS <span>→</span> FRESH GROUNDS <span>→</span> ESPRESSO</div>`;
 const noIce=config.ice==='none';
 return `${backdrop}<div class="counter-shadow"></div>${realCup(kind,config)}${realPour(kind,config)}
 ${kind==='milk'&&config.sweet!=='none'?`<div class="syrup-note">✦ ${options.sweet[config.sweet]}</div><div class="syrup-vessel"><span>VANILLA</span></div><div class="syrup-stream"></div>`:''}
 ${kind==='ice'&&noIce?'<div class="finish-note">NO ICE. JUST YOUR WAY.</div>':''}<div class="recipe-chip">${options.size[config.size]} <span>·</span> ${options.milk[config.milk]}</div>`;
}
