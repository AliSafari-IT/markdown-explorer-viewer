/**
 * Custom content fetcher for markdown files
 * This fetcher handles loading markdown content from the server
 * It supports both relative and absolute paths
 */

/**
 * Fetch markdown content from a file path
 * @param filePath Path to the markdown file
 * @returns Promise with the markdown content
 */
export async function fetchMarkdownContent(filePath: string): Promise<string> {
  try {
    // Build the API URL for fetching content
    const apiUrl = `http://localhost:3011/api/docs${filePath}`;
    
    console.log(`Fetching content from: ${apiUrl}`);
    
    // Fetch the content from the API
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch markdown content: ${response.status} ${response.statusText}`);
    }
    
    // Parse the JSON response and extract content
    const data = await response.json();
    return data.content || '';
  } catch (error) {
    console.error('Error fetching markdown content:', error);
    return `# Error Loading Content\n\nFailed to load content for: ${filePath}\n\nError: ${error}`;
  }
}


