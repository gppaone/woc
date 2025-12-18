<script>
    import woc from '$lib/images/wizofcheeze-animated-santa.gif';
    import AskWiz from '$lib/components/AskWiz.svelte';
</script>
<div class="flex p-2 md:p-4 h-screen sm:h-full">
    <!-- Wizard image - sticky on left -->
    <div class="hidden md:block w-[25%] sticky top-4 self-start">
        <img src={woc} alt="Wiz of Cheese" class="w-full" />
    </div>
    
    <!-- Chat container - takes remaining space -->
    <div class="flex-1 flex flex-col w-full md:pl-6 max-w-4xl relative">
        <AskWiz />
    </div>
</div>