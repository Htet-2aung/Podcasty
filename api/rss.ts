export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  const { searchParams } = new URL(request.url);
  const feedUrl = searchParams.get('url');

  if (!feedUrl) {
    return new Response('Missing feed URL parameter', { status: 400 });
  }

  try {
    // The server-side fetch is not blocked by CORS
    const response = await fetch(feedUrl);

    if (!response.ok) {
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
      });
    }

    const text = await response.text();

    // Return the raw XML from the feed
    return new Response(text, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        // Add caching to improve performance
        'Cache-Control': 's-maxage=3600, stale-while-revalidate',
      },
    });
  } catch (error) {
    console.error('Error in RSS proxy:', error);
    return new Response('Failed to fetch the RSS feed.', { status: 500 });
  }
}
