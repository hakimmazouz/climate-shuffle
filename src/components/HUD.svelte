<script>
	import { currentSection, prevSection } from './../three/config';
	import {SECTIONS} from './../utils/const'
	import CircleNav from './CircleNav.svelte'

	let active;
</script>

<style>
	.container {
		position: fixed;
		right: 0;
		height: 100%;
		z-index: 100;
	}
</style>

<div class="container">
	<CircleNav bind:active={active}/>
</div>