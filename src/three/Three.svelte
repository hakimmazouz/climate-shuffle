<script>
	import { setContext } from 'svelte';
	import { WebGLRenderer as Renderer, Scene, PerspectiveCamera as Camera } from 'three$';

	import { contextKey, contextConfig, data, scene, camera } from './config'

	export let node, pause = false, autoStart = true, width = 0, height = 0, once = false ;

	export const renderer = new Renderer();
	renderer.setDevicePixelRatio(window.devicePixelRatio);
	contextConfig.renderer.set(renderer);

	const render = () => {
		if (pause) return;

		if ($scene && $camera) {
			renderer.render($scene, $camera)
			contextConfig.render.set(performance.now())
		};

		if (!once) requestAnimationFrame(render);
	}

	$: autoStart && render();

	$: {
		renderer.setSize(width, height);
		data.update(d => ({...d, width, height}))
	};

	$: {
		renderer.domElement.parent && renderer.domElement.parent.removeChild(domElement);
		node && node.appendChild(renderer.domElement);
	}

	setContext(contextKey, contextConfig)
</script>

<svelte:window
bind:innerWidth={width}
bind:innerHeight={height}
/>

<slot></slot>