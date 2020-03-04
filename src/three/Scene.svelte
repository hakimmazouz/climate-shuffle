<script>
import { getContext, onMount, setContext } from 'svelte';
import { Scene, Fog, Color, BoxGeometry, MeshNormalMaterial, Mesh } from 'three$'
import { contextKey } from './config';

export let background = new Color(0xF0BCCB);

const { scene: sceneStore } = getContext(contextKey);


const scene = new Scene();
setContext('parent', scene);

scene.background = background;
scene.fog = new Fog(background, 2, 40);
sceneStore.set(scene);
</script>

<slot></slot>