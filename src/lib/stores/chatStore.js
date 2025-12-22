import { writable } from 'svelte/store';

export const chatReset = writable(0);

export function resetChat() {
    chatReset.update(n => n + 1);
}