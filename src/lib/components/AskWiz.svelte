<script>
    import { tick } from 'svelte';
    import { marked } from 'marked';
    import Arrow from '$lib/images/arrow.svelte';

    let question = "";
    let isLoading = false;
    let hasAsked = false;
    let scrollContainer;
    let conversation = [];
    let currentTypingIndex = -1;

    marked.setOptions({
        breaks: true,
        gfm: true
    });

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

        await tick();
        setTimeout(() => {
            if (scrollContainer) {
                window.scrollTo({
                    top: window.scrollY + window.innerHeight,
                    behavior: 'smooth'
                });
            }
        }, 50);  

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
        const speed = 15;

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

<style>
    /* Styling for markdown content */
    :global(.wiz-response h1) {
        font-size: 1.5em;
        font-weight: bold;
        margin-top: 0.5em;
        margin-bottom: 0.5em;
    }
    
    :global(.wiz-response h2) {
        font-size: 1.3em;
        font-weight: bold;
        margin-top: 0.5em;
        margin-bottom: 0.5em;
    }
    
    :global(.wiz-response h3) {
        font-size: 1.1em;
        font-weight: bold;
        margin-top: 0.5em;
        margin-bottom: 0.5em;
    }
    
    :global(.wiz-response p) {
        margin-bottom: 1em;
    }
    
    :global(.wiz-response ul, .wiz-response ol) {
        margin-left: 1.5em;
        margin-bottom: 1em;
    }
    
    :global(.wiz-response li) {
        margin-bottom: 0.5em;
    }
    
    :global(.wiz-response strong) {
        font-weight: bold;
        color: #1e40af;
    }
    
    :global(.wiz-response em) {
        font-style: italic;
    }
    
    :global(.wiz-response code) {
        background-color: #e0e7ff;
        padding: 0.2em 0.4em;
        border-radius: 0.25em;
        font-family: monospace;
        font-size: 0.9em;
    }
    
    :global(.wiz-response pre) {
        background-color: #1e293b;
        color: #e2e8f0;
        padding: 1em;
        border-radius: 0.5em;
        overflow-x: auto;
        margin-bottom: 1em;
    }
    
    :global(.wiz-response pre code) {
        background-color: transparent;
        padding: 0;
        color: inherit;
    }
    
    :global(.wiz-response blockquote) {
        border-left: 4px solid #3b82f6;
        padding-left: 1em;
        margin-left: 0;
        margin-bottom: 1em;
        font-style: italic;
        color: #475569;
    }
    .wiz-response :global(p) {
        display: inline;
    }
    .wiz-response span {
        display: inline-block;
        vertical-align: middle;
    }
</style>

<!-- Scrollable conversation area -->
<div 
    bind:this={scrollContainer}
    class="flex-1 px-4 transition-all duration-500 {hasAsked ? 'pb-4' : 'pb-0'}"
>
    {#each conversation as item, index}
        <!-- User prompt -->
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

        <!-- Wiz answer -->
        {#if item.displayedAnswer}
            <div class="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-xl shadow-sm mt-4">
                <div class="text-blue-900 font-serif text-lg leading-relaxed">
                    <span class="font-bold block mb-1 text-blue-600">The Wiz says:</span>
                    <div class="wiz-response">
                        {@html marked(item.displayedAnswer)}
                        {#if item.isTyping}
                            <span class="animate-pulse inline-block w-0.5 h-5 bg-blue-400 ml-1">|</span>
                        {/if}
                    </div>

                </div>
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

<!-- Form - sticks to bottom of chat container (not screen) -->
<div 
    class="absolute left-0 right-0 px-4 transition-all duration-500 {hasAsked 
            ? 'bottom-0 sticky z-10 bg-blue-300' 
            : 'top-1/2 -translate-y-1/2 bg-transparent'}"
>
    <div class="pt-4">
        <form on:submit|preventDefault={askWiz} class="relative">
            <textarea
                bind:value={question}
                on:input={(e) => {
                    e.target.style.height = 'auto';
                    e.target.style.height = e.target.scrollHeight + 'px';
                }}
                on:keydown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        askWiz();
                    }
                }}
                placeholder="Ask the Wiz..."
                rows="1"
                class="w-full bg-white border-2 border-blue-500 rounded-2xl p-4 pr-16 font-mono shadow-lg outline-none focus:ring-4 focus:ring-blue-100 resize-none overflow-hidden min-h-[56px] max-h-[200px]"
            ></textarea>
            <button
                type="submit"
                disabled={isLoading}
                class="absolute right-3 bottom-3 bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 disabled:bg-gray-300 transition-all"
            >
                {#if isLoading}
                    <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {:else}
                    <Arrow class="w-5 h-5" />
                {/if}
            </button>
        </form>
    </div>
    <div class="text-center text-xs text-blue-600 py-2">
        <p>WizofCheese is AI and can make mistakes. Please double-check responses.</p>
    </div>
</div>