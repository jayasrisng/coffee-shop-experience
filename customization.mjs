export const options = {
 size: {small:'Small · 12 fl oz',medium:'Medium · 16 fl oz',large:'Large · 24 fl oz'},
 milk: {dairy:'2% milk',whole:'Whole milk',oat:'Oatmilk',almond:'Almondmilk'},
 shots: {'1':'1 espresso shot','2':'2 espresso shots','3':'3 espresso shots','4':'4 espresso shots'},
 sweet: {none:'Unsweetened',vanilla:'1 pump vanilla',extra:'2 pumps vanilla'},
 ice: {regular:'Regular ice',light:'Light ice',none:'No ice'}
};
export const defaults = {size:'medium',milk:'dairy',shots:'2',sweet:'none',ice:'regular'};
export function normalize(input={}) {return Object.fromEntries(Object.keys(defaults).map(k=>[k,Object.hasOwn(options[k],input[k])?String(input[k]):defaults[k]]));}
export function describe(config) {return Object.keys(defaults).map(k=>options[k][config[k]]).join(' · ');}
export function restoreOrder(hash,now=Date.now()) {
 const params=new URLSearchParams(hash.replace(/^#/,''));const timestamp=params.get('order');
 if(!/^\d{13}$/.test(timestamp||''))return null;
 const startedAt=Number(timestamp);if(startedAt>now||now-startedAt>=86400000)return null;
 return {startedAt,config:normalize(Object.fromEntries(params))};
}
export function orderHash(startedAt,config) {return '#'+new URLSearchParams({order:String(startedAt),...normalize(config)});}
