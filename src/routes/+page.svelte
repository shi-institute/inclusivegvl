<script>
	import { base } from '$app/paths';
</script>

<h1>Community well-being measures</h1>
<p>
	Select an option below to see how measures of well-being in each category have changed over time
	in Greenville and surrounding counties. For more in-depth indicator descriptions, read the
	<a href="{base}/indicator_descriptions.pdf" rel="external">indicator descriptions document</a>.
</p>

<div class="option">
	<a href="{base}/human">Human indiactors</a>
	<p class="option-description">
		Human indicators measure age, race, diversity, education, dependency index, number of children
		per household, population density, preschool enrollment, and single-parent households.
	</p>
</div>

<div class="option">
	<a href="{base}/manufactured">Manufacturing indiactors</a>
	<p class="option-description">
		Manufacturing indicators measure housing built before 1940, inadequate heating sources, mobile
		homes, renter-occupied homes, vacancy rates, and vehicle access.
	</p>
</div>

<div class="option">
	<a href="{base}/financial">Financial indiactors</a>
	<p class="option-description">
		Financial indicators measure homeowner costs, income inequality, median contract rent, median
		house value, median household income, absence of health insurance, per capita income, poverty
		status (family), poverty status (individual), renter costs, SNAP (supplemental nutrition
		assistance programs), and unemployment status.
	</p>
</div>

<div class="option">
	<a href="{base}/social">Social indiactors</a>
	<p class="option-description">
		Social indicators measure linguistic isolation, those who have moved in the last five years
		(1990-2000), and those who have moved in the last year (2010-2016).
	</p>
</div>

<style>
	.option a {
		font-weight: 600;
	}

	.option-description {
		font-style: italic;
		margin-top: 0;
	}
</style>
