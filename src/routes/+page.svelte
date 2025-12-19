<script>
    import woc from '$lib/images/wizofcheeze-animated-santa.gif';
    import woc2 from '$lib/images/wizofcheeze-animated-santa-oh.gif';
    import AskWiz from '$lib/components/AskWiz.svelte';

    let isThinking = false;
    
    function handleLoadingChange(loading) {
        isThinking = loading;
    }
</script>
<div class="flex p-2 md:p-4 h-screen sm:h-full">
    <!-- Wizard image - sticky on left -->
    <div class="hidden md:block w-[25%] sticky top-4 self-start">
        <img 
        src={isThinking ? woc2 : woc} 
        alt="Wiz of Cheese" 
        class="w-full transition-opacity duration-300" 
    />
    </div>
    
    <!-- Chat container - takes remaining space -->
    <div class="flex-1 flex flex-col w-full md:pl-6 max-w-4xl relative">
        <AskWiz onLoadingChange={handleLoadingChange} />
    </div>
</div>