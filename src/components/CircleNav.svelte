<script>
	import CircleButton from './CircleButton.svelte';
	import { currentSection, prevSection } from './../three/config';
	import {SECTIONS} from './../utils/const'
	
	function changeSection(section) {
		prevSection.set($currentSection);
		currentSection.set(section);
	}

	const buttons = Object.keys(SECTIONS);
</script>

<style>
.container {
	color: white;
	text-align: right;
	margin-right: 35px;
	top: 20px;
	position: relative;
}
</style>

<!-- <button on:click={() => changeSection(SECTIONS.ME.slug)}>me</button>
<button on:click={() => changeSection(SECTIONS.WORK.slug)}>work</button>
<button on:click={() => changeSection(SECTIONS.THOUGHTS.slug)}>thoughts</button> -->

{#each buttons as link}
<div class="container">
	<CircleButton active={$currentSection === SECTIONS[link].slug} name={link} onClick={({name}) => changeSection(SECTIONS[name].slug)} />
</div>
{/each}