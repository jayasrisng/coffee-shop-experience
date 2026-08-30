export const ORDER_DURATION = 60;
export function orderState(phases, startedAt, now) {
  const elapsed = Math.max(0, (now - startedAt) / 1000);
  let index = 0;
  for (let i = 0; i < phases.length; i++) if (elapsed >= phases[i].at) index = i;
  return { index, phase: phases[index], elapsed, remaining: Math.max(0, Math.ceil(ORDER_DURATION - elapsed)), progress: Math.min(1, elapsed / ORDER_DURATION), ready: elapsed >= ORDER_DURATION };
}
