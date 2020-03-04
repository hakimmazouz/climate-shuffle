<script>
	import { getContext } from 'svelte';
	import { PlaneGeometry, Mesh, Group, ShaderMaterial, DoubleSide } from 'three$';
	import bannerVert from './../three/shaders/banner.vert.glsl';
	import bannerFrag from './../three/shaders/banner.frag.glsl';
	import { clock } from './../three/config'
	import Text from './Text.svelte'

	export let items = [], z = 0;
	export let instances = [];

	export const group = new Group();
	const parent = getContext('parent');
	parent.add(group);

	$: group.position.z = z;

	$: {
		instances.forEach((instance) => {
			instance.geometry.computeFaceNormals();
			instance.geometry.computeVertexNormals();
			instance.material.uniforms.time.value = $clock.getElapsedTime();
		})
	}

	$: {
		instances.forEach(i => group.remove(i));
		instances = items.map((item, i) => {
			const geo = new PlaneGeometry(
				Math.max(5, Math.random() * 10),
				1,
				50
			)
			const mat = new ShaderMaterial({
				side: DoubleSide,
				transparent: true,
				dithering: true,
				vertexShader: bannerVert,
				fragmentShader: bannerFrag,
				uniforms: {
					time: {
						value: 0
					},
					offset: {
						value: Math.random() * 10
					}
				}
			});
			const obj = new Mesh(geo, mat);
			obj.position.y = i * (1 + .5);
			// group.add(obj)
			return obj
		})
	}
</script>

{#each items as item, index}
	<Text z={z} title={item} index={index} />
{/each}