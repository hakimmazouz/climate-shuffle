<script>
import { onMount, getContext } from "svelte"
import { spring } from "svelte/motion"
import { Vector3, BoxBufferGeometry, MeshPhongMaterial, Mesh, PointLight, PointLightHelper, Color } from "three$"
import { fetchContext } from "./../three/config";
import { map } from './../utils'

export let size = 1, x = 0, y = 0, z = 0, rotation = 0, light = 0;
const { scene, render } = fetchContext();
const parent = getContext('parent');

const geo = new BoxBufferGeometry(size*0.1, size * .25, size*0.1);
const mat = new MeshPhongMaterial({color: 0xffffff, emissive: 0xffffff, emissiveIntensity: light});
export const mesh = new Mesh(geo, mat);

$: mesh.position.x = x;
$: mesh.position.y = y;
$: mesh.position.z = z;
$: mesh.rotation.z = -rotation;

$: {
    mat.emissiveIntensity = light;
    mesh.scale.y = 1 + light*2
};

onMount(() => {
    parent.add(mesh);

    return () => {
        setTimeout(() => $scene.remove(mesh), 2000);
    }
});

</script>