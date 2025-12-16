<script>
	import { onMount } from 'svelte'
	import { rates, loading, error, loadFx } from '$lib/stores/fxStore.js'
	import { monteCarloEndPrice } from '$lib/utils/monteCarlo.js'
	import FxCard from '$lib/components/FxCard.svelte'
	import { fade } from 'svelte/transition'

	const SEARCH_URL_BASE =
		'https://data.fixer.io/api/latest?access_key=d52672f82c5c081c539f6d27da6a785a'

	let projections = null

	let query = ''
	let selectedSymbol = ''
	let searchLoading = false
	let searchError = null
	let searchResult = null

	let showImage = false
	let image = null
	let imageLoading = false

	onMount(() => {
		loadFx()
	})

	$: if ($rates) {
		projections = {
			USD: monteCarloEndPrice($rates.USD),
			GBP: monteCarloEndPrice($rates.GBP),
			DKK: monteCarloEndPrice($rates.DKK),
		}
	}

	async function searchSymbol() {
		searchError = null
		searchResult = null

		let symbol = query.trim().toUpperCase()
		if (selectedSymbol) symbol = selectedSymbol

		if (!symbol) {
			searchError = 'Bitte eine Währung eingeben oder auswählen.'
			return
		}

		searchLoading = true

		try {
			const url = `${SEARCH_URL_BASE}&symbols=${symbol}`
			const res = await fetch(url)
			const data = await res.json()

			if (!data.success) {
				searchError = data.error?.info || 'API-Fehler bei der Suche.'
				return
			}

			if (!data.rates || !data.rates[symbol]) {
				searchError = 'Für dieses Kürzel wurden keine Daten gefunden.'
				return
			}

			const rate = data.rates[symbol]
			const projection = monteCarloEndPrice(rate)

			searchResult = { symbol, rate, projection }
		} catch (e) {
			searchError = e.message
		} finally {
			searchLoading = false
		}
	}

	async function toggleImage() {
		showImage = !showImage
		if (!showImage) return

		imageLoading = true
		image = null

		try {
			const randomPage = Math.floor(Math.random() * 10) + 1

			const res = await fetch(
				`https://api.pexels.com/v1/search?query=landscape&per_page=1&page=${randomPage}`,
				{
					headers: {
						Authorization:
							'cS5UkYoaP41xnBNgokORcTNbdHQ0GXeeSXQ2O47D4MA5yJfqgmuWWn93',
					},
				}
			)

			const data = await res.json()

			if (data.photos.length === 0) {
				image = {
					title: 'Kein Bild gefunden',
					img: null,
				}
			} else {
				const photo = data.photos[0]
				image = {
					title: `Foto von ${photo.photographer}`,
					img: photo.src.large,
				}
			}
		} catch (e) {
			console.error('Pexels API Fehler:', e)
			image = {
				title: 'Fehler beim Laden',
				img: null,
			}
		}

		imageLoading = false
	}
</script>

<h1 class="display-5 fw-bold mb-4 d-flex align-items-center gap-3">
	<i class="bi bi-speedometer2 text-primary"></i>
	Übersicht der Währungen
</h1>

<div class="d-flex justify-content-end mb-4">
	<button class="btn btn-outline-secondary shadow-sm" on:click={toggleImage}>
		{#if showImage}
			<i class="bi bi-x-circle"></i> Zeig das Geld!
		{:else}
			<i class="bi bi-emoji-laughing"></i> Nicht an Währungen interessiert?
		{/if}
	</button>
</div>

{#if $loading}
	<p>Lade Daten…</p>
{:else if $error}
	<p class="text-danger">Fehler: {$error}</p>
{:else}
	<div class="mt-4 mb-4 p-3 bg-white rounded shadow-sm">
		<h4 class="mb-3 d-flex align-items-center gap-2">
			<i class="bi bi-search"></i> Währung suchen
		</h4>

		<form
			class="row gy-2 gx-3 align-items-center"
			on:submit|preventDefault={searchSymbol}
		>
			<div class="col-sm-4">
				<input
					class="form-control"
					bind:value={query}
					placeholder="z.B. CHF, NOK, JPY…"
				/>
			</div>

			<div class="col-sm-4">
				<select class="form-select" bind:value={selectedSymbol}>
					<option value="">Währung wählen…</option>
					<option value="CHF">CHF – Schweizer Franken</option>
					<option value="NOK">NOK – Norwegische Krone</option>
					<option value="SEK">SEK – Schwedische Krone</option>
					<option value="JPY">JPY – Japanischer Yen</option>
					<option value="CAD">CAD – Kanadischer Dollar</option>
					<option value="AUD">AUD – Australischer Dollar</option>
					<option value="PLN">PLN – Polnischer Zloty</option>
					<option value="CZK">CZK – Tschechische Krone</option>
					<option value="HUF">HUF – Ungarischer Forint</option>
				</select>
			</div>

			<div class="col-sm-4">
				<button
					class="btn btn-primary w-100 shadow-sm"
					type="submit"
					disabled={searchLoading}
				>
					{#if searchLoading}
						Suche…
					{:else}
						Suchen
					{/if}
				</button>
			</div>
		</form>

		{#if searchError}
			<p class="text-danger mt-2">{searchError}</p>
		{/if}
	</div>

	<h2 class="mt-5 mb-3 d-flex align-items-center gap-2">
		<i class="bi bi-currency-exchange text-primary"></i>
		Standard Währungen (jeweils EUR Basis)
	</h2>

	<div class="row mt-2">
		<div class="col-md-4 mb-4">
			<FxCard
				symbol="USD"
				rate={$rates.USD}
				projection={projections.USD}
			/>
		</div>

		<div class="col-md-4 mb-4">
			<FxCard
				symbol="GBP"
				rate={$rates.GBP}
				projection={projections.GBP}
			/>
		</div>

		<div class="col-md-4 mb-4">
			<FxCard
				symbol="DKK"
				rate={$rates.DKK}
				projection={projections.DKK}
			/>
		</div>
	</div>

	{#if showImage}
		<div class="row mt-4">
			<div class="col-12 mb-4">
				<div class="card shadow-lg border-0 rounded-4">
					<div class="card-body text-center">
						<h4 class="mb-4">Zufälliges Bild</h4>

						{#if imageLoading}
							<p>Bild wird geladen…</p>
						{:else if image}
							<img
								src={image.img}
								alt="Random art"
								class="img-fluid rounded"
							/>
						{/if}
					</div>
				</div>
			</div>
		</div>
	{/if}

	{#if searchResult}
		<h2 class="mt-4 mb-3 d-flex align-items-center gap-2">
			<i class="bi bi-search text-primary"></i> Suchergebnis
		</h2>
		<div class="row">
			<div class="col-md-4 mb-4">
				<FxCard
					symbol={searchResult.symbol}
					rate={searchResult.rate}
					projection={searchResult.projection}
				/>
			</div>
		</div>
	{/if}
{/if}
