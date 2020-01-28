<script>
	import { spring } from 'svelte/motion'
	import { writable } from 'svelte/store'
	import { onMount } from 'svelte';
	import {camera, render} from './three/config'
	import Three from './three/Three.svelte';
	import Scene from './three/Scene.svelte';
	import Camera from './three/Camera.svelte';
	import Cube from './components/Cube.svelte';

	import pannable from './actions/pannable'
	import { map, mapConstrain, constrain } from './utils'

	let container;

	let acc = 0;
	let minPosition = 0;
	let maxPosition = 0;
	let interacting = false;

	$: minPosition = 0;
	$: maxPosition = cubes.reduce((total, current) => total += 4, -4);


	let cubes = new Array(5).fill("").map((_, index) => ({
		height: Math.max(5, Math.random() * 2.5),
		mesh: undefined,
		index
	}));

	const cameraX = spring($camera ? $camera.position.x : 0, {
		stiffness: 0.2,
		damping: 0.1
	})

	$: if ($camera) $camera.position.x = $cameraX;

	function handlePanMove({detail: {x, dx}}) {
		acc = dx * 0.015;
		cameraX.set(constrain($cameraX - acc, minPosition, maxPosition));
	}

	function handlePanStart() {
		interacting = true;
		cameraX.damping = 1;
		cameraX.stiffness = .5;
		cubes = cubes.map(c => ({ ...c, height: c.height*1.2 }));
	}

	function handlePanEnd() {
		interacting = false;
		cameraX.damping = 0.25;
		cameraX.stiffness = 0.1;
		$cameraX = getNearestCubePosition();
		cubes = cubes.map(c => ({ ...c, height: c.height - c.height/6 }));
	}

	function getNearestCubePosition() {
		const closestCube = cubes.map(c => c.mesh).sort((a, b) => {
			console.log(a.position.x, b.position.x);
			const distA = Math.abs($cameraX - a.position.x);
			const distB = Math.abs($cameraX - b.position.x);
			return distA < distB ? -1 : 1
		})[0];
		return closestCube.position.x;
	}
</script>

<main class={interacting ? "grabbing" : "grab"} bind:this={container} use:pannable on:panmove={handlePanMove} on:panstart={handlePanStart} on:panend={handlePanEnd}>
{#if container}
	<Three bind:node={container}>
		<Scene></Scene>
		<Camera fov={90}></Camera>
		{#each cubes as cube}
			<Cube height={cube.height} distToCam={cube.mesh ? Math.abs($cameraX - cube.mesh.position.x) : 0} bind:mesh={cube.mesh} index={cube.index}></Cube>
		{/each}
	</Three>
{/if}
</main>

<style>
	main {
		position: fixed;
		top: 0;
		left: 0;
	}
	main.grab {
		cursor: grab;
	}
	main.grabbing {
		cursor: grabbing;
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