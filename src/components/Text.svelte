<script>
	import { getContext } from 'svelte';
	import { TextureLoader, RawShaderMaterial, Mesh, DoubleSide, Vector3 } from 'three$'
	import { interpolate, easeIn, easeOut, easeInOut } from '@popmotion/popcorn'
	import createGeometry from 'three-bmfont-text';
	import MSDFShader from 'three-bmfont-text/shaders/msdf'
	import loadFont from 'load-bmfont';
	import bannerVert from './../three/shaders/banner.vert.glsl'
	import outlineFrag from './../three/shaders/outline.frag.glsl'
	import { scroll } from './ScrollControl.svelte'

	import fontPath from './../assets/monument-extended-46.fnt';
	import fontAtlas from './../assets/monument-extended-46.png';

	import { map } from './../utils'

	export let title = 'Insert title', rotateZ = 0, index = null, progress = 1, selectedStatus = false, size = 15, align = "center", width = undefined;
	const parent = getContext('parent');
	const { render } = getContext('three');
	let moveTimeout = null;
	const mapYToRotation = interpolate([-4, 0, 4], [-Math.PI*0.33, 0, Math.PI*0.33]);
	const mapYToZ = interpolate([-4, 0, 4], [0, -5, 0], {ease: [easeInOut, easeInOut]});
	let mat = null;
	const isFlipped = rotateZ === Math.PI;

	export let mesh = null, geo = null;

	loadFont(fontPath, (err, font) => {

		geo = createGeometry({
			text: title,
			width,
			letterSpacing: 3,
			align,
			font
		});

		const loader = new TextureLoader();

		loader.load(fontAtlas, texture => {
			console.log(geo);
			const msdf = MSDFShader({
					map: texture,
					color: 0xFFFFFF,
					side: DoubleSide,
					transparent: true,
					negate: false,
					// uniforms: {
					// 	width: geo.layout.width
					// },
					vertexShader: bannerVert,
					fragmentShader: outlineFrag
			})
			mat = new RawShaderMaterial(
				{
					...msdf,
					uniforms: {
						...msdf.uniforms,
						width: {
							type: 'f',
							value: geo.layout.width
						},
						progress: {
							type: 'f',
							value: progress
						},
						selected: {
							type: 'f',
							value: selectedStatus
						}
					}
				}
			);

			
			mesh = new Mesh(geo, mat);
			mesh.scale.y = -1;
			mesh.scale.multiply(new Vector3(size * 0.001, size * 0.001, 1))

			const shiftX = -geo.layout.width*0.5 * mesh.scale.x;
			const shiftY = -geo.layout.height*0.5 * mesh.scale.x;
			mesh.position.x = isFlipped ? -shiftX : shiftX;
			mesh.position.y = isFlipped ? -shiftY : shiftY;
			if (index !== null) mesh.position.y -= ((1.5) * index) + 5;
			// mesh.position.y = -((1.5) * index) - 0.25;

			mesh.rotateOnWorldAxis(new Vector3(0,0,1), rotateZ);

			mesh.scale.normalize();
			console.log(geo);

			parent.add(mesh);
		});
	})

	$: if (geo) {
		geo.update(title)
		geo = geo;
	};

	$: if (mesh && mesh.material.uniforms.progress.value !== progress) {
		mesh.material.uniforms.progress.value = progress;
	} 

	$: if (mesh && mesh.material.uniforms.progress.selected !== selectedStatus) {
		mesh.material.uniforms.selected.value = selectedStatus;
	} 

	$: if (mesh) {
		if (!mesh.material.uniforms.time) {
			mesh.material.uniforms.time = {value: $render.getElapsedTime()}
		} else {
			mesh.material.uniforms.time.value = $render.getElapsedTime()
		};
	}

	render.subscribe(v => {
		if (mesh) {
			// if (index === 0) console.log(mesh.position.y)
			// mesh.rotation.x = mapYToRotation(mesh.position.y)
			// mesh.position.z = mapYToZ(mesh.position.y);
		};
	})

</script>