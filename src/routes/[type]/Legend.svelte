<script lang="ts">
	import type { Indiactor } from './+page';

	export let legend: Indiactor['legend'];
</script>

<div class="swatches">
	{#if legend}
		{#each legend as { color, label }}
			<div>
				<span class="swatch" style="--color: {color}" />
				<span class="swatch-label">{label}</span>
			</div>
		{/each}
	{/if}
</div>

<style>
	.swatch {
		display: inline-block;
		vertical-align: middle;
		width: 15px;
		height: 15px;
		margin-right: 5px;
		opacity: 0.75;
		background-color: var(--color);
	}

	.swatches {
		text-align: left;
		padding: 5px;
		line-height: 25px;
		margin-bottom: 20px;
		/*outline: 1px solid black;*/
		width: 100%;
	}
</style>
