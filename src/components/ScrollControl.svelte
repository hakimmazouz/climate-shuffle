<script context="module">
	import { onMount } from 'svelte';
	import { writable } from "svelte/store";
	import { spring } from 'svelte/motion';

	export const scroll = writable(0);
</script>

<script>
	import { wheel, render } from './../three/config'
	import { constrain } from './../utils'
	import pannable from './../actions/pannable'

	let velocity = 0;
	let acc = 0;
	let damping = 0.98;
	let touchdown = false;

	let body = null;
	let scrollValue = 0;

	$: {
		scroll.set(scrollValue);
	}

	function updateWheel({deltaY: delta}) {
		scrollValue = delta;
	}

	function onPanStart() {
		touchdown = true;
	}

	function onPanMove({detail}) {
		acc = detail.dy;
	}

	function onPanEnd() {
		touchdown = false;
		console.log(velocity);
	}

	function updateScrollPhysics() {
		if (touchdown) {
			velocity = acc*10;
		} else {
			velocity += acc;
			velocity *= damping;
		}
		acc = 0;
		if (velocity !== scrollValue) scrollValue = -velocity;
	}

	onMount(() => {
		body = document.body;

		const destroy = pannable(body).destroy;
		const unsub = render.subscribe(updateScrollPhysics);

		body.addEventListener('panstart', onPanStart);
		body.addEventListener('panmove', onPanMove);
		body.addEventListener('panend', onPanEnd);
		
		return () => {
			destrot();
			unsub();
		}
	})

</script>

<svelte:body on:wheel={updateWheel} />
