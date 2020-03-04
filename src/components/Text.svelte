<script>
	import { getContext } from 'svelte';
	import { TextureLoader, RawShaderMaterial, Mesh, DoubleSide, Vector3 } from 'three$'
	import createGeometry from 'three-bmfont-text';
	import MSDFShader from 'three-bmfont-text/shaders/msdf'
	import loadFont from 'load-bmfont';
	import bannerVert from './../three/shaders/banner.vert.glsl'
	import outlineFrag from './../three/shaders/outline.frag.glsl'

	import fontPath from './../assets/monument-extended-46.fnt';
	import fontAtlas from './../assets/monument-extended-46.png';

	export let title = 'Insert title', index = 0, z = 0;
	const parent = getContext('parent');
	const { clock } = getContext('three');

	export let mesh = null, geo = null;

	loadFont(fontPath, (err, font) => {

		geo = createGeometry({
			// width: 300,
			align: 'center',
			text: title,
			font
		});

		const loader = new TextureLoader();

		loader.load(fontAtlas, texture => {
			const mat = new RawShaderMaterial(
				MSDFShader({
					map: texture,
					color: 0xFFFFFF,
					side: DoubleSide,
					transparent: true,
					negate: false,
					vertexShader: bannerVert,
					fragmentShader: outlineFrag
				})
			);
			
			mesh = new Mesh(geo, mat);
			mesh.scale.y = -1;
			mesh.scale.multiply(new Vector3(0.025, 0.025, 1))

			mesh.position.z = z;
			mesh.position.x = -geo.layout.width*0.5 * mesh.scale.x;
			mesh.position.y = (2) * index;


			console.log(mesh);

			parent.add(mesh);
		});
	})

	$: if (geo) {
		geo.update(title)
		geo = geo;
	};

	$: if (mesh) {
		if (!mesh.material.uniforms.time) {
			mesh.material.uniforms.time = {value: $clock.getElapsedTime()}
		} else {
			mesh.material.uniforms.time.value = $clock.getElapsedTime()
		};
	}

</script>