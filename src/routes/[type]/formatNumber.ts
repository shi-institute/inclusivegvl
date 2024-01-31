/**
 * Format's a number a dollar value, an integer, a percent, or an index.
 */
export function formatNumber(value: number, format: 'dollars' | 'integer' | 'percent' | 'index') {
	if (!value) return 'Insufficient Data';

	if (format === 'dollars') {
		const formatter = new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 0
		});
		const roundedValue = Math.round(value);
		return formatter.format(roundedValue);
	}

	if (format == 'integer') {
		const formatter = new Intl.NumberFormat('en-US', {
			minimumFractionDigits: 0
		});
		const roundedValue = Math.round(value);
		return formatter.format(roundedValue);
	}

	if (format == 'percent') {
		const percent = value.toFixed(1) + '%';
		return percent;
	}

	if (format == 'index') {
		const percent = value.toFixed(3);
		return percent;
	}
}
