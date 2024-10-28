// src/utils/authUtils.js

import { jwtDecode } from 'jwt-decode';

/**
 * Sets a cookie with the specified name, value, and options.
 * 
 * @param {string} name - The name of the cookie.
 * @param {string} value - The value of the cookie.
 * @param {Object} [options={}] - Optional cookie attributes.
 * @throws {Error} Will throw an error if the cookie name is invalid or if the expires option is not a Date object.
 */
export function setCookie(name, value, options = {}) {
    // Validate cookie name
    if (!name || /[;=\s]/.test(name)) {
        throw new Error('Invalid cookie name');
    }

    // Set a default expiration date if not provided
    if (options.expires) {
        if (!(options.expires instanceof Date)) {
            throw new Error('Expires must be a Date object');
        }
    } else {
       // Set expiration to 1 hour from now if not provided
        const expirationDate = new Date();
        expirationDate.setMinutes(expirationDate.getMinutes() + 60); // Add 60 minutes (1 hour)
        options.expires = expirationDate; // Assign the calculated expiration date
    }

    // Construct cookie string
    let cookieString = `${name}=${encodeURIComponent(value)}; path=/`;
    cookieString += `; expires=${options.expires.toUTCString()}`; // Ensure it's a Date object

    // Append security options to the cookie string
    if (options.secure && window.location.protocol === 'https:') {
        cookieString += '; Secure';
    }
    if (options.httpOnly) {
        console.warn("HttpOnly can't be set via JavaScript. Set it on the server.");
    }
    if (options.sameSite) {
        cookieString += `; SameSite=${options.sameSite}`;
    } else {
        cookieString += '; SameSite=Lax'; // Default to Lax if not specified
    }

    // Set the cookie
    document.cookie = cookieString;
}

/**
 * Calculates the expiration date from a JWT token.
 * 
 * @param {string} token - The JWT token.
 * @returns {Date|null} The expiration date as a Date object, or null if the token is invalid.
 */
export function calculateExpirationFromToken(token) {
    try {
        const decoded = jwtDecode(token); // Decode the token (no verification)
        if (decoded && decoded.exp) {
            return new Date(decoded.exp * 1000); // JWT exp is in seconds, convert to milliseconds
        }
    } catch (error) {
        console.error("Error decoding token:", error);
    }
    return null;
}

/**
 * Gets the value of a specified cookie.
 * 
 * @param {string} name - The name of the cookie to retrieve.
 * @returns {string|null} The cookie value, or null if not found.
 */
export function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);

    if (parts.length === 2) {
        const cookieValue = decodeURIComponent(parts.pop().split(';').shift());
        return cookieValue;
    }
    return null;
}
