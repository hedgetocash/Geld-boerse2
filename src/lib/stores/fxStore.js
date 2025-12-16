import { writable } from 'svelte/store'
import { fetchRates } from '../api/fx.js'

export const rates = writable(null)
export const loading = writable(true)
export const error = writable(null)

export async function loadFx() {
	loading.set(true)
	error.set(null)

	try {
		const data = await fetchRates()
		rates.set(data)
	} catch (e) {
		error.set(e.message)
	} finally {
		loading.set(false)
	}
}
