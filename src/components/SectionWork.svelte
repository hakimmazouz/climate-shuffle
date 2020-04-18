<script>
	import Ring from './Ring.svelte';
	import TextList from './TextList.svelte';

	let projects = ["Yeezy", "Paper Collective", "Ramasjang", "Kammeradvokat", "Knabstrup"].map(c => c.toUpperCase());
</script>



<!-- <Ring z={-10} originRotation={-Math.PI*0.75} /> -->
<TextList z={-10} items={projects}/>
