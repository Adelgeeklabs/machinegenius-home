export async function loadPolyfills() {
  if (typeof window === "undefined") return;

  const polyfills = [];

  // Browser APIs
  if (!("IntersectionObserver" in window)) {
    polyfills.push(import("intersection-observer"));
  }

  if (!("ResizeObserver" in window)) {
    polyfills.push(import("resize-observer-polyfill"));
  }

  // Modern JavaScript Features
  if (!("structuredClone" in window)) {
    polyfills.push(import("core-js/actual/structured-clone.js"));
  }

  // Array methods
  if (!("from" in Array)) {
    polyfills.push(import("core-js/actual/array/from.js"));
  }

  if (!("flatMap" in Array.prototype)) {
    polyfills.push(import("core-js/actual/array/flat-map.js"));
  }

  // Global objects
  if (!("Promise" in window)) {
    polyfills.push(import("core-js/actual/promise/index.js"));
  }

  if (!("Set" in window)) {
    polyfills.push(import("core-js/actual/set/index.js"));
  }

  try {
    await Promise.all(polyfills);
  } catch (error) {
    console.warn("Polyfill loading error:", error);
  }
}
