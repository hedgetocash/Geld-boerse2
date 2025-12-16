import adapter from '@sveltejs/adapter-static'

const repoName = 'Geld-boerse2'

export default {
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: 'index.html',
		}),
		paths: {
			base: `/${repoName}`,
		},
	},
}
