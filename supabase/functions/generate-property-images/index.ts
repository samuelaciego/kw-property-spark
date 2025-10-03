import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No autorizado');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');

    if (!lovableApiKey) {
      throw new Error('LOVABLE_API_KEY no configurada');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { propertyData, images, userId, propertyId } = await req.json();
    
    console.log('Generating images for property:', propertyId);
    console.log('Property data:', propertyData);

    if (!images || images.length < 3) {
      throw new Error('Se requieren al menos 3 imágenes de la propiedad');
    }

    // Read template file from storage (we'll upload it manually first)
    const templateUrl = 'https://vtkphubycpmygsvhtuvp.supabase.co/storage/v1/object/public/property-images/templates/kw_template.png';
    
    // Convert template to base64
    let templateBase64: string;
    try {
      const templateResponse = await fetch(templateUrl);
      if (!templateResponse.ok) {
        throw new Error('No se pudo cargar la plantilla');
      }
      const templateBlob = await templateResponse.arrayBuffer();
      templateBase64 = btoa(String.fromCharCode(...new Uint8Array(templateBlob)));
    } catch (error) {
      console.error('Error loading template:', error);
      throw new Error('Error al cargar la plantilla base');
    }

    const formats = [
      {
        name: 'facebook',
        dimensions: '1200x630',
        size: '1200x630 píxeles (formato horizontal para Facebook)',
        orientation: 'horizontal'
      },
      {
        name: 'instagram',
        dimensions: '1080x1080',
        size: '1080x1080 píxeles (formato cuadrado para Instagram Post)',
        orientation: 'cuadrado'
      },
      {
        name: 'stories',
        dimensions: '1080x1920',
        size: '1080x1920 píxeles (formato vertical para Instagram Stories)',
        orientation: 'vertical'
      }
    ];

    const generatedUrls: Record<string, string> = {};

    for (const format of formats) {
      console.log(`Generating ${format.name} image...`);

      const prompt = `GENERA UNA IMAGEN (no texto) editando esta plantilla de Keller Williams:

IMPORTANTE: Tu respuesta DEBE ser una imagen generada, NO texto explicativo.

MANTENER en la imagen generada:
- Fondo rojo Keller Williams
- Estructura de la plantilla con cuadros negro y azules
- Logos y branding de KW

INSERTAR estas 3 imágenes de propiedad en los espacios designados:
1. Imagen principal → cuadro NEGRO grande (lado izquierdo)
2. Segunda imagen → cuadro AZUL superior derecho  
3. Tercera imagen → cuadro AZUL inferior derecho

AGREGAR TEXTO LEGIBLE sobre la imagen en el área gris:
Precio: ${propertyData.price || 'Consultar'}
${propertyData.address || 'Dirección no disponible'}
${propertyData.bedrooms || 'N/A'} hab • ${propertyData.bathrooms || 'N/A'} baños

FORMATO FINAL: ${format.size} (${format.orientation})
Optimizado para publicación en ${format.name}.

RECUERDA: Genera la imagen final lista para publicar, no describas lo que harías.`;

      try {
        // Prepare images for AI
        const imageContents = [
          {
            type: "text",
            text: prompt
          },
          {
            type: "image_url",
            image_url: {
              url: `data:image/png;base64,${templateBase64}`
            }
          }
        ];

        // Add property images
        for (let i = 0; i < 3 && i < images.length; i++) {
          imageContents.push({
            type: "image_url",
            image_url: {
              url: images[i]
            }
          });
        }

        // Call Lovable AI Gateway - force image output only
        const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${lovableApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash-image-preview",
            messages: [
              {
                role: "system",
                content: "You are an image generation assistant. You MUST always respond with a generated image, never with text explanations. Generate the requested image directly."
              },
              {
                role: "user",
                content: imageContents
              }
            ],
            modalities: ["image"]  // Only image output, no text
          })
        });

        if (!aiResponse.ok) {
          const errorText = await aiResponse.text();
          console.error(`Lovable AI error for ${format.name}:`, aiResponse.status, errorText);
          
          if (aiResponse.status === 429) {
            throw new Error('Límite de uso excedido. Verifica tu plan de Lovable AI.');
          }
          if (aiResponse.status === 402) {
            throw new Error('Fondos insuficientes. Añade créditos en Settings -> Workspace -> Usage.');
          }
          
          throw new Error(`Error al generar imagen ${format.name}: ${aiResponse.status}`);
        }

        const aiData = await aiResponse.json();
        
        // Log full response for debugging
        console.log(`${format.name} AI response:`, JSON.stringify(aiData, null, 2));
        
        const generatedImageUrl = aiData.choices?.[0]?.message?.images?.[0]?.image_url?.url;

        if (!generatedImageUrl) {
          // Check if AI returned text instead of image
          const textContent = aiData.choices?.[0]?.message?.content;
          if (textContent) {
            console.error(`${format.name}: AI returned text instead of image:`, textContent);
            throw new Error(`El modelo generó texto en lugar de imagen para ${format.name}. Reintenta el proceso.`);
          }
          
          console.error('Lovable AI full response:', JSON.stringify(aiData, null, 2));
          throw new Error(`No se generó imagen para ${format.name}. Verifica los logs.`);
        }

        console.log(`${format.name} image generated successfully`);

        // Convert base64 to blob
        const base64Data = generatedImageUrl.replace(/^data:image\/\w+;base64,/, '');
        const imageBuffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

        // Upload to Storage
        const storagePath = `${userId}/${propertyId}/${format.name}.png`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('property-images')
          .upload(storagePath, imageBuffer, {
            contentType: 'image/png',
            upsert: true
          });

        if (uploadError) {
          console.error(`Storage upload error for ${format.name}:`, uploadError);
          throw new Error(`Error al subir imagen ${format.name}: ${uploadError.message}`);
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('property-images')
          .getPublicUrl(storagePath);

        generatedUrls[format.name] = urlData.publicUrl;
        console.log(`${format.name} uploaded to:`, urlData.publicUrl);

      } catch (error) {
        console.error(`Error processing ${format.name}:`, error);
        throw error;
      }
    }

    console.log('All images generated successfully');

    return new Response(
      JSON.stringify(generatedUrls),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in generate-property-images:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Error desconocido',
        success: false 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
