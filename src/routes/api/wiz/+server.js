import { json } from '@sveltejs/kit';

export async function POST({ request }) {
    const { prompt } = await request.json();
    try {
        const response = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            body: JSON.stringify({
                model: 'llama3.2',
                prompt: `You are the Wiz of Cheese, a wise and mystical cheese wizard. Answer this question with wisdom and a touch of whimsy: ${prompt}`,
                stream: false
            })
        });

        const data = await response.json();
        return json({ response: data.response });
    } catch (err) {
        console.error('Ollama error:', err);
        return json({ response: "The Wiz is busy consulting the curds. Try again later." }, { status: 500 });
    }
}