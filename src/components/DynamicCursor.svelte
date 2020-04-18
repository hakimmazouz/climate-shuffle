<script context="module">
	import { writable } from 'svelte/store'
	export const CURSOR_STATE = {
		DEFAULT: 1,
		HOVER: 2,
		READ_MORE: 3,
	}
	export const cursorData = writable({
		state: CURSOR_STATE.DEFAULT
	});
</script>

<style>
.cursor {
	position: fixed;
	top: 0;
	left: 0;
	width: 60px;
	height: 60px;
	border: 1px solid white;
}
::global(body) {
	cursor: none;
}
</style>

<div class="cursor"></div>