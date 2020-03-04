<script>
import { onMount, getContext } from "svelte"
import { spring } from "svelte/motion"
import { Vector3, BoxBufferGeometry, MeshBasicMaterial, Mesh, PointLight, PointLightHelper } from "three$"
import { fetchContext } from "./../three/config";
import { map } from './../utils'

export let height = 0.1, size = 1, index = 0, x = 0, y = 0, z = 0;
const { scene, render } = fetchContext();
const parent = getContext('parent');

const springHeight = spring(0.1, {
    stiffness: 0.1,
    damping: 0.25
});

const geo = new BoxBufferGeometry(size, size, size);
const mat = new MeshBasicMaterial({color: 0xFFEA98});
// const mat = new MeshBasicMaterial({color: "#FFEA98"});
export const mesh = new Mesh(geo, mat);
// mesh.rotation.x = Math.PI*0.33;
// mesh.rotateOnWorldAxis(new Vector3(1, 0, 0), Math.PI*0.25)
// mesh.scale.z = 2;
// mesh.position.x = index * 4;

const cubeUpper = new Mesh(geo, mat);
const cubeLower = new Mesh(geo, mat);

cubeLower.position.y = -4;
cubeLower.position.x = index * 4;
cubeUpper.position.y = 4;
cubeUpper.position.x = index * 4;

$: mesh.position.x = x;
$: mesh.position.y = y;
$: mesh.position.z = z;

$: springHeight.set(height);
// $: mesh.scale.y = $springHeight;

onMount(() => {
    parent.add(mesh);
    springHeight.set(height);

    const unsub = render.subscribe(() => {
        // mesh.rotateOnWorldAxis(new Vector3(0, 1, 0), 0.01);
    })

    return () => {
        unsub();
        springHeight.set(0);
        setTimeout(() => $scene.remove(mesh), 2000);
    }
});

</script>