import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { formatNumber } from './formatNumber';
import { generateChart } from './generateChart';
import _indicators from './indicators.json';

export const load = (({ params }) => {
	const title = (() => {
		if (params.type === 'financial') return 'Financial Measures';
		if (params.type === 'human') return 'Human Measures';
		if (params.type === 'manufactured') return 'Manufactured Measures';
		if (params.type === 'social') return 'Social Measures';
	})();

	const measures = (() => {
		if (params.type === 'financial') {
			return [
				{ value: 'hocost', label: 'Homeowner Costs' },
				{ value: 'gini', label: 'Gini Index' },
				{ value: 'povfam', label: 'Family Poverty Status' },
				{ value: 'povind', label: 'Individual Poverty Status' },
				{ value: 'medhv', label: 'Median House Value' },
				{ value: 'medinc', label: 'Median Household Income' },
				{ value: 'medrnt', label: 'Median Rent' },
				{ value: 'insure', label: 'No Health Insurance' },
				{ value: 'capinc', label: 'Per Capita Income' },
				{ value: 'rntcost', label: 'Renter Costs' },
				{ value: 'snap', label: 'SNAP' },
				{ value: 'unemp', label: 'Unemployment' }
			];
		}
		if (params.type === 'human') {
			return [
				{ value: 'afram_', label: 'African American' },
				{ value: 'age4_', label: 'Age 0-4' },
				{ value: 'age17_', label: 'Age 5-17' },
				{ value: 'age64_', label: 'Age 18-64' },
				{ value: 'asian', label: 'Asian' },
				{ value: 'chldpt', label: 'Child Ratio' },
				{ value: 'depidx', label: 'Dependency Index' },
				{ value: 'dividx', label: 'Diversity Index' },
				{ value: 'fhh', label: 'Female-Headed Family Households' },
				{ value: 'latino', label: 'Latino or Hispanic' },
				{ value: 'educ', label: 'Less Than High School' },
				{ value: 'min04_', label: 'Minor Population (0-4)' },
				{ value: 'minperc', label: 'Minor Population (0-17)' },
				{ value: 'nonwh', label: 'Non-White' },
				{ value: 'presch', label: 'Preschool' },
				{ value: 'popden', label: 'Population Density' },
				{ value: 'white', label: 'White' }
			];
		}
		if (params.type === 'manufactured') {
			return [
				{ value: 'B1940_', label: 'Housing Built Before 1940' },
				{ value: 'heat', label: 'Inadequate Heating Source ' },
				{ value: 'mhome', label: 'Mobile Homes' },
				{ value: 'rentocc', label: 'Renter-Occupied' },
				{ value: 'vacant', label: 'Vacancy Rate' },
				{ value: 'vehicle', label: 'Vehicle Access' }
			];
		}
		if (params.type === 'social') {
			return [
				{ value: 'lingiso', label: 'Linguistic Isolation' },
				{ value: 'moved', label: 'Moved in the Last Five Years ' },
				{ value: 'movedlast', label: 'Moved in the Last Year' }
			];
		}
	})();

	if (!title) throw error(404);

	return {
		title,
		type: params.type as 'financial' | 'human' | 'manufactured' | 'social',
		indicators: _indicators.filter(({ type }) => type === params.type) as Indiactor[],
		measures,
		helpers: {
			generateChart,
			formatNumber
		}
	};
}) satisfies PageLoad;

export interface Indiactor {
	name: string;
	description: string;
	type: string;
	format: 'dollars' | 'integer' | 'percent' | 'index';
	data: { year: number; value: number | null; county: number }[];
	legend: { color: string; label: string }[];
}
