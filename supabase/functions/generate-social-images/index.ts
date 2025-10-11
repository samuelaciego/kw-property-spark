import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { corsHeaders } from "../_shared/cors.ts";

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const placidApiToken = Deno.env.get('PLACID_API_TOKEN');
const placidTemplateId = Deno.env.get('KW_IG_POST_01');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate Placid credentials
    if (!placidApiToken || !placidTemplateId) {
      const missingCredentials = [];
      if (!placidApiToken) missingCredentials.push('PLACID_API_TOKEN');
      if (!placidTemplateId) missingCredentials.push('KW_IG_POST_01');
      
      const errorMessage = `Placid credentials missing: ${missingCredentials.join(', ')}. Please configure these secrets in Supabase Edge Functions settings.`;
      console.error(errorMessage);
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: errorMessage,
          missingCredentials
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    console.log('Placid credentials validated successfully');
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

    // Generate image with Placid.app
    const generateImageWithPlacid = async () => {
      console.log('Generating Instagram image with Placid.app...');
      
      // Extract property type from title (basic implementation)
      const extractPropertyType = (title: string) => {
        const lowerTitle = title?.toLowerCase() || '';
        if (lowerTitle.includes('apartamento') || lowerTitle.includes('piso')) return 'APARTAMENTO';
        if (lowerTitle.includes('casa') || lowerTitle.includes('chalet')) return 'CASA';
        if (lowerTitle.includes('local')) return 'LOCAL';
        if (lowerTitle.includes('oficina')) return 'OFICINA';
        if (lowerTitle.includes('terreno')) return 'TERRENO';
        return 'PROPIEDAD';
      };

      // Truncate description to avoid overflow
      const truncateText = (text: string, maxLength: number) => {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength - 3) + '...';
      };

      // Build payload with layers mapped to property data
      const payload = {
        layers: {
          PropertyType: { 
            text: extractPropertyType(property.title) 
          },
          PropertyPic1: { 
            image: property.images?.[0] || '' 
          },
          PropertyTitle: { 
            text: truncateText(property.title || 'Propiedad Exclusiva', 80) 
          },
          PropertyPrice: { 
            text: property.price || 'Consultar' 
          },
          PropertyDesc: { 
            text: truncateText(property.description || 'Excelente oportunidad de inversión', 200) 
          },
          PropertyPic2: { 
            image: property.images?.[1] || '' 
          },
          PropertyPic3: { 
            image: property.images?.[2] || '' 
          },
          AgentPic: { 
            image: profile?.user_avatar_url || profile?.agency_logo_url || '' 
          },
          AgentName: { 
            text: profile?.full_name || 'Agente Inmobiliario' 
          },
          AgentPhoneNumer: { 
            text: profile?.phone || '+34 XXX XXX XXX' 
          },
          AgentEmail: { 
            text: profile?.email || 'agente@kw.com' 
          },
          AgentAgency: { 
            text: profile?.company || 'Keller Williams' 
          },
          PropertyLocation: { 
            text: truncateText(property.address || 'Ubicación privilegiada', 100) 
          },
          PropertyHashtags: { 
            text: property.hashtags?.join(' ') || '#inmobiliaria #propiedad #venta' 
          }
        }
      };

      console.log('Placid payload:', JSON.stringify(payload, null, 2));

      const response = await fetch(
        `https://api.placid.app/api/rest/${placidTemplateId}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${placidApiToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        }
      );

      console.log(`Placid API response status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Placid API error: ${response.status} ${errorText}`);
        throw new Error(`Error generating image with Placid.app (${response.status}): ${errorText}`);
      }

      const data = await response.json();
      console.log('Placid response:', JSON.stringify(data, null, 2));

      if (!data.image_url) {
        throw new Error('Placid.app did not return an image URL');
      }

      console.log('Instagram image generated successfully:', data.image_url);
      return data.image_url;
    };

    // Generate image
    const imageUrl = await generateImageWithPlacid();

    // Update property with image URL
    const { error: updateError } = await supabase
      .from('properties')
      .update({ 
        generated_image_instagram: imageUrl 
      })
      .eq('id', propertyId);

    if (updateError) {
      console.error('Error updating property:', updateError);
      throw updateError;
    }

    console.log('Property updated successfully with generated image');

    return new Response(
      JSON.stringify({ 
        success: true, 
        images: { instagram: imageUrl },
        message: 'Imagen generada exitosamente con Placid.app'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in generate-social-images function:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        details: 'Check edge function logs for more information'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
