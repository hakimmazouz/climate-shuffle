<script>
	import { getContext } from 'svelte';
	import { PerspectiveCamera } from 'three';
	import { contextKey, camera, data, scroll, distortion } from './config';
	import { map, constrain } from './../utils'

	export let fov = 75, aspect = $data.width / $data.height, near = 0.1, far = 1000;

	export const instance = new PerspectiveCamera(fov, aspect, near, far);
	camera.set(instance);

	$: {
		const lastZ = instance.position.z;
		instance.position.z = map(-$scroll, -window.innerHeight*3, 0, -15, 10);
		// $distortion = 1.;
		// $distortion = -1.5;
		$distortion = constrain((instance.position.z - lastZ) * 6, -6, 2);
	};

	$: {
		instance.aspect = $data.width/$data.height;
		instance.updateProjectionMatrix();
	}
</script>