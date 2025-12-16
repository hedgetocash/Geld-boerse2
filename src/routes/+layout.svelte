<svelte:head>
	<link
		href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
		rel="stylesheet"
	/>
	<link
		href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css"
		rel="stylesheet"
	/>
</svelte:head>

<nav class="navbar navbar-dark bg-dark shadow-sm py-3">
	<div class="container d-flex justify-content-between">
		<span class="navbar-brand mb-0 h1 d-flex align-items-center gap-2">
			<i class="bi bi-currency-exchange"></i>
			Geld-Börse von Nils
		</span>

		<span class="text-light small opacity-75">
			Daten von Fixer.io API und Pexels API
		</span>
	</div>
</nav>

<main
	class="container py-5"
	style="background-color: #f4f6f9; min-height: 100vh;"
>
	<slot />
</main>
