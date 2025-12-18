<script>
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';    
    import WocLogo from '$lib/images/woc-logo.svelte';

	let { children } = $props();
</script>
<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<header class="flex justify-between items-center px-4 py-2 m-0">
    <div class="flex items-center gap-4 font-mono text-2xl font-bold tracking-tighter text-blue-500">
        <WocLogo class="w-12 h-12" />
        <a href="/" class="block">WizofCheese</a>
    </div>
    <nav>
        <ul class="flex items-center gap-4">
            <li><a href="/" class="text-blue-500 hover:text-blue-600 hover:underline">Home</a></li>
            <!-- <li><a href="/projects" class="text-blue-500 hover:text-blue-600 hover:underline">Projects</a></li>
            <li><a href="/contact" class="text-blue-500 hover:text-blue-600 hover:underline">Contact</a></li> -->
        </ul>
    </nav>
</header>
<main>{@render children()}</main>