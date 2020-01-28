import { writable } from "svelte/store";
import { getContext } from "svelte";

// Context key
export const contextKey = {};

// Stores for context
export const scene = writable(undefined);
export const renderer = writable(undefined);
export const camera = writable(undefined);
export const render = writable(0);
export const data = writable({});

export const fetchContext = () => getContext(contextKey);

export const contextConfig = {
    scene,
    renderer,
    camera,
    render,
    data,
};
