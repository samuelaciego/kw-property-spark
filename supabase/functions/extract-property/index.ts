const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PropertyData {
  title: string;
  description: string;
  price: string;
  address: string;
  images: string[];
  agent?: {
    name: string;
    phone: string;
    email: string;
  };
}

Deno.serve(async (req) => {
  console.log('Edge function called with method:', req.method);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    console.log('Request body:', body);
    
    const { url } = body;
    
    if (!url) {
      console.log('No URL provided in request');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'URL is required' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('Extracting property data from:', url);

    // Fetch the webpage
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch page: ${response.status}`);
    }

    const html = await response.text();
    
    // Extract property data using regex and string manipulation
    const propertyData: PropertyData = {
      title: extractTitle(html),
      description: extractDescription(html),
      price: extractPrice(html),
      address: extractAddress(html),
      images: extractImages(html, url),
      agent: extractAgent(html)
    };

    console.log('Extracted property data:', propertyData);

    return new Response(
      JSON.stringify({ success: true, data: propertyData }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error extracting property data:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Failed to extract property data', 
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

function extractTitle(html: string): string {
  // Try multiple selectors for title
  const titlePatterns = [
    /<title[^>]*>([^<]+)<\/title>/i,
    /<h1[^>]*class="[^"]*title[^"]*"[^>]*>([^<]+)<\/h1>/i,
    /<h1[^>]*>([^<]+)<\/h1>/i,
    /property-title[^>]*>([^<]+)</i,
    /listing-title[^>]*>([^<]+)</i
  ];

  for (const pattern of titlePatterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      return match[1].trim().replace(/\s+/g, ' ');
    }
  }

  return 'Propiedad sin título';
}

function extractDescription(html: string): string {
  // Try multiple selectors for description
  const descPatterns = [
    /<meta[^>]*name="description"[^>]*content="([^"]+)"/i,
    /<div[^>]*class="[^"]*description[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
    /<div[^>]*class="[^"]*property-description[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
    /<p[^>]*class="[^"]*description[^"]*"[^>]*>([\s\S]*?)<\/p>/i
  ];

  for (const pattern of descPatterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      return match[1]
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .substring(0, 500);
    }
  }

  return 'Descripción no disponible';
}

function extractPrice(html: string): string {
  // Try multiple patterns for price
  const pricePatterns = [
    /\$[\d,]+(?:\.\d{2})?/g,
    /price[^>]*>[\s\S]*?\$?([\d,]+(?:\.\d{2})?)/i,
    /listing-price[^>]*>[\s\S]*?\$?([\d,]+(?:\.\d{2})?)/i
  ];

  for (const pattern of pricePatterns) {
    const matches = html.match(pattern);
    if (matches) {
      // Get the largest number (likely the main price)
      const prices = matches
        .map(m => m.replace(/[^\d,.]/g, ''))
        .filter(p => p.length > 4)
        .sort((a, b) => parseFloat(b.replace(/,/g, '')) - parseFloat(a.replace(/,/g, '')));
      
      if (prices.length > 0) {
        return `$${prices[0]}`;
      }
    }
  }

  return 'Precio no disponible';
}

function extractAddress(html: string): string {
  // Try multiple patterns for address
  const addressPatterns = [
    /<div[^>]*class="[^"]*address[^"]*"[^>]*>([^<]+)<\/div>/i,
    /<span[^>]*class="[^"]*address[^"]*"[^>]*>([^<]+)<\/span>/i,
    /address[^>]*>([^<]+)</i,
    /location[^>]*>([^<]+)</i
  ];

  for (const pattern of addressPatterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      return match[1].replace(/<[^>]*>/g, '').trim();
    }
  }

  return 'Dirección no disponible';
}

function extractImages(html: string, baseUrl: string): string[] {
  const images: string[] = [];
  const imgPattern = /<img[^>]*src="([^"]+)"[^>]*>/gi;
  
  let match;
  while ((match = imgPattern.exec(html)) !== null) {
    let src = match[1];
    
    // Skip small images, icons, and logos
    if (src.includes('logo') || src.includes('icon') || src.includes('thumb')) {
      continue;
    }
    
    // Convert relative URLs to absolute
    if (src.startsWith('/')) {
      const urlObj = new URL(baseUrl);
      src = `${urlObj.protocol}//${urlObj.host}${src}`;
    } else if (src.startsWith('./')) {
      src = new URL(src, baseUrl).toString();
    }
    
    // Only include images from the same domain or CDNs
    if (src.startsWith('http')) {
      images.push(src);
    }
  }

  // Remove duplicates and limit to first 10 images
  return [...new Set(images)].slice(0, 10);
}

function extractAgent(html: string): PropertyData['agent'] {
  const agent = {
    name: 'Agente no disponible',
    phone: '',
    email: ''
  };

  // Try to extract agent name
  const namePatterns = [
    /agent[^>]*name[^>]*>([^<]+)</i,
    /realtor[^>]*>([^<]+)</i,
    /contact[^>]*agent[^>]*>([^<]+)</i
  ];

  for (const pattern of namePatterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      agent.name = match[1].trim();
      break;
    }
  }

  // Try to extract phone
  const phonePattern = /(\(\d{3}\)\s*\d{3}-\d{4}|\d{3}-\d{3}-\d{4}|\d{10})/;
  const phoneMatch = html.match(phonePattern);
  if (phoneMatch) {
    agent.phone = phoneMatch[1];
  }

  // Try to extract email
  const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const emailMatch = html.match(emailPattern);
  if (emailMatch) {
    agent.email = emailMatch[0];
  }

  return agent;
}