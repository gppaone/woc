<script>
    import { tick } from 'svelte';

    let question = "";
    let answer = ""; // The full response from the API
    let displayedAnswer = ""; // What the user actually sees typing out
    let isLoading = false;
    let hasAsked = false;
    let scrollContainer;

    async function askWiz() {
        if (!question || isLoading) return;
        isLoading = true;
        hasAsked = true;
        answer = ""; 
        displayedAnswer = "";
        try {
            const response = await fetch('/api/wiz', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: question })
        });
        
        const data = await response.json();
        console.log('📦 Full response data:', data);
        if (data.debug) {
            console.error('🐛 Debug info:', data.debug);
        }
        answer = data.response;
        
        // Trigger the typewriter effect
        typeWriter();
        } catch (err) {
            console.error(err);
            displayedAnswer = "The Wiz's crystal ball is foggy. Try again.";
        } finally {
            isLoading = false;
            question = "";
        }
    }

    function typeWriter() {
        let i = 0;
        displayedAnswer = "";
        const speed = 30; // Milliseconds per character

        function type() {
            if (i < answer.length) {
                displayedAnswer += answer.charAt(i);
                i++;
                if(scrollContainer) {
                    scrollContainer.scrollTop = scrollContainer.scrollHeight;
                }
                setTimeout(type, speed);
            }
        }
        type();
    }
</script>

<div class="flex flex-col h-screen w-full mx-auto relative">
    <!-- Scrollable content area -->
    <div 
        bind:this={scrollContainer}
        class="flex-1 px-4 transition-all duration-500 {hasAsked ? 'pb-32' : 'pb-0'}"
    >
        <div class="w-[768px] mx-auto">
            {#if displayedAnswer}
                <div class="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-xl shadow-sm mt-6">
                    <p class="text-blue-900 font-serif text-lg leading-relaxed">
                        <span class="font-bold block mb-1 text-blue-600">The Wiz says:</span>
                        {displayedAnswer}<span class="animate-pulse inline-block w-2 h-5 bg-blue-400 ml-1">|</span>
                    </p>
                </div>
            {/if}
            
            {#if isLoading && !displayedAnswer}
                <div class="flex items-center space-x-2 p-4 text-blue-400 font-mono mt-6">
                    <span class="animate-bounce">🧙</span>
                    <span>The Wiz is consulting the curds...</span>
                </div>
            {/if}
        </div>
    </div>

    <!-- Form - floats and centers when no content -->
    <div 
        class="fixed left-0 right-0 transition-all duration-500 {hasAsked 
            ? 'bottom-0 bg-blue-300' 
            : 'bottom-1/2 translate-y-1/2'}"
    >
        <div class="max-w-3xl mx-auto pt-4">
            <form on:submit|preventDefault={askWiz} class="relative">
                <input
                    bind:value={question}
                    type="text"
                    placeholder="Ask the Wiz..."
                    class="w-full bg-white border-2 border-blue-500 rounded-2xl p-4 pr-16 font-mono shadow-lg outline-none focus:ring-4 focus:ring-blue-100"
                />
                <button
                    type="submit"
                    disabled={isLoading}
                    class="absolute right-3 top-2 bottom-2 bg-blue-500 text-white px-4 rounded-xl hover:bg-blue-600 disabled:bg-gray-300 transition-all"
                >
                    {#if isLoading}
                        <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {:else}
                        Send
                    {/if}
                </button>
            </form>
        </div>
        <div class="text-center text-xs text-blue-800 p-2">
            <p>WizofCheese is AI and can make mistakes. Please double-check responses.</p>
        </div>
    </div>
</div>