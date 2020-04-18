<script>
	import { spring } from 'svelte/motion'
	import { writable } from 'svelte/store'
	import { onMount } from 'svelte';
	import {camera, render} from './three/config'
	import HUD from './components/HUD.svelte';
	import CameraControl from './components/CameraControl.svelte';
	import ScrollControl from './components/ScrollControl.svelte';
	import Three from './three/Three.svelte';
	import Scene from './three/Scene.svelte';
	import Camera from './three/Camera.svelte';
	import SectionMe from './components/SectionMe.svelte';
	import SectionWork from './components/SectionWork.svelte';
	import SectionThoughts from './components/SectionThoughts.svelte';

	let container;

</script>


<HUD />

<!-- InteractionControls -->
<CameraControl />
<ScrollControl />

<main bind:this={container} >
{#if container}
	<Three bind:node={container}>
		<Camera fov={100}></Camera>
		<Scene>
			<SectionMe />
			<SectionWork />
			<SectionThoughts />
		</Scene>
	</Three>
{/if}
</main>

<style>
	:global(body) {
		overflow: hidden;
	}
	main {
		position: fixed;
		top: 0;
		left: 0;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>