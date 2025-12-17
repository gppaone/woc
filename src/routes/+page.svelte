<script>
    import woc from '$lib/images/wizofcheeze-site.png';
    import AskWiz from '$lib/components/AskWiz.svelte';
</script>
<div class="flex p-4">
    <div class="hidden md:block w-[width: 25%]">
        <img src={woc} alt="Wiz of Cheese" class="w-full h-full object-cover" />
    </div>
    
    <div class="p-6 w-full md:w-1/2">
        <div class="rounded-xl border border-blue-500 bg-blue-200 items-center justify-center p-4">
            <AskWiz />
        </div>
    </div>
</div>