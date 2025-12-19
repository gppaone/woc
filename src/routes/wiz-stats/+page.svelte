<script>
    import { onMount } from 'svelte';
    
    let stats = { totalPrompts: 0, uniqueVisitors: 0, recentPrompts: [] };
    let loading = true;
    
    onMount(async () => {
        try {
            const response = await fetch('/api/stats');
            stats = await response.json();
        } catch (error) {
            console.error('Failed to load stats:', error);
        } finally {
            loading = false;
        }
    });
</script>

<div class="max-w-4xl mx-auto p-8">
    <h1 class="text-3xl font-bold mb-8">Wiz of Cheese Analytics</h1>
    
    {#if loading}
        <p>Loading stats...</p>
    {:else}
        <div class="grid grid-cols-2 gap-4 mb-8">
            <div class="bg-blue-50 p-6 rounded-xl border-2 border-blue-200">
                <p class="text-4xl font-bold text-blue-600">{stats.totalPrompts}</p>
                <p class="text-gray-600">Total Questions Asked</p>
            </div>
            <div class="bg-green-50 p-6 rounded-xl border-2 border-green-200">
                <p class="text-4xl font-bold text-green-600">{stats.uniqueVisitors}</p>
                <p class="text-gray-600">Unique Visitors</p>
            </div>
        </div>
        
        <h2 class="text-2xl font-bold mb-4">Recent Questions</h2>
        <div class="space-y-4">
            {#each stats.recentPrompts as item}
                <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p class="font-mono text-sm text-gray-500 mb-2">
                        {new Date(item.timestamp).toLocaleString()} • IP: {item.ip}
                    </p>
                    <p class="text-gray-800">{item.prompt}</p>
                </div>
            {/each}
        </div>
    {/if}
</div>