import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Download, Sparkles } from "lucide-react";
import kwTemplate from "@/assets/kw_template-2.png";

interface PropertyData {
  id?: string;
  title: string;
  description: string;
  price: string;
  address: string;
  images: string[];
  generated_image_instagram?: string;
}

interface Profile {
  user_avatar_url?: string;
  avatar_url?: string;
  full_name?: string;
  phone?: string;
  email?: string;
}

interface InstagramImageGeneratorProps {
  propertyData: PropertyData;
  profile: Profile;
  onImageGenerated: (imageUrl: string) => void;
  onError: (error: string) => void;
}

const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

export const InstagramImageGenerator = ({
  propertyData,
  profile,
  onImageGenerated,
  onError,
}: InstagramImageGeneratorProps) => {
  const [generating, setGenerating] = useState(false);

  const generateImage = async () => {
    if (!propertyData.id) {
      onError("ID de propiedad no disponible");
      return;
    }

    setGenerating(true);

    try {
      // Create canvas
      const canvas = document.createElement("canvas");
      canvas.width = 1080;
      canvas.height = 1080;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("No se pudo crear el contexto del canvas");
      }

      // Load template
      const template = await loadImage(kwTemplate);
      ctx.drawImage(template, 0, 0, 1080, 1080);

      // Load property images (first 3)
      const propertyImages = await Promise.all(
        propertyData.images.slice(0, 3).map((url) => loadImage(url))
      );

      // Draw main image in black box (left side)
      if (propertyImages[0]) {
        const targetX = 90;
        const targetY = 244;
        const targetWidth = 540;
        const targetHeight = 650;
        
        // Calculate aspect ratio to cover
        const imgRatio = propertyImages[0].width / propertyImages[0].height;
        const targetRatio = targetWidth / targetHeight;
        
        let drawWidth, drawHeight, offsetX = 0, offsetY = 0;
        
        if (imgRatio > targetRatio) {
          drawHeight = targetHeight;
          drawWidth = drawHeight * imgRatio;
          offsetX = (drawWidth - targetWidth) / 2;
        } else {
          drawWidth = targetWidth;
          drawHeight = drawWidth / imgRatio;
          offsetY = (drawHeight - targetHeight) / 2;
        }

        ctx.save();
        ctx.beginPath();
        ctx.rect(targetX, targetY, targetWidth, targetHeight);
        ctx.clip();
        ctx.drawImage(
          propertyImages[0],
          targetX - offsetX,
          targetY - offsetY,
          drawWidth,
          drawHeight
        );
        ctx.restore();
      }

      // Draw second image in top blue box
      if (propertyImages[1]) {
        const targetX = 642;
        const targetY = 244;
        const targetWidth = 328;
        const targetHeight = 162;
        
        const imgRatio = propertyImages[1].width / propertyImages[1].height;
        const targetRatio = targetWidth / targetHeight;
        
        let drawWidth, drawHeight, offsetX = 0, offsetY = 0;
        
        if (imgRatio > targetRatio) {
          drawHeight = targetHeight;
          drawWidth = drawHeight * imgRatio;
          offsetX = (drawWidth - targetWidth) / 2;
        } else {
          drawWidth = targetWidth;
          drawHeight = drawWidth / imgRatio;
          offsetY = (drawHeight - targetHeight) / 2;
        }

        ctx.save();
        ctx.beginPath();
        ctx.rect(targetX, targetY, targetWidth, targetHeight);
        ctx.clip();
        ctx.drawImage(
          propertyImages[1],
          targetX - offsetX,
          targetY - offsetY,
          drawWidth,
          drawHeight
        );
        ctx.restore();
      }

      // Draw third image in bottom blue box
      if (propertyImages[2]) {
        const targetX = 642;
        const targetY = 420;
        const targetWidth = 328;
        const targetHeight = 162;
        
        const imgRatio = propertyImages[2].width / propertyImages[2].height;
        const targetRatio = targetWidth / targetHeight;
        
        let drawWidth, drawHeight, offsetX = 0, offsetY = 0;
        
        if (imgRatio > targetRatio) {
          drawHeight = targetHeight;
          drawWidth = drawHeight * imgRatio;
          offsetX = (drawWidth - targetWidth) / 2;
        } else {
          drawWidth = targetWidth;
          drawHeight = drawWidth / imgRatio;
          offsetY = (drawHeight - targetHeight) / 2;
        }

        ctx.save();
        ctx.beginPath();
        ctx.rect(targetX, targetY, targetWidth, targetHeight);
        ctx.clip();
        ctx.drawImage(
          propertyImages[2],
          targetX - offsetX,
          targetY - offsetY,
          drawWidth,
          drawHeight
        );
        ctx.restore();
      }

      // Add property text in grey area
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 32px Arial, sans-serif";
      ctx.fillText(propertyData.price || "Precio", 642, 630);

      ctx.font = "20px Arial, sans-serif";
      const addressLines = wrapText(ctx, propertyData.address || "", 300);
      addressLines.forEach((line, index) => {
        ctx.fillText(line, 642, 670 + (index * 26));
      });

      // Add agent info in footer
      const footerY = 920;
      
      // Agent photo (left)
      if (profile.user_avatar_url) {
        try {
          const agentPhoto = await loadImage(profile.user_avatar_url);
          ctx.save();
          ctx.beginPath();
          ctx.arc(130, footerY + 40, 35, 0, Math.PI * 2);
          ctx.clip();
          ctx.drawImage(agentPhoto, 95, footerY + 5, 70, 70);
          ctx.restore();
        } catch (e) {
          console.error("Error loading agent photo:", e);
        }
      }

      // Agent text info
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 18px Arial, sans-serif";
      ctx.fillText(profile.full_name || "Agente", 180, footerY + 30);
      
      ctx.font = "14px Arial, sans-serif";
      ctx.fillText(profile.phone || "", 180, footerY + 50);
      ctx.fillText(profile.email || "", 180, footerY + 68);

      // Agency logo (right)
      if (profile.avatar_url) {
        try {
          const agencyLogo = await loadImage(profile.avatar_url);
          const logoWidth = 120;
          const logoHeight = 60;
          ctx.drawImage(
            agencyLogo,
            920,
            footerY + 10,
            logoWidth,
            logoHeight
          );
        } catch (e) {
          console.error("Error loading agency logo:", e);
        }
      }

      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((b) => {
          if (b) resolve(b);
          else reject(new Error("Error al convertir canvas a blob"));
        }, "image/png");
      });

      // Upload to Supabase Storage
      const fileName = `${propertyData.id}/instagram-${Date.now()}.png`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("property-images")
        .upload(fileName, blob, {
          contentType: "image/png",
          upsert: true,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("property-images")
        .getPublicUrl(fileName);

      // Update property record
      const { error: updateError } = await supabase
        .from("properties")
        .update({ generated_image_instagram: publicUrl })
        .eq("id", propertyData.id);

      if (updateError) {
        throw updateError;
      }

      onImageGenerated(publicUrl);
    } catch (error) {
      console.error("Error generating image:", error);
      onError(error.message || "Error al generar la imagen");
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = () => {
    if (propertyData.generated_image_instagram) {
      const link = document.createElement("a");
      link.href = propertyData.generated_image_instagram;
      link.download = `instagram-${propertyData.id}.png`;
      link.click();
    }
  };

  return (
    <div className="space-y-4">
      {propertyData.generated_image_instagram ? (
        <>
          <img
            src={propertyData.generated_image_instagram}
            alt="Vista previa Instagram"
            className="w-full rounded-lg border"
          />
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Descargar
            </Button>
            <Button onClick={generateImage} disabled={generating}>
              {generating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Regenerando...
                </>
              ) : (
                "Regenerar"
              )}
            </Button>
          </div>
        </>
      ) : (
        <Button
          onClick={generateImage}
          disabled={generating}
          className="w-full"
        >
          {generating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generando imagen...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Generar Imagen para Instagram
            </>
          )}
        </Button>
      )}
    </div>
  );
};

// Helper function to wrap text
function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(currentLine + " " + word).width;
    if (width < maxWidth) {
      currentLine += " " + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines;
}
