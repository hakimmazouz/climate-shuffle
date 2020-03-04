<script>
	import { onMount, setContext } from 'svelte';
	import { spring } from 'svelte/motion';
	import {gsap} from 'gsap';
	import { WebGLRenderer as Renderer, Scene, ShaderMaterial, Uniform, Vector3, PerspectiveCamera as Camera, Clock } from 'three$';
	
	import { EffectComposer, EffectPass, ChromaticAberrationEffect, BlendFunction, NoiseEffect, ShaderPass, BloomEffect, RenderPass } from 'postprocessing'

	import { contextKey, contextConfig, data, scene, camera, distortion } from './config'

	import { map } from './../utils'
	import lenseDistortionFrag from './shaders/lensedistortion.frag.glsl'

	export let node, pause = false, autoStart = true, width = 0, height = 0, once = false, mainEffectPass = null, shaderPass = null, distortionShader = null ;

	export const renderer = new Renderer({antialias: true});
	renderer.setPixelRatio(window.devicePixelRatio);
	export const clock = new Clock();
	const composer = new EffectComposer(renderer);
	renderer.setPixelRatio(window.devicePixelRatio);
	contextConfig.renderer.set(renderer);
	contextConfig.clock.set(clock);

	const render = () => {
		if (pause) return;

		if ($scene && $camera) {
			if (!mainEffectPass) {
				const noiseEffect = new NoiseEffect({
					blendFunction: BlendFunction.SOFT_LIGHT
				});
				noiseEffect.blendMode.opacity.value = 0.25;
				mainEffectPass = new EffectPass($camera, new BloomEffect(), noiseEffect, new ChromaticAberrationEffect())
				// mainEffectPass.renderToScreen = true;
				distortionShader = new ShaderMaterial({
					uniforms: {
						iResolution: {
							value: new Vector3(width*window.devicePixelRatio, height*window.devicePixelRatio, 1)
						},
						iChannel0: {
							value: null
						},
						distortion: {
							value: $distortion
						},
						iTime: {
							value: 0
						}
					},
					fragmentShader: lenseDistortionFrag
				})
				shaderPass = new ShaderPass(distortionShader, 'iChannel0')
				shaderPass.renderToScreen = true;
				composer.addPass(new RenderPass($scene, $camera));
				composer.addPass(mainEffectPass);
				composer.addPass(shaderPass);
				$camera.position.z = 10
			}

			// renderer.render($scene, $camera)
			composer.render(clock.getDelta())
			contextConfig.render.set(clock.getDelta())
		};
		

		if (!once) requestAnimationFrame(render);
		contextConfig.clock.set(clock);
	}

	$: autoStart && render();

	$: {
		// renderer.setSize(width, height);
		composer.setSize(width, height);
		data.update(d => ({...d, width, height}))
	};

	$: {
		renderer.domElement.parent && renderer.domElement.parent.removeChild(domElement);
		node && node.appendChild(renderer.domElement);
	}

	setContext(contextKey, contextConfig)

	$: {
		if (distortionShader) {
			distortionShader.uniforms.distortion.value = $distortion
			// $camera.position.z = map(-$distortion, -.75, .75 , 9, 15)
		};
	}

	onMount(() => {
		let lastZ = $camera.position.z;

		// gsap.fromTo($camera.position, {
		// 	z: 15
		// }, {
		// 	z: -5,
		// 	repeat: -1,
		// 	yoyo: true,
		// 	duration: 2,
		// 	ease: "power4.inOut",
		// 	onUpdate: () => {
		// 		$distortion = ($camera.position.z - lastZ) * 8
		// 		lastZ = $camera.position.z;
		// 	}
		// })
	})
</script>

<svelte:window
bind:innerWidth={width}
bind:innerHeight={height}
/>

<slot></slot>