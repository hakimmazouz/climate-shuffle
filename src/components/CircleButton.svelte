<script>
export let name = "button", onClick = null, active = false;

export function handleClick(event) {
	if (typeof onClick === 'function') {
		onClick.call(null, {
			event,
			name
		})
	}
	
}
</script>

<style>
	.button {
		display: inline-block;
		opacity: 0.5;
		font-family: 'arial', sans-serif;
		font-weight: 700;
	}
	.button:hover {
		opacity: 0.75;
		cursor: pointer;
	}
	.button.active {
		opacity: 1;
	}
</style>

<div href="" class="button" class:active={active} on:click={handleClick}>
	<span>{name}</span>
</div>