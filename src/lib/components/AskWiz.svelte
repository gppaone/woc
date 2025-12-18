<script>
    import { tick } from 'svelte';

    let question = "";
    let isLoading = false;
    let hasAsked = false;
    let scrollContainer;
    let conversation = [];
    let currentTypingIndex = -1;

    async function askWiz() {
        if (!question || isLoading) return;
        
        const userPrompt = question;
        question = "";
        isLoading = true;
        hasAsked = true;
        
        // create convo
        conversation = [...conversation, {
            prompt: userPrompt,
            answer: "",
            displayedAnswer: "",
            isTyping: true
        }];
        
        currentTypingIndex = conversation.length - 1;
        
        try {
            const response = await fetch('/api/wiz', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: userPrompt })
            });
            
            const data = await response.json();
            
            conversation[currentTypingIndex].answer = data.response;
            conversation = conversation;
            
            typeWriter(currentTypingIndex);
            
        } catch (err) {
            console.error(err);
            conversation[currentTypingIndex].displayedAnswer = "The Wiz's crystal ball is foggy. Try again.";
            conversation[currentTypingIndex].isTyping = false;
            conversation = conversation;
        } finally {
            isLoading = false;
        }
    }

    function typeWriter(index) {
        let i = 0;
        const answer = conversation[index].answer;
        const speed = 30;

        function type() {
            if (i < answer.length) {
                conversation[index].displayedAnswer += answer.charAt(i);
                conversation = conversation;
                i++;
                
                if (scrollContainer) {
                    scrollContainer.scrollTop = scrollContainer.scrollHeight;
                }
                setTimeout(type, speed);
            } else {
                conversation[index].isTyping = false;
                conversation = conversation;
            }
        }
        type();
    }

    function togglePrompt(index) {
        conversation[index].collapsed = !conversation[index].collapsed;
        conversation = conversation;
    }
</script>

<div class="flex flex-col h-full w-full mx-auto relative">
    <div 
        bind:this={scrollContainer}
        class="flex-1 px-4 transition-all duration-500 {hasAsked ? 'pb-32' : 'pb-0'}"
    >
        <div class="w-auto md:w-[768px] mx-auto">
            {#each conversation as item, index}
                <!-- user prompt -->
                <div class="mt-6">
                    <div class="bg-gray-100 border-l-4 border-gray-400 p-4 rounded-r-xl shadow-sm">
                        <p class="font-bold text-gray-700 mb-1">You asked:</p>
                        {#if item.prompt.length > 100 && item.collapsed !== false}
                            <p class="text-gray-800">
                                {item.prompt.slice(0, 100)}...
                                <button 
                                    on:click={() => togglePrompt(index)}
                                    class="text-blue-500 hover:text-blue-700 ml-2 underline text-sm"
                                >
                                    Show more
                                </button>
                            </p>
                        {:else}
                            <p class="text-gray-800">
                                {item.prompt}
                                {#if item.prompt.length > 100}
                                    <button 
                                        on:click={() => togglePrompt(index)}
                                        class="text-blue-500 hover:text-blue-700 ml-2 underline text-sm"
                                    >
                                        Show less
                                    </button>
                                {/if}
                            </p>
                        {/if}
                    </div>
                </div>

                <!-- wiz answer -->
                {#if item.displayedAnswer}
                    <div class="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-xl shadow-sm mt-4">
                        <p class="text-blue-900 font-serif text-lg leading-relaxed">
                            <span class="font-bold block mb-1 text-blue-600">The Wiz says:</span>
                            {item.displayedAnswer}
                            {#if item.isTyping}
                                <span class="animate-pulse inline-block w-0.5 h-5 bg-blue-400 ml-1">|</span>
                            {/if}
                        </p>
                    </div>
                {/if}
                
                {#if index === currentTypingIndex && isLoading && !item.displayedAnswer}
                    <div class="flex items-center space-x-2 p-4 text-blue-400 font-mono mt-4">
                        <span class="animate-bounce">🧙</span>
                        <span>The Wiz is consulting the curds...</span>
                    </div>
                {/if}
            {/each}
        </div>
    </div>

    <!-- Form - floats and centers when no content -->
    <div 
        class="fixed left-0 right-0 transition-all duration-500 px-4 {hasAsked 
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