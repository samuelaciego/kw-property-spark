import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';
import { corsHeaders } from "../_shared/cors.ts";

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const placidApiToken = Deno.env.get('PLACID_API_TOKEN');
const placidTemplateId = Deno.env.get('KW_IG_POST_01');
const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

// Input validation schema
const RequestSchema = z.object({
  propertyId: z.string().uuid()
});

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
    const body = await req.json();
    
    // Validate input
    const validationResult = RequestSchema.safeParse(body);
    if (!validationResult.success) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid property ID',
          details: validationResult.error.issues
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const { propertyId } = validationResult.data;
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

    // Helper function to call Gemini API
    const callGeminiAPI = async (prompt: string): Promise<string> => {
      if (!geminiApiKey) {
        throw new Error('GEMINI_API_KEY not configured');
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${geminiApiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 150,
            }
          })
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Gemini API error:', response.status, errorText);
        throw new Error('Failed to generate content with Gemini');
      }

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    };

    // Generate property description with Gemini (20 words max)
    const generatePropertyDescription = async (
      description: string,
      language: string
    ): Promise<string> => {
      const prompt = language === 'en'
        ? `Write a compelling 20-word paragraph (maximum) in English about this property: ${description}`
        : `Escribe un párrafo atractivo de máximo 20 palabras en español sobre esta propiedad: ${description}`;
      
      try {
        const generatedDesc = await callGeminiAPI(prompt);
        console.log('Generated PropertyDesc:', generatedDesc);
        return generatedDesc.trim();
      } catch (error) {
        console.error('Error generating PropertyDesc:', error);
        return description.substring(0, 150);
      }
    };

    // Extract city from address with Gemini
    const extractLocationCity = async (address: string): Promise<string> => {
      const prompt = `Extract only the city/locality name from this address, without postal code: ${address}. Return only the city name, nothing else.`;
      
      try {
        const cityName = await callGeminiAPI(prompt);
        console.log('Extracted PropertyLocation:', cityName);
        return cityName.trim();
      } catch (error) {
        console.error('Error extracting PropertyLocation:', error);
        return address.substring(0, 100);
      }
    };

    // Generate image with Placid.app
    const generateImageWithPlacid = async () => {
      console.log('Generating Instagram image with Placid.app...');
      
      // Detect user language (default to 'es' if not set)
      const userLanguage = profile?.language || 'es';
      console.log(`User language detected: ${userLanguage}`);

      // Set fixed texts based on language
      const propertyType = userLanguage === 'en' ? '¡New Property!' : '¡Nueva Propiedad!';
      const propertyTitle = userLanguage === 'en' ? 'Just listed' : 'Recién Listado';

      // Generate PropertyDesc with Gemini (20 words max)
      let propertyDesc = userLanguage === 'en' 
        ? 'Excellent investment opportunity' 
        : 'Excelente oportunidad de inversión';
        
      if (property.description) {
        propertyDesc = await generatePropertyDescription(
          property.description,
          userLanguage
        );
      }

      // Extract city from address with Gemini
      let propertyLocation = userLanguage === 'en'
        ? 'Prime location'
        : 'Ubicación privilegiada';
        
      if (property.address) {
        propertyLocation = await extractLocationCity(property.address);
      }

      // Build payload with layers mapped to property data
      const payload = {
        create_now: true, // Process image instantly instead of queueing
        layers: {
          PropertyType: { 
            text: propertyType
          },
          PropertyPic1: { 
            image: property.images?.[0] || '' 
          },
          PropertyTitle: { 
            text: propertyTitle
          },
          PropertyPrice: { 
            text: property.price || 'Consultar' 
          },
          PropertyDesc: { 
            text: propertyDesc
          },
          PropertyPic2: { 
            image: property.images?.[1] || '' 
          },
          PropertyPic3: { 
            image: property.images?.[2] || '' 
          },
          AgentPic: { 
            image: profile?.user_avatar_url || '' 
          },
          AgentName: { 
            text: profile?.full_name || (userLanguage === 'en' ? 'Real Estate Agent' : 'Agente Inmobiliario')
          },
          AgentPhoneNumer: { 
            text: profile?.phone || '+34 XXX XXX XXX' 
          },
          AgentEmail: { 
            text: profile?.email || 'agente@kw.com' 
          },
          AgentAgency: { 
            image: profile?.agency_logo_url || ''
          },
          PropertyLocation: { 
            text: propertyLocation
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
