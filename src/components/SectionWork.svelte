<script>
	import gsap from 'gsap'
	import Ring from './Ring.svelte';
	import TextList from './TextList.svelte';
	import { currentSection, prevSection } from './../three/config'
	import { createArray } from './../utils'
	import { PROJECTS, SECTIONS } from './../utils/const'

	let projects = PROJECTS
	let amountPerProject = 15;
	let lights = createArray(projects.length * amountPerProject, () => ({value: 0}));
	let currentProject;
	let activeSection = false;

	$: activeSection = $currentSection === SECTIONS.WORK.slug;

	function goingTo(slug) {
		return $currentSection === slug && $prevSection !== slug;
	}
	function leaving(slug) {
		return $prevSection === slug && $currentSection !== slug;
	}

	const unsubRoute = currentSection.subscribe(() => {
		if (goingTo(SECTIONS.WORK.slug)) turnOnLights();
		if (leaving(SECTIONS.WORK.slug)) turnOffLights();
	})

	function turnOnLights() {
		// gsap.delayedCall(2, () => lightUpProject(currentProject))
		gsap.to(lights, {
			duration: 1,
			stagger: .025,
			value: .2,
			ease: 'power3.out',
			onUpdate() {
				lights = lights;
			}
		})
	}

	function turnOffLights() {
		gsap.to(lights, {
			duration: 1,
			stagger: -.01,
			value: 0,
			ease: 'power3.in',
			onUpdate() {
				lights = lights;
			}
		})
	}

	function lightUpProject(index) {
		const highlights = lights.slice(0, index*amountPerProject + amountPerProject).filter(l => l.value < 1);
		// const highlights = lights.slice(index * amountPerProject, index*amountPerProject + amountPerProject);
		gsap.to(highlights, {
			duration: .5,
			stagger: .025,
			value: 1,
			ease: 'power3.out',
			overwrite: true,
			onUpdate() {
				lights = lights;
			}
		})
		const otherLights = lights.slice(index*amountPerProject + amountPerProject, lights.length);
		const lastLit = otherLights.slice(0, amountPerProject);
		gsap.to(lastLit, {
			duration: .5,
			stagger: -.025,
			value: 0.2,
			ease: 'power3.out',
			onUpdate() {
				lights = lights;
			}
		})
	}

	function shutOffProject(index) {
		gsap.to(lights.slice(index * amountPerProject, index*amountPerProject + amountPerProject), {
			duration: 2,
			stagger: -.05,
			value: 0,
			ease: 'power3.out',
			onUpdate() {
				lights = lights;
			}
		})
	}

	function amountOn() {
		return lights.filter(l => l.value > 0).length / amountPerProject;
	}

	$: if ($currentSection === SECTIONS.WORK.slug) {
		lightUpProject(currentProject);
	}

</script>

<Ring z={-20} idleSpin={false} amount={lights.length} lamps={lights} originRotationAxis="y" />
<!-- <Ring z={-10} originRotation={-Math.PI*0.75} /> -->
<TextList bind:currentProject={currentProject} z={-10} items={projects}/>
