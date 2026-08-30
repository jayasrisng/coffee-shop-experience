import test from 'node:test';
import assert from 'node:assert/strict';
import {defaults,options,normalize,restoreOrder,orderHash,describe} from './customization.mjs';
test('every offered customization survives validation',()=>{
 for(const [key,values] of Object.entries(options))for(const value of Object.keys(values))assert.equal(normalize({...defaults,[key]:value})[key],value);
});
test('recipe and order clock survive reload without changing selections',()=>{
 const now=1788122000000;const config={size:'small',milk:'almond',shots:'4',sweet:'extra',ice:'none'};
 assert.deepEqual(restoreOrder(orderHash(now-23000,config),now),{startedAt:now-23000,config});
 assert.match(describe(config),/No ice/);
});
test('invalid recipe values and expired/future clocks are rejected safely',()=>{
 assert.deepEqual(normalize({milk:'<script>',shots:'999',ice:'__proto__'}),defaults);
 const now=1788122000000;
 assert.equal(restoreOrder('#order='+(now+1),now),null);
 assert.equal(restoreOrder('#order='+(now-86400000),now),null);
 assert.equal(restoreOrder('#order=NaN',now),null);
 assert.deepEqual(restoreOrder('#order='+now,now).config,defaults);
});
