<script>
    import woc from '$lib/images/wizofcheeze01-animated.gif';
    import AskWiz from '$lib/components/AskWiz.svelte';
</script>
<div class="flex p-4">
    <div class="hidden md:block w-[25%] items-center justify-center sticky top-0 self-start">
        <img src={woc} alt="Wiz of Cheese" class="w-full" />
    </div>
    
    <div class="p-6 w-full md:w-1/2">
        <AskWiz />
    </div>
</div>