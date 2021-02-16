<script context="module">
	import { writable } from 'svelte/store'
	import { spring } from 'svelte/motion'
	export const CURSOR_STATE = {
		DEFAULT: 1,
		HOVER: 2,
		READ_MORE: 3,
	}
	export const cursorData = writable({
		state: CURSOR_STATE.DEFAULT,
		delta: {
			x: 0,
			y: 0
		},
		normalizedPosition: {
			x: spring(0, {damping: .95, stiffness: .02}),
			y: spring(0, {damping: .95, stiffness: .02})
		},
		position: {
			x: spring(0),
			y: spring(0)
		}
	});
</script>

<script>
	import { onMount } from 'svelte';
import { mapConstrain } from '../utils';

	export const size = 40;

	const {
		position: {x, y},
		normalizedPosition: {x: nX, y: nY}
	} = $cursorData;

	function updatePosition({clientX, clientY}) {
		$cursorData.delta.x = clientX - $x
		$cursorData.delta.y = clientY - $y
		x.set(clientX);
		y.set(clientY);
		nX.set(mapConstrain(clientX/window.innerWidth, 0, 1, -1, 1));
		nY.set(mapConstrain(clientY/window.innerHeight, 0, 1, -1, 1))
	}
	onMount(() => {
		document.body.addEventListener('mouseenter', updatePosition, {passive: true});
		document.body.addEventListener('mousemove', updatePosition, {passive: true});
		return () => {
			document.body.removeEventListener('mouseenter', updatePosition, {passive: true});
			document.body.removeEventListener('mousemove', updatePosition, {passive: true});
		}
	})
</script>

<div class="cursor" style="width: {size}px; height: {size}px;transform: translate({$x}px, {$y}px);">
	<div class="ding"></div>
</div>

<style>
.cursor {
	position: fixed;
	top: 0;
	left: 0;
	width: 60px;
	height: 60px;
	border: 3px solid white;
	border-radius: 100%;
	z-index: 9999;
	mix-blend-mode: exclusion;
	pointer-events: none;
}

.ding {
	width: 8px;
	height: 8px;
	background-color: white;
	border-radius: 100%;
}
:global(body) {
	/* cursor: none; */
}
</style>