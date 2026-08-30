import {brand} from './brand.mjs';
import {options, defaults, normalize, describe, orderHash, restoreOrder} from './customization.mjs';
import { sceneArt, photoCup } from './visuals.mjs';
import { orderState, ORDER_DURATION } from './timeline.mjs';
const $ = selector => document.querySelector(selector);
const drinks = [
 {id:'latte',name:'Iced Latte',note:'Espresso & cold milk',category:'coffee',description:'Two espresso shots, cold 2% milk, and ice. Your one-minute order experience starts with this drink.'},
 {id:'americano',name:'Iced Americano',note:'Bold, smooth & refreshing',category:'coffee',description:'An espresso-and-water classic served over ice.'},
 {id:'mocha',name:'Iced Mocha',note:'Chocolate meets espresso',category:'coffee',description:'Espresso, mocha sauce, milk, ice, and sweetened whipped cream. The menu illustration is simplified.'},
 {id:'matcha',name:'Iced Matcha Latte',note:'Green tea & cold milk',category:'tea',description:'A chilled matcha-and-milk favorite. This menu preview does not represent a customized recipe.'}
];
let phases=[];
let draft={...defaults};
let orderConfig={...defaults};
let startedAt=null;
let interval=null;
let currentIndex=-1;
let readyShown=false;
let lastDialogFocus=null;
let filter='all';
let manualMotion=false;
const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');

function renderMenu(){
 $('#drink-grid').innerHTML=drinks.filter(d=>filter==='all'||d.category===filter).map(d=>`<button class="drink-card ${d.id==='latte'?'selected':''}" data-drink="${d.id}" aria-label="${d.id==='latte'?'Select Iced Latte':`Preview ${d.name}`}"><div class="drink-art" aria-hidden="true">${photoCup(d.id)}</div><span class="drink-badge">${d.id==='latte'?'YOUR SELECTED DRINK':'MENU PREVIEW'}</span><div class="drink-meta"><h2>${d.name}</h2><p>${d.note}</p></div><span class="drink-arrow" aria-hidden="true">${d.id==='latte'?'✓':'+'}</span></button>`).join('');
}
const fieldNames={size:'Cup size',milk:'Milk',shots:'Espresso',sweet:'Sweetness',ice:'Ice'};
$('#customization-controls').innerHTML=Object.entries(options).map(([key,values])=>`<label for="custom-${key}"><span>${fieldNames[key]}</span><select id="custom-${key}" name="${key}">${Object.entries(values).map(([value,label])=>`<option value="${value}" ${defaults[key]===value?'selected':''}>${label}</option>`).join('')}</select></label>`).join('');
$('#customize-form').addEventListener('submit',event=>event.preventDefault());
$('#customize-form').addEventListener('change',event=>{
 if(startedAt!==null)return;
 if(event.target.name==='size')$('#custom-shots').value={small:'1',medium:'2',large:'3'}[event.target.value];
 draft=normalize(Object.fromEntries(new FormData($('#customize-form'))));renderRecipe(draft);
});
function renderRecipe(config){
 const summary=describe(config);
 $('#basket-cup').innerHTML=photoCup('latte',config);
 $('#receipt-cup').innerHTML=photoCup('latte',config,true);
 $('#ready-cup').innerHTML=photoCup('latte',config,true);
 $('#recipe-preview').textContent='1 drink · Made for Jayasri';
 $('#receipt-description').textContent=summary;$('#ready-description').textContent=summary;
 $('#preparation-summary').textContent=`Espresso, ${options.milk[config.milk].toLowerCase()}, ${options.ice[config.ice].toLowerCase()}.`;
 $('.nutrition').setAttribute('aria-label','Nutrition pending café recipe data');
 $('.nutrition').innerHTML=[['—','calories'],['—','total sugar'],['—','total fat']].map(([value,label])=>`<div><strong>${value}</strong><span>${label}</span></div>`).join('');
 $('.nutrition-note').textContent='Concept preview · Your café’s verified recipe nutrition will appear here. No nutritional values are claimed for this sample drink.';
 $('.dialog-sub').textContent=summary;
 $('.ingredients-list').innerHTML=`<div><dt>${options.shots[config.shots]}</dt><dd>Coffee origin and roast will be supplied by each café. Our Colombian hillside is an illustrative coffee-growing stop, not a verified origin for this cup.</dd></div><div><dt>${options.milk[config.milk]}</dt><dd>Served cold. Exact ingredients and suppliers vary by market; consult the store’s packaging for the selected milk. No store-specific farm is verified in this demo.</dd></div>${config.ice==='none'?'':`<div><dt>${options.ice[config.ice]}</dt><dd>Water, frozen.</dd></div>`}${config.sweet==='none'?'':`<div><dt>${options.sweet[config.sweet]}</dt><dd>Vanilla syrup is an added ingredient. Your café will supply the syrup ingredients and recipe nutrition.</dd></div>`}`;
 $('.allergy strong').textContent=['dairy','whole'].includes(config.milk)?'Contains dairy':config.milk==='almond'?'Contains almonds · Check local allergen information':'Check oatmilk ingredients and local allergen information';
}
function recipeStory(phase,config){
 if(phase.kind==='brew')return {title:'Your espresso. Freshly poured.',text:`Your turn, Jayasri. ${options.shots[config.shots]} flow into your ${config.size} cup. A rich beginning, made your way.`,footnote:'Illustrated preparation · Your selected espresso strength.'};
 if(phase.kind==='milk')return {title:`A swirl of ${options.milk[config.milk].toLowerCase()}.`,text:`Cold ${options.milk[config.milk].toLowerCase()} folds through the espresso.${config.sweet==='none'?' No added syrup.':` ${options.sweet[config.sweet]} adds your chosen sweetness.`}`,footnote:'Your selected milk · No store-specific supplier is claimed.'};
 if(phase.kind==='ice')return {title:config.ice==='none'?'No ice. Just your way.':config.ice==='light'?'A little ice. A gentle chill.':'A little chill. A final swirl.',text:config.ice==='none'?'Skipping the ice, just as you asked. Your cold latte gets a moment to settle before the lid.':`${config.ice==='light'?'Fewer cubes':'Ice cubes'} tumble into the cup. Your latte is almost ready for its first sip.`,footnote:'Your recipe · '+options.ice[config.ice]};
 return phase;
}
renderMenu();
renderRecipe(draft);
$('.category-tabs').addEventListener('click',event=>{
 const button=event.target.closest('[data-filter]');if(!button)return;
 filter=button.dataset.filter;renderMenu();
 document.querySelectorAll('[data-filter]').forEach(b=>{b.classList.toggle('selected',b===button);b.setAttribute('aria-pressed',String(b===button));});
});
$('#drink-grid').addEventListener('click',event=>{
 const button=event.target.closest('[data-drink]');if(!button)return;
 const drink=drinks.find(d=>d.id===button.dataset.drink);
 if(drink.id==='latte'){$('#place-order').scrollIntoView({block:'center',behavior:'smooth'});$('#place-order').focus({preventScroll:true});return;}
 $('#preview-title').textContent=drink.name;$('#preview-copy').textContent=drink.description;
 lastDialogFocus=button;$('#preview-dialog').showModal();
});
$('#choose-latte').addEventListener('click',()=>{$('#preview-dialog').close();filter='all';renderMenu();document.querySelector('[data-filter="all"]').click();$('#place-order').scrollIntoView({block:'center',behavior:'smooth'});$('#place-order').focus({preventScroll:true});});
// Persist only the demo recipe and clock; never payment or personal data.
function persist(){history.replaceState(null,'',orderHash(startedAt,orderConfig));}
function clearPersisted(){history.replaceState(null,'',location.pathname+location.search);}
function showMenu(){
 $('#menu-screen').hidden=false;$('#order-screen').hidden=true;
 $('#menu-link').classList.add('active');$('#order-link').classList.remove('active');
 window.scrollTo({top:0,behavior:'instant'});
}
function showOrder(){
 $('#menu-screen').hidden=true;$('#order-screen').hidden=false;
 $('#menu-link').classList.remove('active');$('#order-link').classList.add('active');
 $('#order-link').hidden=false;window.scrollTo({top:0,behavior:'instant'});
}
$('#menu-link').addEventListener('click',showMenu);
$('.brand').addEventListener('click',event=>{event.preventDefault();showMenu();});
$('#order-link').addEventListener('click',()=>{if(startedAt!==null){tick();showOrder();}});
function updateMotion(){
 document.body.classList.toggle('reduce-motion',manualMotion||reducedMotion.matches);
 $('#reduce-motion').setAttribute('aria-pressed',String(manualMotion||reducedMotion.matches));
 $('#reduce-motion').textContent=manualMotion?'Motion reduced':reducedMotion.matches?'Device motion preference':'Reduce motion';
}
$('#reduce-motion').addEventListener('click',()=>{manualMotion=!manualMotion;updateMotion();});
reducedMotion.addEventListener('change',updateMotion);updateMotion();
function startOrder(){
 if(!phases.length)return;
 if(startedAt!==null){tick();showOrder();return;}
 orderConfig={...draft};startedAt=Date.now();currentIndex=-1;readyShown=false;persist();
 setupOrder();showOrder();tick();
 $('#order-title').focus({preventScroll:true});
 interval=setInterval(tick,150);
}
function setupOrder(){
 renderRecipe(orderConfig);
 $('#customization-fields').disabled=true;
 $('#place-order').innerHTML='View your order <span>→</span>';
 $('#pickup-time').textContent=new Date(startedAt+ORDER_DURATION*1000).toLocaleTimeString([],{hour:'numeric',minute:'2-digit'});
 $('#order-link').hidden=false;
}
function tick(){
 if(startedAt===null||!phases.length)return;
 const state=orderState(phases,startedAt,Date.now());
 $('#countdown').textContent=state.ready?'Ready':`${Math.floor(state.remaining/60)}:${String(state.remaining%60).padStart(2,'0')}`;
 $('#overall-progress').style.width=`${state.progress*100}%`;
 const localProgress=Math.max(0,Math.min(1,(state.elapsed-state.phase.at)/(state.phase.until-state.phase.at)));
 $('#story-progress').style.width=`${localProgress*100}%`;
 if(state.index!==currentIndex){currentIndex=state.index;renderPhase(state);}
 if(state.ready&&!readyShown)finishOrder();
 if(state.ready){clearInterval(interval);interval=null;}
}
function renderPhase(state){
 const p=state.phase;
 $('#scene').dataset.phase=String(state.index);$('#scene').dataset.kind=p.kind;$('#stage').innerHTML=sceneArt(p.kind,orderConfig);
 // Catch up the visual phase after reload/backgrounding without replaying its beginning.
 $('#stage').style.setProperty('--elapsed',`${Math.max(0,state.elapsed-p.at)}s`);
 $('#scene-label').textContent=p.label;$('#scene-footnote').textContent=p.footnote;
 const story=recipeStory(p,orderConfig);
 $('#story-title').textContent=story.title;$('#story-caption').textContent=story.text;
 if(story.footnote)$('#scene-footnote').textContent=story.footnote;
 $('#story-part').textContent=state.index<3?'A STORY WHILE YOU WAIT':'YOUR LATTE IS TAKING SHAPE';
 $('#queue-text').textContent=p.queue>0?`${p.queue} ${p.queue===1?'order':'orders'} ahead of you`:state.ready?'Jayasri, your order is ready':'Your latte is being prepared';
 $('#milestone-queue').textContent=p.queue?`${p.queue} ${p.queue===1?'order':'orders'} ahead of yours`:'Your turn!';
 for(let n=3;n>=1;n--){const dot=$(`#queue-${n}`);dot.classList.toggle('active',p.queue===n);dot.classList.toggle('done',p.queue<n);dot.textContent=p.queue<n?'✓':String(n);}
 $('#queue-you').classList.toggle('active',p.queue===0);$('#queue-you').textContent=state.ready?'✓':'J';
 const milestone=state.ready?3:p.queue===0?2:1;
 for(let i=0;i<4;i++){const li=$(`#milestone-${i}`);li.classList.toggle('complete',i<milestone);li.classList.toggle('current',i===milestone);li.querySelector(':scope > span').textContent=i<milestone?'✓':String(i+1);}
 if(p.queue===0&&!state.ready){$('#order-eyebrow').textContent='NOW PREPARING';$('#order-title').textContent='It’s your turn, Jayasri.';$('#order-subtitle').textContent='Your latte is being made. Watch your cup come together.';}
 document.title=state.ready?`Jayasri, your latte is ready · ${brand.name}`:p.queue?`${p.queue} ${p.queue===1?'order':'orders'} ahead · ${brand.name}`:`Making your latte · ${brand.name}`;
}
function finishOrder(){
 readyShown=true;document.body.classList.add('ready-mode');
 document.querySelectorAll('dialog[open]').forEach(d=>d.close());
 $('.order-layout').hidden=true;$('#ready-screen').hidden=false;
 $('#order-eyebrow').textContent='READY FOR PICKUP';$('#order-title').textContent='Jayasri, your order is ready.';
 $('#order-subtitle').textContent='One Iced Latte. Made for your next little moment.';
 $('#eta-label').textContent='PICKUP STATUS';$('#pickup-time').textContent='Ready now';$('#eta-note').textContent='Demo order #104';$('#timer-label').textContent='All set';
 // Transition to the finished cup automatically, even if the customer browsed the menu.
 showOrder();$('#order-title').focus({preventScroll:true});
}
$('#place-order').addEventListener('click',startOrder);
$('#new-order').addEventListener('click',()=>{
 clearInterval(interval);interval=null;startedAt=null;currentIndex=-1;readyShown=false;clearPersisted();
 $('#customization-fields').disabled=false;renderRecipe(draft);
 document.body.classList.remove('ready-mode');
 $('#ready-screen').hidden=true;$('.order-layout').hidden=false;
 $('#order-title').textContent='We’ve got you, Jayasri.';$('#order-eyebrow').textContent='ORDER RECEIVED';$('#order-subtitle').textContent='Your Iced Latte is in line. Settle in for a little story.';$('#eta-label').textContent='ESTIMATED PICKUP';$('#eta-note').textContent='One-minute simulation';$('#timer-label').textContent='Ready in';
 $('#order-link').hidden=true;$('#place-order').innerHTML='Order for Jayasri <span>→</span>';document.title=`${brand.name} · A little sunshine in every cup`;showMenu();
});
for(const [id,closeId] of [['ingredients','close-ingredients'],['preview-dialog','close-preview'],['brand-dialog','close-brand']]){
 const dialog=$(`#${id}`);$(`#${closeId}`).addEventListener('click',()=>dialog.close());
 dialog.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();dialog.close();}});
 dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();});
 dialog.addEventListener('close',()=>{if(lastDialogFocus?.isConnected)lastDialogFocus.focus({preventScroll:true});});
}
// Looking at ingredients never pauses the customer's order.
 document.querySelectorAll('[data-ingredients]').forEach(button=>button.addEventListener('click',()=>{lastDialogFocus=button;$('#ingredients').showModal();}));
 document.addEventListener('visibilitychange',()=>{
 if(document.hidden||startedAt===null)return;
 tick();
 });
try{
 const response=await fetch('./timeline.json');if(!response.ok)throw new Error('Timeline unavailable');phases=await response.json();
 $('#place-order').disabled=false;$('#place-order').innerHTML='Order for Jayasri <span>→</span>';
 const stored=restoreOrder(location.hash);
 if(stored&&Number.isFinite(stored.startedAt)&&stored.startedAt<=Date.now()&&Date.now()-stored.startedAt<86400000){
  startedAt=stored.startedAt;orderConfig=stored.config;draft={...stored.config};
 Object.keys(options).forEach(key=>{$(`#custom-${key}`).value=draft[key];});setupOrder();showOrder();tick();
  if(!readyShown)interval=setInterval(tick,150);
 }
}catch(error){$('#place-order').textContent='Unable to load. Please reload.';$('#place-order').disabled=true;console.error(error);}

function applyBrand(){
 document.querySelectorAll('[data-brand-logo]').forEach(el=>el.src=brand.logo);
 document.querySelector('link[rel="icon"]').href=brand.logo;
 document.querySelectorAll('[data-brand-name]').forEach(el=>el.textContent=brand.name);
 document.documentElement.style.setProperty('--brand-yellow',brand.accent);
 document.documentElement.style.setProperty('--brand-brown',brand.brown);
 document.title=brand.name+' · A little sunshine in every cup';
 $('.brand').setAttribute('aria-label',brand.name+' menu');
}
for(const button of document.querySelectorAll('[data-brand-open]'))button.addEventListener('click',()=>{lastDialogFocus=button;$('#brand-dialog').showModal();});
$('#brand-form').addEventListener('submit',event=>{event.preventDefault();brand.name=$('#brand-name').value.trim()||'Coffee Shop';brand.accent=$('#brand-accent').value;brand.brown=$('#brand-brown').value;applyBrand();$('#brand-dialog').close();});
$('#reset-brand').addEventListener('click',()=>{brand.name='Coffee Shop';brand.accent='#f2c94c';brand.brown='#52321d';$('#brand-name').value=brand.name;$('#brand-accent').value=brand.accent;$('#brand-brown').value=brand.brown;applyBrand();});
applyBrand();
