<script>
    import { onMount } from 'svelte';
    import woc from '$lib/images/wizofcheeze-animated-santa.gif';
    import woc2 from '$lib/images/wizofcheeze-animated-santa-oh.gif';
    import AskWiz from '$lib/components/AskWiz.svelte';

    let isThinking = false;
    let isMobileLandscape = false;
    let hasResponse = false;

    onMount(() => {
        const checkOrientation = () => {
        // Mobile landscape: width > height and width < 768px (md breakpoint)
        isMobileLandscape = window.innerWidth < 768 && window.innerWidth > window.innerHeight;
        };
        
        checkOrientation();
        window.addEventListener('resize', checkOrientation);
        
        return () => window.removeEventListener('resize', checkOrientation);
    });

    function handleLoadingChange(loading) {
        isThinking = loading;
    }

    const handleResponseChange = (hasResponseValue) => {
        hasResponse = hasResponseValue;
    };
</script>
<div class="flex p-2 md:p-4 h-screen sm:h-full">
    <!-- Desktop: Wizard image - sticky on left -->
    <div class="hidden md:block w-[25%] sticky top-4 self-start">
      <img 
        src={isThinking ? woc2 : woc} 
        alt="Wiz of Cheese" 
        class="w-full transition-opacity duration-300" 
      />
    </div>
    
    <!-- Chat container - takes remaining space -->
    <div class="flex-1 flex flex-col w-full md:pl-6 max-w-4xl relative">
      <!-- Mobile portrait: Wizard above prompt (hidden after response) -->
      {#if !isMobileLandscape && !hasResponse}
        <div class="md:hidden flex justify-center mb-4">
          <img 
            src={isThinking ? woc2 : woc} 
            alt="Wiz of Cheese" 
            class="w-48 transition-opacity duration-300" 
          />
        </div>
      {/if}
      
      <AskWiz onLoadingChange={handleLoadingChange} onResponseChange={handleResponseChange} />
    </div>
  </div>