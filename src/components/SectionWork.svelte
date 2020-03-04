<script>
	import Ring from './Ring.svelte';
	import TextList from './TextList.svelte';

	let projects = ["Yeezy", "Ramasjang", "Kammeradvokat", "Knabstrup"].map(c => c.toUpperCase());
</script>



<Ring z={-10} originRotation={-Math.PI*0.5} />
<TextList z={-12} items={projects}/>
