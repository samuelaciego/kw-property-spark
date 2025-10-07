import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { corsHeaders } from "../_shared/cors.ts";

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const cloudflareAccountId = Deno.env.get('CLOUDFLARE_ACCOUNT_ID')!;
const cloudflareApiToken = Deno.env.get('CLOUDFLARE_API_TOKEN')!;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { propertyId } = await req.json();
    console.log('Generating social images for property:', propertyId);

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch property data
    const { data: property, error: propertyError } = await supabase
      .from('properties')
      .select('*')
      .eq('id', propertyId)
      .single();

    if (propertyError || !property) {
      throw new Error(`Property not found: ${propertyError?.message}`);
    }

    // Fetch profile data
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', property.user_id)
      .single();

    if (profileError) {
      console.warn('Profile not found:', profileError.message);
    }

    // Generate HTML template for each platform
    const generateHTML = (platform: string, width: number, height: number) => {
      const isSquare = width === height;
      const isVertical = height > width;
      const mainImage = property.images?.[0] || '';
      const secondImage = property.images?.[1] || '';
      const thirdImage = property.images?.[2] || '';

      return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      width: ${width}px; 
      height: ${height}px; 
      font-family: Arial, sans-serif;
      background: linear-gradient(135deg, #f5f5f5 0%, #e5e5e5 100%);
      display: flex;
      flex-direction: column;
    }
    .header {
      background: #dc2626;
      color: white;
      padding: ${isVertical ? '25px' : '20px'};
      font-size: ${isVertical ? '42px' : isSquare ? '38px' : '32px'};
      font-weight: bold;
      text-align: center;
      text-transform: uppercase;
      letter-spacing: 2px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .badge {
      background: white;
      color: #dc2626;
      padding: ${isVertical ? '8px 20px' : '6px 16px'};
      font-size: ${isVertical ? '20px' : '16px'};
      border-radius: 20px;
      display: inline-block;
      margin-top: 10px;
      font-weight: bold;
    }
    .content {
      flex: 1;
      display: flex;
      ${isVertical ? 'flex-direction: column;' : 'flex-direction: row;'}
      gap: ${isSquare ? '15px' : '20px'};
      padding: ${isVertical ? '20px' : '15px'};
    }
    .main-section {
      ${isVertical ? 'flex: 0 0 55%;' : isSquare ? 'flex: 0 0 65%;' : 'flex: 0 0 60%;'}
      display: flex;
      flex-direction: column;
      gap: ${isVertical ? '15px' : '12px'};
    }
    .main-image {
      flex: 1;
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    .main-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .info-section {
      ${isVertical ? 'flex: 1;' : isSquare ? 'flex: 0 0 32%;' : 'flex: 0 0 38%;'}
      display: flex;
      flex-direction: column;
      gap: ${isVertical ? '15px' : '12px'};
    }
    .price-box {
      background: white;
      padding: ${isVertical ? '25px' : '20px'};
      border-radius: 12px;
      text-align: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    .price {
      font-size: ${isVertical ? '42px' : isSquare ? '36px' : '32px'};
      font-weight: bold;
      color: #dc2626;
      margin-bottom: 10px;
    }
    .address {
      font-size: ${isVertical ? '18px' : '15px'};
      color: #666;
      line-height: 1.4;
    }
    .gallery {
      display: ${isVertical ? 'grid' : 'flex'};
      ${isVertical ? 'grid-template-columns: 1fr 1fr;' : 'flex-direction: column;'}
      gap: ${isVertical ? '15px' : '12px'};
      flex: 1;
    }
    .gallery-item {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      ${!isVertical ? 'flex: 1;' : ''}
    }
    .gallery-item img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .footer {
      background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
      color: white;
      padding: ${isVertical ? '25px' : '20px'};
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 -4px 6px rgba(0,0,0,0.1);
    }
    .agent-info {
      display: flex;
      align-items: center;
      gap: 15px;
    }
    .agent-avatar {
      width: ${isVertical ? '70px' : '60px'};
      height: ${isVertical ? '70px' : '60px'};
      border-radius: 50%;
      background: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: ${isVertical ? '32px' : '28px'};
      font-weight: bold;
      color: #dc2626;
      border: 3px solid white;
    }
    .agent-details {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
    .agent-name {
      font-size: ${isVertical ? '22px' : '18px'};
      font-weight: bold;
    }
    .agent-contact {
      font-size: ${isVertical ? '16px' : '14px'};
      opacity: 0.9;
    }
    .qr-placeholder {
      width: ${isVertical ? '80px' : '70px'};
      height: ${isVertical ? '80px' : '70px'};
      background: white;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: ${isVertical ? '12px' : '10px'};
      color: #666;
      text-align: center;
      padding: 8px;
      border: 2px solid rgba(255,255,255,0.3);
    }
  </style>
</head>
<body>
  <div class="header">
    ¡NUEVA PROPIEDAD!
    <div class="badge">Recién Listado</div>
  </div>
  <div class="content">
    <div class="main-section">
      <div class="main-image">
        <img src="${mainImage}" alt="Property" crossorigin="anonymous" />
      </div>
    </div>
    <div class="info-section">
      <div class="price-box">
        <div class="price">${property.price || 'Consultar'}</div>
        <div class="address">${property.address || 'Ubicación privilegiada'}</div>
      </div>
      ${secondImage || thirdImage ? `
      <div class="gallery">
        ${secondImage ? `<div class="gallery-item"><img src="${secondImage}" alt="Property 2" crossorigin="anonymous" /></div>` : ''}
        ${thirdImage ? `<div class="gallery-item"><img src="${thirdImage}" alt="Property 3" crossorigin="anonymous" /></div>` : ''}
      </div>
      ` : ''}
    </div>
  </div>
  <div class="footer">
    <div class="agent-info">
      <div class="agent-avatar">${(profile?.full_name || 'Agente').charAt(0).toUpperCase()}</div>
      <div class="agent-details">
        <div class="agent-name">${profile?.full_name || 'Agente Inmobiliario'}</div>
        <div class="agent-contact">📞 ${profile?.phone || '+34 XXX XXX XXX'}</div>
      </div>
    </div>
    <div class="qr-placeholder">QR Code</div>
  </div>
</body>
</html>`;
    };

    // Generate image with Cloudflare Browser Rendering API
    const generateImageWithCloudflare = async (platform: string, width: number, height: number) => {
      console.log(`Generating ${platform} image with Cloudflare...`);
      
      const html = generateHTML(platform, width, height);
      const base64HTML = btoa(unescape(encodeURIComponent(html)));

      const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${cloudflareAccountId}/browser-rendering/screenshot`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${cloudflareApiToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            html: base64HTML,
            width,
            height,
            format: 'jpeg',
            quality: 85,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Cloudflare API error: ${response.status} ${errorText}`);
        throw new Error(`Error al generar imagen con Cloudflare (${response.status}): ${errorText}`);
      }

      const data = await response.json();
      const screenshot = data.result?.screenshot;

      if (!screenshot) {
        throw new Error('Cloudflare no devolvió ninguna imagen');
      }

      console.log(`${platform} image generated successfully with Cloudflare`);
      return `data:image/jpeg;base64,${screenshot}`;
    };

    // Upload base64 image to Supabase Storage
    const uploadImage = async (base64Data: string, fileName: string) => {
      // Remove data:image/png;base64, prefix if present
      const base64Content = base64Data.replace(/^data:image\/\w+;base64,/, '');
      
      // Convert base64 to Uint8Array
      const binaryString = atob(base64Content);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('property-images')
        .upload(`${propertyId}/${fileName}`, bytes, {
          contentType: 'image/png',
          upsert: true,
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('property-images')
        .getPublicUrl(`${propertyId}/${fileName}`);

      return publicUrl;
    };

    // Generate all three images
    const sizes = [
      { name: 'instagram', width: 1080, height: 1080, platform: 'Instagram Feed (1080x1080)' },
      { name: 'stories', width: 1080, height: 1920, platform: 'Instagram Stories (1080x1920)' },
      { name: 'facebook', width: 1200, height: 630, platform: 'Facebook (1200x630)' },
    ];

    const results: Record<string, string> = {};

    for (const size of sizes) {
      console.log(`Generating ${size.name} image...`);
      
      const base64Image = await generateImageWithCloudflare(size.platform, size.width, size.height);
      
      const fileName = `${size.name}-${Date.now()}.png`;
      const publicUrl = await uploadImage(base64Image, fileName);
      results[`${size.name}Url`] = publicUrl;
      
      console.log(`${size.name} image uploaded:`, publicUrl);
    }

    // Update property with image URLs
    const { error: updateError } = await supabase
      .from('properties')
      .update({
        generated_image_instagram: results.instagramUrl,
        generated_image_stories: results.storiesUrl,
        generated_image_facebook: results.facebookUrl,
      })
      .eq('id', propertyId);

    if (updateError) {
      throw updateError;
    }

    console.log('All images generated successfully:', results);

    return new Response(
      JSON.stringify({ 
        success: true, 
        images: results 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error generating social images:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
