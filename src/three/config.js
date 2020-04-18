import { writable } from "svelte/store";
import { spring } from "svelte/motion";
import { getContext } from "svelte";
import { Clock } from "three$";
import { SECTIONS } from "../utils/const";

// Context key
export const contextKey = "three";

// Stores for context
export const scene = writable(undefined);
export const renderer = writable(undefined);
export const camera = writable(undefined);
export const clock = writable(undefined);
export const render = writable(new Clock());
export const data = writable({});
export const prevSection = writable(null);
export const currentSection = writable(SECTIONS.ME.slug);

export const scroll = spring(0, {
    stiffness: 0.05,
    damping: 0.9,
});
export const wheel = writable({ direction: null, delta: 0 });
export const distortion = spring(-1, {
    stiffness: 0.05,
    damping: 1,
});

export const fetchContext = () => getContext(contextKey);

export const contextConfig = {
    scene,
    renderer,
    camera,
    render,
    clock,
    data,
};
