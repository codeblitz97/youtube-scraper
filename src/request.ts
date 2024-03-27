export async function sendRequest(
  url: string,
  type: 'HTML' | 'JSON' = 'HTML',
  method: string = 'GET',
  body?: any
): Promise<any> {
  const headers = new Headers();
  headers.append(
    'User-Agent',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.101 Safari/537.36'
  );

  const options: RequestInit = {
    method,
    headers,
    mode: 'cors',
    cache: 'default',
  };

  if (body) {
    options.body = JSON.stringify(body);
    headers.append('Content-Type', 'application/json');
  }

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return type === 'JSON' ? await response.json() : await response.text();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
