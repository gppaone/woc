import { json } from '@sveltejs/kit';

export async function POST({ request }) {
    const { prompt } = await request.json();
    console.log('Received prompt:', prompt);
    try {
        console.log('Attempting to connect to Ollama...');
        const response = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            body: JSON.stringify({
                model: 'llama3.2',
                prompt: `You are the Wiz of Cheese, a wise and mystical cheese wizard. Answer this question with wisdom and a touch of whimsy: ${prompt}`,
                stream: false
            })
        });

        console.log('Ollama response status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Ollama error response:', errorText);
            throw new Error(`Ollama returned ${response.status}: ${errorText}`);
        }
        
        const data = await response.json();
        console.log('Ollama response data:', data);
        
        return json({ response: data.response });
    } catch (error) {
        console.error('Full error object:', error);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);

        return json({ 
            response: 'The Wiz is temporarily indisposed.',
            error: error.message 
        }, { status: 500 });
    }
}