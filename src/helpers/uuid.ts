export function generateUUID(): string {
    // Helper function to generate a random hexadecimal digit
    function randomHexDigit(): string {
        return Math.floor(Math.random() * 16).toString(16);
    }

    // Create a UUID format template with placeholders
    const uuidTemplate = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';

    // Replace placeholders with random hexadecimal digits
    const uuid = uuidTemplate.replace(/[xy]/g, (char) => {
        const randomValue = randomHexDigit();
        // Ensure the correct format for the UUID version and variant
        if (char === 'x') {
            return randomValue;
        } else if (char === 'y') {
            // Ensure the correct variant (8, 9, A, or B)
            return (parseInt(randomValue, 16) & 0x3 | 0x8).toString(16);
        }
        return randomValue;
    });

    return uuid;
}
