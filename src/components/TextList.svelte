<script>
	import gsap from 'gsap';
	import { getContext, setContext, onMount } from 'svelte';
	import { cubicInOut } from 'svelte/easing'
	import { Group, BoxHelper, Vector3 } from 'three$';
	import bannerVert from './../three/shaders/banner.vert.glsl';
	import bannerFrag from './../three/shaders/banner.frag.glsl';
	import { render, camera, scene, currentSection, prevSection } from './../three/config'
	import { scroll } from './ScrollControl.svelte'
	import Text from './Text.svelte'
	import { mapConstrain, constrain } from './../utils'
	import {SECTIONS} from './../utils/const'
	import throttle from 'lodash/throttle'

	export let items = [], titleMesh = [], z = 0, currentProject = 0;

	export const group = new Group();

	const progressVal = items.map(() => ({value: 0}))
	const selectedStatus = items.map(() => ({value: 0}))
	const parent = getContext('parent');
	let enterComplete = false;
	group.name = "TextList";
	group.position.z = z;
	parent.add(group);

	$: if ($currentSection === SECTIONS.WORK.slug && $currentSection !== $prevSection) {
		animateTitlesIn();
	}

	$: if ($prevSection === SECTIONS.WORK.slug && $prevSection !== $currentSection) {
		animateTitlesOut();
	}

	function animateTitlesIn() {
		enterComplete = false;
		gsap.delayedCall(2.25, () => selectProject(currentProject));
		gsap.fromTo(progressVal, {
			value: 0
		}, {
			value: 1,
			duration: 2,
			delay: 1.25,
			ease: 'power4.inOut',
			stagger: {
				each: 0.15,
				grid: [1, items.length],
				from: currentProject
			},
			onUpdate: () => {
				progressVal = progressVal;
			}
		})
		gsap.to(titleMesh.map(m => m.position), {
			y: '+=5',
			duration: 3,
			delay: .5,
			ease: 'power4.inOut',
			onComplete: () => {
				enterComplete = true;
			},
			stagger: {
				each: 0.15,
				grid: [1, items.length],
				from: currentProject
			},
		})
	}

	function animateTitlesOut() {
		selectProject(null, currentProject);

		gsap.to(progressVal, {
			value: 0,
			duration: .75,
			ease: 'power4.in',
			stagger: {
				each: 0.15,
				grid: [1, items.length],
				from: currentProject
			},
			onUpdate: () => {
				progressVal = progressVal;
			},
		})
		gsap.to(titleMesh.map(m => m.position), {
			y: '-=5',
			duration: 1,
			stagger: {
				each: 0.1,
				grid: [1, items.length],
				from: currentProject
			},
			ease: 'power4.in',
		})
	}
	function selectProject(selectIndex, deselectIndex) {
		if (selectIndex !== null) {
			gsap.to(selectedStatus[selectIndex], {
				value: 1,
				duration: .5,
				ease: 'power2.out',
				onUpdate: () => {
					selectedStatus = selectedStatus;
				}
			})
		}

		if (deselectIndex !== null) {
			gsap.to(selectedStatus[deselectIndex], {
				value: 0,
				duration: .5,
				ease: 'power2.out',
				onUpdate: () => {
					selectedStatus = selectedStatus;
				}
			})
		}
	}

	setContext('parent', group);

	function animateUp() {
		const prevProject = currentProject;
		const newProject = constrain(currentProject + 1, 0, items.length - 1);
		gsap.to(titleMesh.map(m => m.position), {
			y: '+=1.5',
			duration: 1,
			ease: 'power3.out',

		})
		gsap.delayedCall(0, () => selectProject(newProject, prevProject));
		currentProject = newProject;
	}
	function animateDown() {
		const prevProject = currentProject;
		const newProject = constrain(currentProject - 1, 0, items.length - 1);
		gsap.to(titleMesh.map(m => m.position), {
			y: '-=1.5',
			duration: 1,
			ease: 'power3.out',
		})
		gsap.delayedCall(0, () => selectProject(newProject, prevProject));
		currentProject = newProject;
	}

	const onWheel = throttle(({deltaY}) => {
		if (!enterComplete) return
		if ($currentSection !== SECTIONS.WORK.slug) return
		// if (Math.abs(deltaY) < 3) return;
		const goingUp = Math.sign(deltaY) === 1;

		if (goingUp) {
			if (currentProject < items.length - 1) animateUp();
		} else {
			if (currentProject > 0) animateDown();
		}

	}, 1250, {trailing: false})


	onMount(() => {
		window.addEventListener('wheel', onWheel, true);

		return render.subscribe(clock => {
			// const distToCam = Math.abs($camera.position.z - group.position.z);
			// group.position.y = cubicInOut(mapConstrain(distToCam, 0, 15, 0, 1)) * -10;
		})
	})
</script>

{#each items as item, index}
	<Text bind:mesh={titleMesh[index]} title={item} selectedStatus={selectedStatus[index].value} index={index} progress={progressVal[index].value} />
{/each}