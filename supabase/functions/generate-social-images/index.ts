import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import puppeteer from "https://deno.land/x/puppeteer@16.2.0/mod.ts";
import { corsHeaders } from "../_shared/cors.ts";

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

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

    // Generate HTML for different sizes
    const generateHTML = (width: number, height: number, layout: string) => {
      const isStories = layout === 'stories';
      const isFacebook = layout === 'facebook';
      const isInstagram = layout === 'instagram';

      return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=${width}, height=${height}">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            width: ${width}px;
            height: ${height}px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
            overflow: hidden;
            background: #f3f4f6;
        }
        .container {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
        }
        .header {
            background: #dc2626;
            color: white;
            text-align: center;
            padding: ${isStories ? '40px 20px' : '30px 20px'};
        }
        .header h1 {
            font-size: ${isStories ? '48px' : isFacebook ? '36px' : '40px'};
            font-weight: bold;
            margin: 0;
        }
        .content {
            flex: 1;
            background: #f3f4f6;
            padding: ${isStories ? '30px' : '20px'};
            display: flex;
            flex-direction: column;
            gap: ${isStories ? '30px' : '20px'};
        }
        .property-section {
            background: white;
            border-radius: 12px;
            padding: ${isStories ? '30px' : '25px'};
            flex: 1;
        }
        .property-layout {
            display: flex;
            gap: ${isStories ? '25px' : '20px'};
            height: 100%;
            ${isStories ? 'flex-direction: column;' : ''}
        }
        .main-image-container {
            ${isStories ? 'width: 100%; height: 60%;' : isFacebook ? 'flex: 2;' : 'flex: 1;'}
        }
        .main-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 8px;
            background: #e5e7eb;
        }
        .details-container {
            ${isStories ? 'width: 100%; height: 40%;' : 'width: 280px;'}
            display: flex;
            flex-direction: column;
            gap: ${isStories ? '20px' : '15px'};
        }
        .property-info {
            ${isStories ? 'margin-bottom: 15px;' : ''}
        }
        .property-info h2 {
            font-size: ${isStories ? '32px' : '24px'};
            font-weight: 600;
            margin-bottom: ${isStories ? '15px' : '10px'};
            color: #111827;
        }
        .price {
            font-size: ${isStories ? '40px' : '32px'};
            font-weight: bold;
            color: #16a34a;
            margin-bottom: ${isStories ? '12px' : '8px'};
        }
        .description {
            font-size: ${isStories ? '22px' : '16px'};
            color: #6b7280;
            line-height: 1.4;
        }
        .small-images {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: ${isStories ? '15px' : '10px'};
        }
        .small-image {
            width: 100%;
            height: ${isStories ? '140px' : '100px'};
            object-fit: cover;
            border-radius: 6px;
            background: #e5e7eb;
        }
        .agent-section {
            background: white;
            border-radius: 12px;
            padding: ${isStories ? '30px' : '25px'};
        }
        .agent-layout {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 20px;
        }
        .agent-info-container {
            display: flex;
            align-items: center;
            gap: ${isStories ? '25px' : '20px'};
            flex: 1;
        }
        .agent-photo {
            width: ${isStories ? '100px' : '80px'};
            height: ${isStories ? '100px' : '80px'};
            border-radius: 50%;
            background: #e5e7eb;
            flex-shrink: 0;
            object-fit: cover;
        }
        .agent-details h3 {
            font-size: ${isStories ? '32px' : '24px'};
            font-weight: 600;
            margin-bottom: ${isStories ? '12px' : '8px'};
            color: #111827;
        }
        .contact-info {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: ${isStories ? '20px' : '16px'};
            color: #6b7280;
            margin-bottom: ${isStories ? '10px' : '6px'};
        }
        .icon {
            width: ${isStories ? '24px' : '18px'};
            height: ${isStories ? '24px' : '18px'};
        }
        .qr-placeholder {
            width: ${isStories ? '120px' : '100px'};
            height: ${isStories ? '120px' : '100px'};
            background: #e5e7eb;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: ${isStories ? '16px' : '12px'};
            color: #9ca3af;
            flex-shrink: 0;
        }
        .footer {
            background: white;
            padding: ${isStories ? '25px 30px' : '20px 25px'};
            border-top: 1px solid #e5e7eb;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: ${isStories ? '18px' : '14px'};
            color: #6b7280;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>¡NUEVA PROPIEDAD!</h1>
        </div>

        <div class="content">
            <div class="property-section">
                <div class="property-layout">
                    <div class="main-image-container">
                        <img src="${property.images?.[0] || ''}" alt="Propiedad" class="main-image" onerror="this.style.background='#e5e7eb'">
                    </div>

                    <div class="details-container">
                        <div class="property-info">
                            <h2>Recién Listado</h2>
                            <div class="price">${property.price || 'Consultar'}</div>
                            <div class="description">${property.title?.substring(0, 60) || 'Propiedad disponible'}</div>
                        </div>

                        <div class="small-images">
                            <img src="${property.images?.[1] || ''}" alt="Interior 1" class="small-image" onerror="this.style.background='#e5e7eb'">
                            <img src="${property.images?.[2] || ''}" alt="Interior 2" class="small-image" onerror="this.style.background='#e5e7eb'">
                        </div>
                    </div>
                </div>
            </div>

            <div class="agent-section">
                <div class="agent-layout">
                    <div class="agent-info-container">
                        <img src="${profile?.user_avatar_url || profile?.avatar_url || ''}" alt="Agente" class="agent-photo" onerror="this.style.background='#e5e7eb'">
                        <div class="agent-details">
                            <h3>${profile?.full_name || property.agent_name || 'Agente'}</h3>
                            <div class="contact-info">
                                <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                                </svg>
                                <span>${profile?.phone || property.agent_phone || ''}</span>
                            </div>
                            <div class="contact-info">
                                <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                </svg>
                                <span>${profile?.email || ''}</span>
                            </div>
                        </div>
                    </div>
                    <div class="qr-placeholder">QR Code</div>
                </div>
            </div>
        </div>

        <div class="footer">
            <span>📍 ${property.address?.substring(0, 40) || 'Ubicación'}</span>
            <span>#NuevaPropiedad #RealEstate</span>
        </div>
    </div>
</body>
</html>`;
    };

    // Launch browser
    console.log('Launching browser...');
    const browser = await puppeteer.launch({
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
      ],
    });

    try {
      const sizes = [
        { name: 'instagram', width: 1080, height: 1080, layout: 'instagram' },
        { name: 'stories', width: 1080, height: 1920, layout: 'stories' },
        { name: 'facebook', width: 1200, height: 630, layout: 'facebook' },
      ];

      const uploadImage = async (buffer: Uint8Array, fileName: string) => {
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('property-images')
          .upload(`${propertyId}/${fileName}`, buffer, {
            contentType: 'image/jpeg',
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

      const results: Record<string, string> = {};

      for (const size of sizes) {
        console.log(`Generating ${size.name} image (${size.width}x${size.height})...`);
        
        const page = await browser.newPage();
        await page.setViewport({ width: size.width, height: size.height });
        
        const html = generateHTML(size.width, size.height, size.layout);
        await page.setContent(html, { waitUntil: 'networkidle2', timeout: 30000 });
        
        const screenshot = await page.screenshot({
          type: 'jpeg',
          quality: 85,
        });
        
        await page.close();

        const fileName = `${size.name}-${Date.now()}.jpg`;
        const publicUrl = await uploadImage(screenshot, fileName);
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

      console.log('Images generated successfully:', results);

      return new Response(
        JSON.stringify({ 
          success: true, 
          images: results 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );

    } finally {
      await browser.close();
    }

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
