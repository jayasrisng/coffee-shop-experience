import {options} from './customization.mjs';

// A photographic cup shell over masked liquid plates. Everything remains driven by
// the order phase, so skipping ice and changing shots do not require a fixed video.
export function realCup(kind,config){
 const milk=kind==='milk';
 const brew=kind==='brew';
 const ice=kind==='ice';
 const count=config.ice==='none'?0:config.ice==='light'?3:7;
 const id='real-'+kind;
 const body='M17 29 Q50 34 83 29 L72 115 Q50 122 28 115 Z';
 const photo=config.ice==='none'?'latte-noice-photo':'latte-photo';
 return `<div class="real-cup ${kind} ${config.size}" style="--espresso-top:${112-Number(config.shots)*4}px" data-milk="${config.milk}" data-ice="${config.ice}" data-shots="${config.shots}">
 <svg viewBox="0 0 100 125" xmlns="http://www.w3.org/2000/svg" class="real-cup-layers"><defs>
 <mask id="${id}-shell" maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="125" style="mask-type:luminance"><image href="assets/empty-plastic-cup.png" width="100" height="125" preserveAspectRatio="none"/></mask>
 <clipPath id="${id}-body"><path d="${body}"/></clipPath>
 <clipPath id="${id}-fill"><rect class="real-fill-mask" x="0" y="0" width="100" height="125"/></clipPath>
 <linearGradient id="${id}-espresso" x2="0" y2="1"><stop stop-color="#b77b32"/><stop offset=".08" stop-color="#74421f"/><stop offset=".65" stop-color="#462311"/><stop offset="1" stop-color="#23110a"/></linearGradient>
 <linearGradient id="${id}-stream"><stop stop-color="${brew?'#613414':'#e8dbbd'}"/><stop offset=".45" stop-color="${brew?'#d59a54':'#fff9e5'}"/><stop offset="1" stop-color="${brew?'#74401e':'#cfbb98'}"/></linearGradient>
 <linearGradient id="${id}-ice" x2=".8" y2="1"><stop stop-color="#fff" stop-opacity=".8"/><stop offset=".35" stop-color="#dce6df" stop-opacity=".2"/><stop offset=".8" stop-color="#fff" stop-opacity=".5"/><stop offset="1" stop-color="#d1ded4" stop-opacity=".1"/></linearGradient>
 <clipPath id="${id}-lid"><rect x="5" y="0" width="90" height="29"/></clipPath>
 <filter id="${id}-soft"><feGaussianBlur stdDeviation=".8"/></filter></defs>
 <ellipse cx="50" cy="119" rx="32" ry="3" fill="#362011" opacity=".13"/>
 <image href="assets/empty-plastic-cup.png" width="100" height="125" preserveAspectRatio="none" opacity=".35" mask="url(#${id}-shell)"/>
 <g clip-path="url(#${id}-body)">
 ${!ice?`<g clip-path="url(#${id}-fill)">
 <rect x="12" y="23" width="76" height="101" fill="url(#${id}-espresso)"/>
 ${!brew?`<image href="assets/latte-noice-photo.png" width="100" height="125" class="real-milk-photo"/>`:''}
 ${milk?`<g class="liquid-bloom" filter="url(#${id}-soft)" fill="none" stroke="#f9e5bc" stroke-linecap="round"><path d="M50 25C42 44 67 70 49 89S39 113 54 122" stroke-width="11"/><path d="M50 34C60 55 37 76 47 101" stroke-width="5"/></g>`:''}
 </g>`:''}
 ${(brew||milk)?`<path class="inner-real-stream" d="M50 17C49.2 38 50.7 72 50 117" fill="none" stroke="url(#${id}-stream)" stroke-width="${brew?'1.4':'2.3'}"/>`:''}
 <g class="ice-rise ${milk?'rising':''}" style="--ice-rise:${kind==='lid'?'-48px':'0px'}">${Array.from({length:count},(_,i)=>`<g class="real-ice ${ice?'falling':''}" style="--drop-delay:${i*.24}s"><g transform="translate(${30+i%3*13} ${78+Math.floor(i/3)*11}) rotate(${i%2?18:-17} 7 7)"><path d="M2 0L13 1L16 11L12 16L1 14L0 4Z" fill="url(#${id}-ice)" stroke="#fff9" stroke-width=".5"/><path d="M2 2L11 3L13 12M3 4L4 11L11 13" fill="none" stroke="#fff8" stroke-width=".8"/></g></g>`).join('')}</g>
 ${count===7&&(milk||kind==='lid')?`<image href="assets/latte-photo.png" width="100" height="125" class="real-iced-photo ${milk?'ice-reveal':''}"/>`:''}
 </g>
 <image href="assets/empty-plastic-cup.png" width="100" height="125" preserveAspectRatio="none" class="plastic-reflections" mask="url(#${id}-shell)"/>
 <image href="assets/coffee-shop-mark.svg" x="41" y="58" width="18" height="18" opacity=".85"/>
 ${kind==='lid'?`<g class="real-lid"><image href="assets/${photo}.png" width="100" height="125" clip-path="url(#${id}-lid)"/></g>`:''}
 <text x="50" y="106" text-anchor="middle" font-family="Georgia" font-style="italic" fill="#61401f" font-size="5">Jayasri</text>
 </svg></div>`;
}

export function realPour(kind,config){
 if(!['brew','milk'].includes(kind))return '';
 return `<div class="real-pitcher ${kind}"><img src="assets/pouring-pitcher.png" alt=""></div><div class="real-stream ${kind}"></div><div class="pour-recipe-label">${kind==='milk'?options.milk[config.milk]+' · cold':options.shots[config.shots]}</div>`;
}
