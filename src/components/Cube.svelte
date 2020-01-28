<script>
import { onMount } from "svelte"
import { spring } from "svelte/motion"
import { Vector3, BoxGeometry, MeshBasicMaterial, Mesh, PointLight, PointLightHelper } from "three$"
import { fetchContext } from "./../three/config";
import { map } from './../utils'

export let height = 0.1, index = 0;
export let distToCam = 0;
const { scene, render } = fetchContext();

const springHeight = spring(0.1, {
    stiffness: 0.1,
    damping: 0.25
});

const geo = new BoxGeometry(1, 1, 1);
const mat = new MeshBasicMaterial({color: "#FFEA98"});
export const mesh = new Mesh(geo, mat);
// mesh.rotation.x = Math.PI*0.33;
mesh.scale.z = 2;
mesh.position.x = index * 4;

$: springHeight.set(height);
$: mesh.scale.y = $springHeight;

$: if (mesh) {
    mesh.position.z = map(-distToCam, -4, 0, 0, 1);
}

onMount(() => {
    $scene.add(mesh);
    springHeight.set(height);

    const unsub = render.subscribe(() => {
        mesh.rotateOnWorldAxis(new Vector3(0, 1, 0), 0.01);
    })

    return () => {
        unsub();
        springHeight.set(0);
        setTimeout(() => $scene.remove(mesh), 2000);
    }
});

</script>