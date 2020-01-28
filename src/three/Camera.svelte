<script>
	import { getContext } from 'svelte';
	import { PerspectiveCamera } from 'three';
	import { contextKey, camera, data } from './config';

	export let fov = 75, aspect = $data.width / $data.height, near = 0.1, far = 1000;

	export const instance = new PerspectiveCamera(fov, aspect, near, far);
	camera.set(instance);
	$camera.position.z = 5;

	$: {
		instance.aspect = $data.width/$data.height;
		instance.updateProjectionMatrix();
	}
</script>