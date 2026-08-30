import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { orderState } from './timeline.mjs';
const phases=JSON.parse(readFileSync(new URL('./timeline.json',import.meta.url),'utf8'));
const start=1750000000000;
test('queue advances 3 → 2 → 1 before preparation starts',()=>{
 for(const [seconds,queue,kind] of [[0,3,'welcome'],[9.99,3,'welcome'],[10,2,'origins'],[19.99,2,'origins'],[20,1,'roast'],[29.99,1,'roast'],[30,0,'brew']]){
  const state=orderState(phases,start,start+seconds*1000);
  assert.equal(state.phase.queue,queue);assert.equal(state.phase.kind,kind);assert.equal(state.ready,false);
 }
});
test('milk, ice, and lid precede automatic pickup at exactly sixty seconds',()=>{
 for(const [seconds,kind] of [[39,'milk'],[47,'ice'],[53,'lid'],[59.999,'lid'],[60,'ready']]){
  const state=orderState(phases,start,start+seconds*1000);assert.equal(state.phase.kind,kind);assert.equal(state.ready,seconds>=60);
 }
});
test('missed timer callbacks and a background tab cannot extend the order',()=>{
 const state=orderState(phases,start,start+125000);
 assert.equal(state.phase.kind,'ready');assert.equal(state.remaining,0);assert.equal(state.progress,1);
});
test('backward clock changes cannot make progress negative or remaining exceed a minute',()=>{
 const state=orderState(phases,start,start-1000);assert.equal(state.elapsed,0);assert.equal(state.remaining,60);
});
test('timeline and story text have contiguous, positive scene windows',()=>{
 for(let i=0;i<phases.length;i++){
  assert.ok(phases[i].text.length>0);assert.ok(phases[i].until>phases[i].at);
  if(i<phases.length-1)assert.equal(phases[i].until,phases[i+1].at);
 }
});
