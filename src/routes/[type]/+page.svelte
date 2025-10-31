<script lang="ts">
	import { base } from '$app/paths';
	import MapOptions from '$lib/components/MapOptions.svelte';
	import syncMaps from '@mapbox/mapbox-gl-sync-move';
	import mapboxgl from 'mapbox-gl';
	import 'mapbox-gl/dist/mapbox-gl.css';
	import { onMount } from 'svelte';
	import Legend from './Legend.svelte';

	export let data;

	let mapLContainer: HTMLElement;
	let mapRContainer: HTMLElement;
	let chartContainer: HTMLElement;
	let mapL: mapboxgl.Map;
	let mapR: mapboxgl.Map;
	let leftPopup: mapboxgl.Popup;
	let rightPopup: mapboxgl.Popup;
	let leftLayer = '';
	let rightLayer = '';
	let selectedIndicator: string | undefined = undefined;

	onMount(() => {
		initializeMaps();
	});

	let lastStyle = 'mapbox://styles/furmanuw/cjq5iu4j8amzz2rphvt2mjrxs';
	async function setStyle(type: typeof data.type, indicator: string) {
		let style = '';
		if (type === 'financial') {
			style = 'mapbox://styles/furmanuw/cjq5iu4j8amzz2rphvt2mjrxs';
		}

		if (type === 'human') {
			if (['popden', 'min04_', 'chldpt', 'presch', 'white'].includes(indicator)) {
				style = 'mapbox://styles/furmanuw/cjqiiuu1dmrdj2rphozaflwb5';
			} else {
				style = 'mapbox://styles/furmanuw/cjqi9cq8jbl0n2rp3tz46smsu';
			}
		}

		if (type === 'manufactured') {
			style = 'mapbox://styles/furmanuw/cjqi777a2gchm2rthg4qpky2a';
		}

		if (type === 'social') {
			style = 'mapbox://styles/furmanuw/cjzoin2y52p6x1ct8hi1l1p3u';
		}

		if (style === lastStyle) return;

		const leftMapStatus = new Promise<void>((resolve, reject) => {
			mapL.once('styledataloading', function () {
				mapL.once('styledata', function () {
					resolve();
				});
			});
		});

		const rightMapStatus = new Promise<void>((resolve, reject) => {
			mapR.once('styledataloading', function () {
				mapR.once('styledata', function () {
					resolve();
				});
			});
		});

		mapL.setStyle(style);
		mapR.setStyle(style);
		lastStyle = style;

		return Promise.all([leftMapStatus, rightMapStatus]).then(() => {
			return;
		});
	}

	function initializeMaps() {
		mapboxgl.accessToken =
			'pk.eyJ1IjoiZnVybWFudXciLCJhIjoiY2pwbmRiem1uMDF2ZjN3bjI5cHJ1aG16byJ9.WImIW1cOaMvS-DaG-_18Ww';

		mapL = new mapboxgl.Map({
			container: mapLContainer,
			style: 'mapbox://styles/furmanuw/cjq5iu4j8amzz2rphvt2mjrxs',
			center: [-82.300316, 34.857192],
			zoom: 9
		});
		mapR = new mapboxgl.Map({
			container: mapRContainer,
			style: 'mapbox://styles/furmanuw/cjq5iu4j8amzz2rphvt2mjrxs',
			center: [-82.300316, 34.857192],
			zoom: 9
		});

		// add zoom and rotation controls to the map.
		mapL.addControl(new mapboxgl.NavigationControl());
		mapR.addControl(new mapboxgl.NavigationControl());

		// keep the position and zoom of the two maps in sync
		syncMaps(mapL, mapR);

		// add popops
		leftPopup = new mapboxgl.Popup({ closeOnClick: false });
		rightPopup = new mapboxgl.Popup({ closeOnClick: false });
	}

	function setPopops(leftLayer: string, rightLayer: string) {
		const handleEvt = (
			evt: mapboxgl.MapMouseEvent & {
				features?: mapboxgl.MapboxGeoJSONFeature[] | undefined;
			} & mapboxgl.EventData
		) => {
			if (!selectedIndicator) return;
			const indicatorConfig = data.indicators.find(
				(indicator) => indicator.name === selectedIndicator
			);
			if (!indicatorConfig) return;

			// get left and right values
			const leftValue: number = evt.features?.[0].properties?.[leftLayer.replace('Yr', '')];
			const rightValue: number = evt.features?.[0].properties?.[rightLayer.replace('Yr', '')];

			// format left and right values
			let formattedLeftValue = data.helpers.formatNumber(leftValue, indicatorConfig.format);
			let formattedRightValue = data.helpers.formatNumber(rightValue, indicatorConfig.format);

			// zeroes indicate no data
			if (formattedLeftValue == '0' && indicatorConfig.format == 'dollars') {
				formattedLeftValue = 'Data not available';
			}
			if (formattedRightValue == '0' && indicatorConfig.format == 'dollars') {
				formattedRightValue = 'Data not available';
			}

			// create the HTML for the popups
			let leftHTML = `<b>${indicatorConfig.description}: </b>${formattedLeftValue}`;
			let rightHTML = `<b>${indicatorConfig.description}: </b>${formattedRightValue}`;

			// add name/ID  to the popup (if it is defined)
			const name = evt.features?.[0].properties?.Name;
			if (name) {
				leftHTML += `<br/><b>ID:</b> ${name}`;
				rightHTML += `<br/><b>ID:</b> ${name}`;
			}

			// add neightborhood to the popup (if it is defined)
			const neighborhood = evt.features?.[0].properties?.Neighborhood;
			if (neighborhood && neighborhood !== '-') {
				leftHTML += `<br/><b>Neighborhoods Include:</b> ${neighborhood}`;
				rightHTML += `<br/><b>Neighborhoods Include:</b> ${neighborhood}`;
			}

			// load all the data values for the chart
			const year1990 = evt.features?.[0].properties?.[selectedIndicator + '1990'];
			const year2000 = evt.features?.[0].properties?.[selectedIndicator + '2000'];
			const year2010 = evt.features?.[0].properties?.[selectedIndicator + '2010'];
			const year2016 = evt.features?.[0].properties?.[selectedIndicator + '2016'];

			// show appropriate popups on both left and right map
			leftPopup.setLngLat(evt.lngLat);
			leftPopup.setHTML(leftHTML);
			leftPopup.addTo(mapL);

			rightPopup.setLngLat(evt.lngLat);
			rightPopup.setHTML(rightHTML);
			rightPopup.addTo(mapR);

			// generate high chart
			const county = evt.features?.[0].properties?.County;
			data.helpers.generateChart(
				chartContainer,
				selectedIndicator,
				data.type,
				[
					{ year: 1990, value: year1990 },
					{ year: 2000, value: year2000 },
					{ year: 2010, value: year2010 },
					{ year: 2016, value: year2016 }
				],
				{ name, neighborhood, county }
			);
		};

		mapL.on('click', leftLayer, handleEvt);
		mapR.on('click', rightLayer, handleEvt);
	}

	function handleOptionsSubmit(
		evt: CustomEvent<{ leftYear: number; rightYear: number; indicator: string }>
	) {
		selectedIndicator = evt.detail.indicator;
		changeMaps(evt.detail.leftYear, evt.detail.rightYear, evt.detail.indicator);
	}

	/**
	 * Changes the maps to new comparison years and a new indicator.
	 *
	 * *This will clear the current layers from the maps.*
	 * */
	async function changeMaps(leftMapYear: number, rightMapYear: number, selectedIndicator: string) {
		// clear previous map layers
		clearMaps();

		// ensure the correct set of layers are active
		await setStyle(data.type, selectedIndicator);

		// store the names of the layers to show on the maps
		leftLayer = selectedIndicator + 'Yr' + leftMapYear;
		rightLayer = selectedIndicator + 'Yr' + rightMapYear;

		// make the layers for the selected indicator visible
		mapL.setLayoutProperty(leftLayer, 'visibility', 'visible');
		mapR.setLayoutProperty(rightLayer, 'visibility', 'visible');

		// configure the popups
		setPopops(leftLayer, rightLayer);
	}

	/**
	 * Clears the current layers from the maps.
	 * Popups and legends are removed by this function.
	 * It will leave the basemap intact.
	 */
	function clearMaps() {
		mapL
			.getStyle()
			// we only want to remove layers that we added, and
			// we know that all of our layers have the string `Yr`
			// in them (e.g. giniYr2016 or giniYr2010),
			// so we filter out all other layers
			.layers.filter((layer) => layer.id.includes('Yr'))
			// hide all of our layers in both maps
			.forEach((layer) => {
				mapL.setLayoutProperty(layer.id, 'visibility', 'none');
				mapR.setLayoutProperty(layer.id, 'visibility', 'none');
			});

		// clear out previous legend
		// $('#bins').empty();

		// clear out previous chart
		// $('#chartContainer').empty();

		// close popups
		if (rightPopup.isOpen()) rightPopup.remove();
		if (leftPopup.isOpen()) leftPopup.remove();
	}
</script>

<svelte:head>
	<title>{data.title}</title>
</svelte:head>

<div class="row">
	<div class="column left">
		<div class="title">{data.title}</div>
	</div>
	<div class="column middle">
		<div id="leftMapTitle" />
	</div>
	<div class="column right">
		<div id="rightMapTitle" />
	</div>
</div>

<div class="row">
	<div class="column left">
		<div class="legend">
			<div class="link">
				<a href="{base}/" rel="external">← Home</a>
			</div>
			<div class="link">
				<a href="{base}/indicator_descriptions.pdf" rel="external">Indicator Descriptions</a>
			</div>

			<MapOptions options={data.measures || []} on:submit={handleOptionsSubmit} />

			<Legend
				legend={data.indicators.find((ind) => ind.name === selectedIndicator)?.legend || []}
			/>
		</div>
	</div>
	<div class="column middle">
		<div class="maps">
			<div bind:this={mapLContainer} style="height: 600px;" />
		</div>
	</div>
	<div class="column right">
		<div class="maps">
			<div bind:this={mapRContainer} style="height: 600px;" />
		</div>
	</div>
</div>

<div id="chartContainer" bind:this={chartContainer} />

<style>
	.title {
		font-family: Verdana, Geneva, sans-serif;
		font-size: 18px;
		text-align: left;
		padding: 5px;
		margin-top: 10px;
	}

	/* Create three unequal columns that floats next to each other */
	.column {
		float: left;
		padding: 1px;
		/*outline: 2px solid purple;*/
	}

	.left {
		width: 11%;
		float: left;
		top: 5px;
	}

	.middle,
	.right {
		width: 44%;
	}

	/* Clear floats after the columns */
	.row:after {
		content: '';
		display: table;
		clear: both;
	}

	.maps {
		margin: 1%;
		outline: 2px solid black;
	}

	/* .maptitles {
		text-align: center;
		outline: none;
		margin-top: 10px;
		padding: 10px;
		font-weight: bold;
	} */

	.legend {
		float: left;
		padding: 0px;
		text-align: center;
		/*outline: 2px solid black;*/
		z-index: 1000;
		position: absolute;
		top: 79px;
		left: 2px;
	}

	.link {
		padding: 5px;
		text-align: left;
	}

	#chartContainer {
		height: 25%;
		width: 50%;
		margin: auto;
		margin-top: 2%;
	}

	:global(.mapboxgl-popup-content) {
		max-width: 350px;
	}
</style>
