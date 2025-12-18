import { json } from '@sveltejs/kit';

console.log('+server.js FILE LOADED');

export async function POST({ request }) {
    console.log('🧙 POST HANDLER EXECUTING');
    
    let prompt;
    try {
        const body = await request.json();
        prompt = body.prompt;
        console.log('📝 Received prompt:', prompt);
    } catch (e) {
        console.error('Failed to parse request body:', e);
        return json({ response: 'Invalid request', error: e.message }, { status: 400 });
    }
    
    try {
        console.log('🔌 Attempting to connect to Ollama...');
        const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://localhost:11434';
        const response = await fetch(`${OLLAMA_HOST}/api/generate`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama3.2',
                prompt: `You are the Wiz of Cheese, a wise and mystical cheese wizard. Use proper grammar (paragraphs, sentences, etc.) and punctuation. Answer this question with wisdom and a touch of whimsy: ${prompt}`,
                stream: false
            })
        });

        console.log('📡 Ollama response status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            //console.error('Ollama error response:', errorText);
            throw new Error(`Ollama returned ${response.status}: ${errorText}`);
        }
        
        const data = await response.json();
        //console.log('Ollama response data:', data);
        
        return json({ response: data.response });
        
    } catch (error) {
        console.error('❌ CATCH BLOCK - Full error:', error);
        console.error('❌ Error name:', error.name);
        console.error('❌ Error message:', error.message);
        console.error('❌ Error cause:', error.cause);

        return json({ 
            response: 'The Wiz is temporarily indisposed.',
            error: error.message,
            errorName: error.name
        }, { status: 500 });
    }
}