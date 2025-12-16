// @ts-nocheck

const FIXER_URL =
	'https://data.fixer.io/api/latest?access_key=d52672f82c5c081c539f6d27da6a785a&symbols=DKK,USD,GBP'

export async function fetchRates() {
	const res = await fetch(FIXER_URL)

	if (!res.ok) {
		throw new Error('HTTP Fehler beim Laden der Daten')
	}

	const data = await res.json()

	if (!data.success) {
		throw new Error(data.error?.info || 'API Fehler bei Fixer')
	}

	return data.rates
}
