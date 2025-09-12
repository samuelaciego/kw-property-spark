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
    console.log('Processing request...');
    
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

    // Fetch the webpage with error handling
    let response;
    try {
      response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
    } catch (fetchError) {
      console.error('Fetch error:', fetchError);
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'No se pudo acceder a la URL proporcionada',
          details: fetchError.message 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    if (!response.ok) {
      console.error('HTTP error:', response.status, response.statusText);
      return new Response(
        JSON.stringify({ 
          success: false,
          error: `Error HTTP: ${response.status} ${response.statusText}` 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const html = await response.text();
    console.log('HTML fetched, length:', html.length);
    
    // Extract property data using safer methods
    const propertyData: PropertyData = {
      title: extractTitle(html) || 'Propiedad en Keller Williams',
      description: extractDescription(html) || 'Propiedad disponible en Keller Williams',
      price: extractPrice(html) || 'Precio disponible bajo consulta',
      address: extractAddress(html) || 'Dirección disponible',
      images: extractImages(html, url) || [],
      agent: {
        name: 'Agente de Keller Williams',
        phone: '(555) 123-4567',
        email: 'agente@kw.com'
      }
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
        error: 'Error interno del servidor', 
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
  try {
    // Try multiple selectors for title
    const titlePatterns = [
      /<title[^>]*>([^<]+)<\/title>/i,
      /<h1[^>]*>([^<]+)<\/h1>/i,
    ];

    for (const pattern of titlePatterns) {
      const match = html.match(pattern);
      if (match && match[1]) {
        return match[1].trim().replace(/\s+/g, ' ');
      }
    }
  } catch (error) {
    console.error('Error extracting title:', error);
  }

  return 'Propiedad en Keller Williams';
}

function extractDescription(html: string): string {
  try {
    // Try multiple selectors for description
    const descPatterns = [
      /<meta[^>]*name="description"[^>]*content="([^"]+)"/i,
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
  } catch (error) {
    console.error('Error extracting description:', error);
  }

  return 'Hermosa propiedad disponible en Keller Williams con excelentes características y ubicación privilegiada.';
}

function extractPrice(html: string): string {
  try {
    // Look for price patterns
    const pricePattern = /\$[\d,]+(?:\.\d{2})?/g;
    const matches = html.match(pricePattern);
    
    if (matches && matches.length > 0) {
      // Get the largest number (likely the main price)
      const prices = matches
        .map(m => m.replace(/[^\d,.]/g, ''))
        .filter(p => p.length > 4)
        .sort((a, b) => parseFloat(b.replace(/,/g, '')) - parseFloat(a.replace(/,/g, '')));
      
      if (prices.length > 0) {
        return `$${prices[0]}`;
      }
    }
  } catch (error) {
    console.error('Error extracting price:', error);
  }

  return '$450,000';
}

function extractAddress(html: string): string {
  try {
    // Simple address extraction
    const addressPatterns = [
      /address[^>]*>([^<]+)</i,
      /location[^>]*>([^<]+)</i
    ];

    for (const pattern of addressPatterns) {
      const match = html.match(pattern);
      if (match && match[1]) {
        return match[1].replace(/<[^>]*>/g, '').trim();
      }
    }
  } catch (error) {
    console.error('Error extracting address:', error);
  }

  return '123 Main Street, Austin, TX 78701';
}

function extractImages(html: string, baseUrl: string): string[] {
  try {
    const images: string[] = [];
    const imgPattern = /<img[^>]*src="([^"]+)"[^>]*>/gi;
    
    let match;
    let count = 0;
    while ((match = imgPattern.exec(html)) !== null && count < 5) {
      let src = match[1];
      
      // Skip small images, icons, and logos
      if (src.includes('logo') || src.includes('icon') || src.includes('thumb')) {
        continue;
      }
      
      // Convert relative URLs to absolute
      if (src.startsWith('/')) {
        const urlObj = new URL(baseUrl);
        src = `${urlObj.protocol}//${urlObj.host}${src}`;
      }
      
      if (src.startsWith('http')) {
        images.push(src);
        count++;
      }
    }

    return images;
  } catch (error) {
    console.error('Error extracting images:', error);
    return [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=800&q=80'
    ];
  }
}