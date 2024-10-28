import { v4 as uuidv4 } from 'uuid';

/**
 * Generates a new session ID using UUID.
 * @returns {string} The generated session ID.
 */
export function generateSessionId() {
    return uuidv4(); // Use UUID v4 to generate session ID
}

/**
 * Retrieves the session ID, checking for a cookie, localStorage, or generating a new one if none exist.
 * @returns {string} The session ID.
 */
export function getSessionId() {
    // Check for sessionId in cookies or localStorage
    const sessionId = document.cookie.split('; ').find(row => row.startsWith('sessionId='));
    if (sessionId) {
        return sessionId.split('=')[1];
    } 

    // If no sessionId found, generate a new one and store it in a cookie
    const newSessionId = uuidv4();
    document.cookie = `sessionId=${newSessionId}; path=/; SameSite=Strict; Secure`;
    return newSessionId;
}
