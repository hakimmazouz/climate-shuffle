<script>
	import { currentSection, prevSection } from './../three/config';
	import {SECTIONS} from './../utils/const'

	function changeSection(section) {
		prevSection.set($currentSection);
		currentSection.set(section);
	}
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
	<button on:click={() => changeSection(SECTIONS.ME.slug)}>me</button>
	<button on:click={() => changeSection(SECTIONS.WORK.slug)}>work</button>
	<button on:click={() => changeSection(SECTIONS.THOUGHTS.slug)}>thoughts</button>
</div>