import { writable } from "svelte/store";
import { spring } from "svelte/motion";
import { getContext } from "svelte";

// Context key
export const contextKey = "three";

// Stores for context
export const scene = writable(undefined);
export const renderer = writable(undefined);
export const camera = writable(undefined);
export const clock = writable(undefined);
export const render = writable(0);
export const data = writable({});

export const scroll = spring(0, {
    stiffness: 0.05,
    damping: 0.9,
});
export const wheel = writable({ direction: null, delta: 0 });
export const distortion = writable(0);

export const fetchContext = () => getContext(contextKey);

export const contextConfig = {
    scene,
    renderer,
    camera,
    render,
    clock,
    data,
};
