/**
 * Format date string to Vietnamese locale
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted date string or 'N/A' if invalid
 */
export function formatDate(dateString) {
    if (!dateString) return 'N/A';
    
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    } catch (error) {
        console.error('Error formatting date:', error);
        return 'N/A';
    }
}

/**
 * Format time remaining in MM:SS format
 * @param {number} milliseconds - Time in milliseconds
 * @returns {string} - Formatted time string in MM:SS format
 */
export function formatTimeRemaining(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
