<script>
	import { scroll, wheel } from './../three/config'
	import { constrain } from './../utils'

	let scrollValue = 0;

	function updateWheel({deltaY: delta}) {
		wheel.set({delta, direciton: Math.sign(delta)})
		scrollValue = constrain(scrollValue + delta, 0, window.innerHeight*3);
	}

	$: {
		scroll.set(scrollValue);
	}

</script>


<svelte:window on:wheel={updateWheel} />