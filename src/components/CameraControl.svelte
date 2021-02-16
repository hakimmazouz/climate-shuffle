<script>
	import gsap from 'gsap';
	import { camera, currentSection, distortion } from './../three/config';
	import { SECTIONS } from './../utils/const'
	import { constrain, mapConstrain } from './../utils'
import { onMount } from 'svelte';
import { cursorData } from './DynamicCursor.svelte';
import { Vector3 } from 'three';

	const {
		ME, 
		WORK,
		THOUGHTS
	} = SECTIONS;
	let prevRoute = null;
	let moving = false;

	$: lastZ = $camera ? $camera.position.z : 0;

	function onStart() {
		moving = true
	}

	function onComplete() {
		moving = false
	}

	function onUpdate() {
		const zDiff = $camera.position.z - lastZ;
		const ratio = window.innerWidth/window.innerHeight;
		const scaledMinimumDistortion =  mapConstrain(-ratio, -1.76, -0.60, -1, 1);
		$distortion = constrain(Math.min(zDiff* 20, scaledMinimumDistortion) , -30, 1)
		// $camera.position.x += constrain(zDiff, 0, .5) * Math.random() * shiftDirection($camera.position.x);
		// $camera.position.y += constrain(zDiff, 0, .5) * Math.random() * shiftDirection($camera.position.y);
		lastZ = $camera.position.z;
	}

	function shiftDirection(pos) {
		return pos === 0 ? 1 : Math.sign(pos) * -1;
	}

	function routeChanged() {
		return prevRoute !== $currentSection;
	}

	$: if ($camera && routeChanged()) {
		switch($currentSection) {
			case ME.slug:
				gsap.to($camera.position, 2, {
					z: ME.z + 5,
					ease: "power4.inOut",
					onStart,
					onComplete,
					onUpdate
				});
				gsap.to($camera.rotation, 3, {
					z: Math.PI,
					ease: "power4.inOut",
				});
				break;
			case WORK.slug:
				gsap.to($camera.position, 2, {
					z: WORK.z + 5,
					delay: 0.25,onStart,
					onComplete,
					ease: "power4.inOut",
					onUpdate
				});
				gsap.to($camera.rotation, 3.5, {
					z: 0,
					ease: "power4.inOut",
				});
				break;
			case THOUGHTS.slug:
				gsap.to($camera.position, 2, {
					z: THOUGHTS.z + 5,
					ease: "power4.inOut",onStart,
					onComplete,
					onUpdate
				});
				break;
			default:
				break;
		}

		prevRoute = $currentSection;
	}

	onMount(() => {
		const unsubX = $cursorData.normalizedPosition.x.subscribe(v => {
			$camera.position.x = v
		})
		const unsubY = $cursorData.normalizedPosition.y.subscribe(v => {
			$camera.position.y = -v*.5
			$camera.lookAt(new Vector3(0, 0, $camera.position.z-5))
		})
		return () => {
			unsubX()
			unsubY()
		}
	});
</script>