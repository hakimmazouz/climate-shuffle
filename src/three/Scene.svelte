<script>
import { getContext, onMount,  } from 'svelte';
import { Scene, Fog, Color, BoxGeometry, MeshNormalMaterial, Mesh } from 'three$'
import { contextKey } from './config';

export let background = new Color(1, .1, .5);

const {scene: sceneStore} = getContext(contextKey);

const scene = new Scene();
scene.background = background;
scene.fog = new Fog(background, 2, 5);
sceneStore.set(scene);
</script>