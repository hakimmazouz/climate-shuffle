<script>
	import { onMount, setContext } from 'svelte';
	import { spring } from 'svelte/motion';
	import {gsap} from 'gsap';
	import { LoadingManager, WebGLRenderer as Renderer, Scene, ShaderMaterial, Uniform, Vector3, Vector2,  PerspectiveCamera as Camera, Clock } from 'three$';
	import { contextKey, contextConfig, data, scene, camera } from './config'
	import { map, constrain } from './../utils'
	import { DPR } from './../utils/const'
	import PostProcessing from './js/PostProcessing'

	export let node, pause = false, width = 0, height = 0, once = false, postprocessing = null, renderReady = false;

	export const renderer = new Renderer({antialias: false});
	renderer.setPixelRatio(DPR);

	export const clock = new Clock();
	contextConfig.renderer.set(renderer);

	const render = () => {
		if (pause) return;

		if ($scene && $camera) {
			if (!postprocessing && !renderReady) {
				postprocessing = new PostProcessing(renderer, $scene, $camera, () => {
					renderReady = true;
				});
			}
			if (renderReady) {
				postprocessing.composer.render(clock.getDelta())
				contextConfig.render.set(clock)
			}
		};
		

		if (!once) requestAnimationFrame(render);
	}

	/**
	 * Resize renderer when window resizes.
	 * @see svelte:window
	 * */
	$: {
		renderer.setSize(width, height);
		if (postprocessing) postprocessing.composer.setSize(width, height);
		data.update(d => ({...d, width, height}))
	};

	/**
	 * Automatically change change container depending on node prop.
	 * @prop node
	 * */
	$: {
		renderer.domElement.parent && renderer.domElement.parent.removeChild(domElement);
		node && node.appendChild(renderer.domElement);
	}

	setContext(contextKey, contextConfig)

	onMount(() => {
		render();
	})
</script>

<svelte:window
bind:innerWidth={width}
bind:innerHeight={height}
/>

<slot></slot>