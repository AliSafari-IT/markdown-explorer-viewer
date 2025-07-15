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
/**
 * Helper function to fetch content with multiple fallback URL formats
 * @param baseUrl The primary URL to try
 * @returns The markdown content
 */
async function fetchWithFallbacks(baseUrl: string): Promise<string> {
  console.log(`Trying URL: ${baseUrl}`);
  
  try {
    // First attempt with the provided URL
    const response = await fetch(baseUrl);
    
    if (response.ok) {
      const data = await response.json();
      return data.content || '';
    }
    
    // Extract filename for fallback attempts
    const urlParts = baseUrl.split('/');
    const filename = urlParts[urlParts.length - 1];
    
    // Try alternate URL format with just the filename
    const alternateUrl = `http://localhost:3011/api/md-docs/${filename}`;
    console.log(`Trying alternate URL: ${alternateUrl}`);
    const alternateResponse = await fetch(alternateUrl);
    
    if (alternateResponse.ok) {
      const data = await alternateResponse.json();
      return data.content || '';
    }
    
    // Try a third format without any path prefix
    const rootUrl = `http://localhost:3011/api/md-docs`;
    console.log(`Trying root URL: ${rootUrl}`);
    const rootResponse = await fetch(rootUrl);
    
    if (rootResponse.ok) {
      const data = await rootResponse.json();
      return data.content || '';
    }
    
    throw new Error(`Failed to fetch content from any URL format for: ${baseUrl}`);
  } catch (error) {
    console.error(`Error in fetchWithFallbacks for ${baseUrl}:`, error);
    throw error;
  }
}

/**
 * Fetch markdown content from a file path
 * @param filePath Path to the markdown file
 * @returns Promise with the markdown content
 */
export async function fetchMarkdownContent(filePath: string): Promise<string> {
  try {
    console.log(`Fetching markdown content for path: ${filePath}`);
    
    let normalizedPath = filePath;
    if (!normalizedPath.startsWith('/')) {
      normalizedPath = `/${normalizedPath}`;
    }
    
    // Special handling for changelog.md - try multiple formats
    if (normalizedPath === '/changelog.md' || 
        normalizedPath === 'changelog.md' || 
        normalizedPath.endsWith('/changelog.md')) {
      console.log('Special handling for changelog.md');
      const apiUrl = `http://localhost:3011/api/md-docs/changelog.md`;
      console.log(`Using URL for changelog.md: ${apiUrl}`);
      return await fetchWithFallbacks(apiUrl);
    }
    
    // Special handling for README.md
    if (normalizedPath === '/README.md') {
      const apiUrl = `http://localhost:3011/api/md-docs/README.md`;
      console.log(`Using URL for README.md: ${apiUrl}`);
      return await fetchWithFallbacks(apiUrl);
    }
    
    // Standard path handling
    const apiUrl = `http://localhost:3011/api/md-docs${normalizedPath}`;
    console.log(`Using standard URL: ${apiUrl}`);
    return await fetchWithFallbacks(apiUrl);
  } catch (error) {
    console.error('Error fetching markdown content:', error);
    return `# Error Loading Content\n\nFailed to load content for: ${filePath}\n\nError: ${error}`;
  }
}


