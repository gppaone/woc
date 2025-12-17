<script>
    import { tick } from 'svelte';

    let question = "";
    let answer = ""; // The full response from the API
    let displayedAnswer = ""; // What the user actually sees typing out
    let isLoading = false;

    async function askWiz() {
        if (!question || isLoading) return;
        isLoading = true;
        answer = ""; 
        displayedAnswer = "";
        try {
            const response = await fetch('/api/wiz', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: question })
        });
        
        const data = await response.json();
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
            setTimeout(type, speed);
            }
        }
        type();
    }
</script>

<div class="flex flex-col h-full w-full mx-auto p-2">
    <div class="grow overflow-y-auto mb-6 flex flex-col justify-end">
        {#if displayedAnswer}
            <div class="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-xl shadow-sm">
            <p class="text-blue-900 font-serif text-lg leading-relaxed">
                <span class="font-bold block mb-1 text-blue-600">The Wiz says:</span>
                {displayedAnswer}<span class="animate-pulse inline-block w-2 h-5 bg-blue-400 ml-1">|</span>
            </p>
            </div>
        {/if}
        {#if isLoading && !displayedAnswer}
            <div class="flex items-center space-x-2 p-4 text-blue-400 font-mono">
            <span class="animate-bounce">逐</span>
            <span>The Wiz is consulting the curds...</span>
            </div>
        {/if}
    </div>
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