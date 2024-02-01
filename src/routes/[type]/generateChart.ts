import * as Highcharts from 'highcharts';
import type { Indiactor } from './+page';
import _indicatorLookup from './indicators.json';
const indicatorLookup = _indicatorLookup as Indiactor[];

/**
 * Generates a line chart that shows the the
 * specified indicator and how it has changed
 * over time.
 */
export function generateChart(
	renderTo: HTMLElement,
	indicator: string,
	type: 'financial' | 'human' | 'manufactured' | 'social',
	_data: { year: number; value: number | undefined | null }[],
	metadata: { name?: string; county?: number; neighborhood?: string }
) {
	const indicatorConfig = indicatorLookup
		.filter((d) => d.type === type)
		.find(({ name }) => name === indicator);

	const data = _data.map((datum) => {
		return {
			year: datum.year,
			// high Charts handles null well, but not undefined -- check for undefined and convert to null.
			value: datum.value ?? null,
			// if the county is Greenville County, SC
			// get the median county values from the json file
			// for comparison
			countyMedian:
				indicatorConfig?.data?.find(
					({ year, county }) => year === datum.year && county === metadata.county
				)?.value ?? null
		};
	});

	let subtitle = '';
	if (metadata.name) subtitle += `<b>ID:</b> ${metadata.name}`;
	if (metadata.neighborhood && metadata.neighborhood !== '-')
		subtitle += `<br/><b>Neighborhoods include:</b> ${metadata.neighborhood}`;

	Highcharts.setOptions({
		lang: {
			thousandsSep: ','
		}
	});

	Highcharts.chart(renderTo, {
		title: {
			text: indicatorConfig?.description
		},

		subtitle: {
			text: subtitle
		},

		tooltip: {
			formatter: function () {
				if (indicatorConfig?.format === 'dollars') {
					return '$' + Highcharts.numberFormat(this.y ?? 0, 0, '.', ',');
				} else if (indicatorConfig?.format === 'integer') {
					return Highcharts.numberFormat(this.y ?? 0, 0, '.', ',');
				} else if (indicatorConfig?.format === 'percent') {
					return Highcharts.numberFormat(this.y ?? 0, 1, '.', ',') + '%';
				} else if (indicatorConfig?.format === 'index') {
					return Highcharts.numberFormat(this.y ?? 0, 3, '.', ',');
				}
			}
		},

		xAxis: {
			categories: data.map((d) => d.year.toString()),
			title: {
				text: 'Year'
			}
		},

		legend: {
			enabled: true
		},

		yAxis: {
			title: {
				text: indicatorConfig?.description
			}
		},

		plotOptions: {
			line: {
				dataLabels: {
					enabled: true,
					formatter: function () {
						if (indicatorConfig?.format == 'dollars') {
							return '$' + Highcharts.numberFormat(this.y ?? 0, 0, '.', ',');
						} else if (indicatorConfig?.format == 'integer') {
							return Highcharts.numberFormat(this.y ?? 0, 0, '.', ',');
						} else if (indicatorConfig?.format == 'percent') {
							return Highcharts.numberFormat(this.y ?? 0, 1, '.', ',') + '%';
						} else if (indicatorConfig?.format == 'index') {
							return Highcharts.numberFormat(this.y ?? 0, 3, '.', ',');
						}
					}
				},
				enableMouseTracking: true
			}
		},
		series: [
			{
				name: metadata.name,
				data: data.map((d) => d.value),
				type: 'line'
			},

			{
				name: 'County value',
				data: data.map((d) => d.countyMedian),
				color: 'orange',
				visible: true,
				type: 'line'
			}
		]
	});
}
