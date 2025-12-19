import { json } from '@sveltejs/kit';
import fs from 'fs';
import path from 'path';

const LOG_FILE = path.join(process.cwd(), 'logs', 'wiz-analytics.jsonl');

export async function GET() {
    try {
        if (!fs.existsSync(LOG_FILE)) {
            return json({ totalPrompts: 0, uniqueVisitors: 0, recentPrompts: [] });
        }
        
        const logs = fs.readFileSync(LOG_FILE, 'utf-8')
            .split('\n')
            .filter(line => line.trim())
            .map(line => JSON.parse(line));
        
        const prompts = logs.filter(log => log.prompt);
        const uniqueIPs = new Set(logs.map(log => log.ip));
        
        const stats = {
            totalPrompts: prompts.length,
            uniqueVisitors: uniqueIPs.size,
            recentPrompts: prompts.slice(-10).reverse().map(p => ({
                timestamp: p.timestamp,
                prompt: p.prompt.substring(0, 100) + (p.prompt.length > 100 ? '...' : ''),
                ip: p.ip.substring(0, 10) + '...' // Partial IP for privacy
            }))
        };
        
        return json(stats);
    } catch (error) {
        console.error('Error reading stats:', error);
        return json({ error: 'Failed to load stats' }, { status: 500 });
    }
}