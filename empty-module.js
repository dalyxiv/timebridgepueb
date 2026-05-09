export const AsyncLocalStorage = class { 
  getStore() { return undefined; } 
  run(s, f) { return f(); }
};
export default { AsyncLocalStorage };
