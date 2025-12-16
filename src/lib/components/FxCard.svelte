<script>
	import { fade } from 'svelte/transition'
	export let symbol
	export let rate
	export let projection
</script>

<div class="card shadow-sm border-0 rounded-4 p-3" transition:fade>
	<div class="card-body">
		<h4 class="card-title fw-bold">{symbol}</h4>

		<p class="card-text">
			<span class="text-muted">Aktueller Kurs:</span>
			<span class="fw-semibold"> {rate} </span>
		</p>

		{#if projection}
			<p class="card-text mb-1 text-muted">Monte-Carlo (1 Jahr):</p>
			<p class="card-text">
				Erwartet:
				<strong>{projection.mean.toFixed(4)}</strong>
			</p>

			<p
				class="card-text"
				style="color: {projection.changePercent >= 0
					? 'green'
					: 'red'};"
			>
				Veränderung: {projection.changePercent.toFixed(2)}%
			</p>
		{/if}
	</div>
</div>
