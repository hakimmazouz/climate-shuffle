<script>
	import { onMount } from 'svelte'
	import gsap from 'gsap'
	import Ring from './Ring.svelte';
	import Text from './Text.svelte';
	import { currentSection, prevSection } from './../three/config' 
	import { SECTIONS } from './../utils/const'

	const introText = `
	HAKIM MAZOUZ
	CREATIVE DEVELOPER
	`;

	const introTextVisibility = {value: 0}

	function goingTo(slug) {
		console.log(slug, $currentSection, $prevSection)
		return $currentSection === slug && prevSection !== slug;
	}

	const unsubRoute = currentSection.subscribe(() => {
		if (goingTo(SECTIONS.ME.slug)) enterIntroText();
	})

	function enterIntroText() {
		console.log('entering');
		gsap.fromTo(introTextVisibility, 4, {
			value: 0
		}, {
			value: 1,
			onUpdate() {
				introTextVisibility = introTextVisibility
			},
			ease: 'power3.inOut',
		})
	}

	onMount(() => {
		enterIntroText()
	})
	
</script>


<Ring />

<Text size={30} selectedStatus={1} progress={introTextVisibility.value} rotateZ={Math.PI} width={700} align="center" title={introText} />