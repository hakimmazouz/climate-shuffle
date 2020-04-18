<script>
	import gsap from 'gsap';
	import { camera, currentSection, distortion } from './../three/config';
	import { SECTIONS } from './../utils/const'
	import { constrain } from './../utils'

	const {
		ME, 
		WORK,
		THOUGHTS
	} = SECTIONS;
	let prevRoute = null;

	$: lastZ = $camera ? $camera.position.z : 0;

	function onUpdate() {
		const zDiff = $camera.position.z - lastZ;
		$distortion = constrain(Math.min((zDiff)* 20, -0.5) , -24, 1)
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
		console.log('currentSection changed to', $currentSection);
		switch($currentSection) {
			case ME.slug:
				gsap.to($camera.position, 2, {
					z: ME.z + 5,
					ease: "power4.inOut",
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
					delay: 0.25,
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
					ease: "power4.inOut",
					onUpdate
				});
				break;
			default:
				break;
		}

		prevRoute = $currentSection;
	}
</script>