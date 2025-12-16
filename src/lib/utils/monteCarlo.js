// @ts-nocheck

function randn_bm() {
	let u = 0
	let v = 0
	while (u === 0) u = Math.random()
	while (v === 0) v = Math.random()
	return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
}

export function monteCarloEndPrice(
	S0,
	{ mu = 0.01, sigma = 0.05, T = 1, steps = 252, simulations = 10000 } = {}
) {
	const dt = T / steps
	const results = []

	for (let i = 0; i < simulations; i++) {
		let price = S0
		for (let j = 0; j < steps; j++) {
			const dS = price * (mu * dt + sigma * Math.sqrt(dt) * randn_bm())
			price += dS
		}
		results.push(price)
	}

	const mean = results.reduce((sum, val) => sum + val, 0) / results.length

	const changePercent = ((mean - S0) / S0) * 100

	return {
		mean,
		changePercent,
	}
}
