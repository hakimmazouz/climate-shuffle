<script>
	import gsap from 'gsap';
	import { getContext, setContext, onMount } from 'svelte';
	import { Group, BoxHelper, Vector3 } from 'three$';
	import { render, camera, scene, currentSection, prevSection } from './../three/config'
	import Text from './Text.svelte'
	import { constrain } from './../utils'
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
		gsap.set(titleMesh.map(m => m.position), {
			y: '+=5'
		});
		gsap.from(titleMesh.map(m => m.position), {
			// y: '-=5',
			y: (index) => {
				return index >= currentProject ? '+=5' : '-=5'
			},
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
		const nextProject = constrain(currentProject + 1, 0, items.length - 1);

		gsap.to(group.position, {
			y: nextProject * 1.5,
			duration: 1,
			ease: 'power3.out',
		})
		gsap.delayedCall(0, () => selectProject(nextProject, prevProject));
		currentProject = nextProject;
	}
	function animateDown() {
		const prevProject = currentProject;
		const nextProject = constrain(currentProject - 1, 0, items.length - 1);

		gsap.to(group.position, {
			y: nextProject * 1.5,
			duration: 1,
			ease: 'power3.out',
		})
		gsap.delayedCall(0, () => selectProject(nextProject, prevProject));
		currentProject = nextProject;
	}

	const onWheel = throttle(({deltaY}) => {
		if ($currentSection !== SECTIONS.WORK.slug) return
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