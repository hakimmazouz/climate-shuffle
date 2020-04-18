<script>
import { onMount, setContext, getContext } from "svelte"
import { spring } from "svelte/motion"
import { quintInOut } from 'svelte/easing'
import { Vector3, BoxGeometry, MeshBasicMaterial, Mesh, MathUtils, PointLight, RingBufferGeometry, PointLightHelper, Group } from "three$"
import { fetchContext } from "./../three/config";
import { mapConstrain } from './../utils'
import Cube from './Cube.svelte'

export let radius = 4, originRotation = 0, originRotationAxis = "x", reverseRotation = Math.round(Math.random()), z = 0, items = new Array(15).fill("").map((_, index, {length}) => ({
		height: Math.max(2, Math.random() * 1.1),
		mesh: undefined,
		x: Math.sin(Math.PI*2/length * index) * radius,
		y: Math.cos(Math.PI*2/length * index) * radius,
		index
	}));

export const group = new Group();

const { render, camera } = fetchContext();
const parent = getContext('parent');

let ringGeo = new RingBufferGeometry(radius, radius + .5, 36, 1);
const ringMat = new MeshBasicMaterial({color: 0xffffff});
// const ringMat = new MeshBasicMaterial({color: 0xaabbcc});
let ringRim = new Mesh(ringGeo, ringMat);
group.add(ringRim);
// group.rotation.x -= Math.PI*0.15;

const mainLight = new PointLight(0xffffff, .5, 10);
mainLight.position.z = -7;
group.add(mainLight);

$: group.position.z = z;
$: {
	items.forEach((item, index, {length}) => {
		item.x = Math.sin(Math.PI*2/length * index) * radius;
		item.y = Math.cos(Math.PI*2/length * index) * radius;
		item.rotation = Math.PI*2/length * index;
	});
	items = items;
}

$: {
	group.remove(ringRim);

	ringGeo = new RingBufferGeometry(radius, radius + .1, 180, 1);
	ringRim = new Mesh(ringGeo, ringMat);
	ringRim.position.z -= 2;

	group.add(ringRim)
}

setContext('parent', group);

onMount(() => {
	parent.add(group);

	setTimeout(() => {
		const distToCam = 10;
		// const distToCam = Math.abs($camera.position.z - group.position.z);
		const vFOV = MathUtils.degToRad( $camera.fov ); // convert vertical fov to radians
		const height = 2 * Math.tan( vFOV / 2 ) * distToCam; // visible height
		const width = height * $camera.aspect;   
		const radiusScale = mapConstrain(distToCam, 5, 20, 1, 4);
		radius = window.innerWidth > window.innerHeight ? height*0.25 : width*0.25;
	}, 10)

    const unsub = render.subscribe(() => {
		group.rotation.z += reverseRotation ? 0.001 : -0.001;

		// origin rotation
		if (originRotation !== 0) {
			const distToCam = Math.abs($camera.position.z - group.position.z);
			group.rotation[originRotationAxis] = quintInOut(mapConstrain(-distToCam, -10, 0, 0, 1)) * originRotation
		}
    });

    return () => {
        unsub();
    }
});

</script>

<!-- <Text /> -->
{#each items as item}
	<Cube size={0.75} height={item.height} x={item.x} y={item.y} z={item.z || 0} rotation={item.rotation} bind:mesh={item.mesh} index={item.index}></Cube>
{/each}