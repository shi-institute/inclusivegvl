<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let options: { value: string; label: string }[];

	let leftYear: number | undefined = undefined;
	let rightYear: number | undefined = undefined;
	let selectedIndicator: (typeof options)[0]['value'];

	const dispatch = createEventDispatcher<{
		submit: { leftYear: number; rightYear: number; indicator: string };
		clear: void;
	}>();

	function handleSubmit() {
		if (leftYear && rightYear) {
			dispatch('submit', { leftYear, rightYear, indicator: selectedIndicator });
		} else {
			alert('Please select a year for both the left and right maps.');
		}
	}

	function handleClear() {
		leftYear = undefined;
		rightYear = undefined;
		dispatch('clear');
	}

	$: hideEarlyYears = ['snap', 'gini', 'insure', 'movedlast'].includes(selectedIndicator);
	$: hideLaterYears = ['moved'].includes(selectedIndicator);
</script>

<form>
	<fieldset>
		<div class="selectIndicator">
			<legend>Select Indicator</legend>

			<select id="indicatorNames" style="width: 80%" bind:value={selectedIndicator}>
				{#each options as { value, label }}
					<option {value}>{label}</option>
				{/each}
			</select>
		</div>

		<fieldset>
			<legend>Select a year for:</legend>

			<div class="leftMap">
				<legend>Left Map</legend>
				{#if !hideEarlyYears}
					<input type="radio" id="L1990" value="1990" bind:group={leftYear} />
					<label for="L1990">1990</label>
					<input type="radio" id="L2000" value="2000" bind:group={leftYear} />
					<label for="L2000">2000</label><br />
				{/if}

				{#if !hideLaterYears}
					{#if selectedIndicator !== 'insure'}
						<input type="radio" id="L2010" value="2010" bind:group={leftYear} />
						<label for="L2010">2010</label>
					{/if}

					<input type="radio" id="L2016" value="2016" bind:group={leftYear} />
					<label for="L2016">2016</label>
				{/if}
			</div>
		</fieldset>

		<fieldset>
			<div class="rightMap">
				<legend>Right map</legend>

				{#if !hideEarlyYears}
					<input type="radio" id="R1990" value="1990" bind:group={rightYear} />
					<label for="R1990">1990</label>
					<input type="radio" id="R2000" value="2000" bind:group={rightYear} />
					<label for="R2000">2000</label><br />
				{/if}

				{#if !hideLaterYears}
					{#if selectedIndicator !== 'insure'}
						<input type="radio" id="R2010" value="2010" bind:group={rightYear} />
						<label for="R2010">2010</label>
					{/if}

					<input type="radio" id="R2016" value="2016" bind:group={rightYear} />
					<label for="R2016">2016</label>
				{/if}
			</div>
		</fieldset>

		<div class="subButton">
			<button type="button" on:click={handleSubmit}> Compare </button>
		</div>

		<div class="clearButton">
			<button type="button" id="clear" on:click={handleClear}>Clear Maps</button>
		</div>
	</fieldset>
</form>

<style>
	fieldset {
		background-color: lightgray;
		padding: 0;
	}

	.selectIndicator {
		padding-bottom: 5%;
	}

	.leftMap,
	.rightMap,
	.subButton {
		padding: 2%;
	}
</style>
