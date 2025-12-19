import { json } from '@sveltejs/kit';

const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://localhost:11434';
const LOG_FILE = path.join(process.cwd(), 'logs', 'wiz-analytics.jsonl');

// logging
try {
    if (!fs.existsSync(path.join(process.cwd(), 'logs'))) {
        fs.mkdirSync(path.join(process.cwd(), 'logs'), { recursive: true });
    }
} catch (err) {
    console.error('Failed to create logs directory:', err);
}

function logInteraction(data) {
    try {
        const logEntry = {
            timestamp: new Date().toISOString(),
            ...data
        };
        fs.appendFileSync(LOG_FILE, JSON.stringify(logEntry) + '\n');
    } catch (err) {
        console.error('Failed to write log:', err);
    }
}

export async function POST({ request }) {
    let body;
    try {
        body = await request.json();
        console.log('Received request:', body);
    } catch (e) {
        console.error('❌ Failed to parse request body:', e);
        return json({ response: 'Invalid request', error: e.message }, { status: 400 });
    }
    
    const { prompt, conversationHistory } = body;

    logInteraction({
        ip: clientIP,
        prompt: prompt,
        conversationLength: conversationHistory?.length || 0
    });
    
    try {
        console.log(`🔌 Connecting to Ollama at ${OLLAMA_HOST}...`);
        
        // Build the full conversation context
        let fullPrompt = `You are the Wiz of Cheese, a wise and mystical cheese wizard. Answer questions with wisdom and a touch of whimsy.

        Use markdown formatting in your response:
        - Use **bold** for emphasis
        - Use bullet points or numbered lists when appropriate
        - Break into paragraphs for readability
        - Use headings (##) if discussing multiple topics

        `;

        // Add conversation history if it exists
        if (conversationHistory && conversationHistory.length > 0) {
            fullPrompt += "Previous conversation:\n\n";
            conversationHistory.forEach(item => {
                fullPrompt += `User: ${item.prompt}\n`;
                fullPrompt += `Wiz: ${item.answer}\n\n`;
            });
        }
        
        fullPrompt += `Current question: ${prompt}`;
        
        const response = await fetch(`${OLLAMA_HOST}/api/generate`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama3.2',
                prompt: fullPrompt,
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
        console.log('Got response from Ollama');

        logInteraction({
            ip: clientIP,
            type: 'response',
            responseLength: data.response.length
        });

        return json({ response: data.response });
        
    } catch (error) {
        console.error('❌ Error:', error.message);

        logInteraction({
            ip: clientIP,
            type: 'error',
            error: error.message
        });
        
        return json({ 
            response: 'The Wiz is temporarily indisposed.',
            error: error.message
        }, { status: 500 });
    }
}