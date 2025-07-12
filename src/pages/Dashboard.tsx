import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Calendar,
  BarChart3,
  Home,
  Image,
  Video,
  Share2,
  TrendingUp
} from "lucide-react";

const recentProperties = [
  {
    id: 1,
    title: "Casa Moderna en Austin",
    address: "123 Oak Street, Austin, TX",
    price: "$750,000",
    status: "Procesado",
    date: "2024-01-15",
    images: 12,
    hasVideo: true,
    views: 340
  },
  {
    id: 2,
    title: "Apartamento de Lujo Downtown",
    address: "456 Main Ave, Austin, TX", 
    price: "$450,000",
    status: "Procesando",
    date: "2024-01-14",
    images: 8,
    hasVideo: false,
    views: 125
  },
  {
    id: 3,
    title: "Condominio Vista al Lago",
    address: "789 Lake Dr, Austin, TX",
    price: "$895,000",
    status: "Procesado",
    date: "2024-01-12",
    images: 15,
    hasVideo: true,
    views: 567
  }
];

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const currentMonth = 42; // propiedades procesadas este mes
  const monthlyLimit = 200; // límite del plan
  const usagePercentage = (currentMonth / monthlyLimit) * 100;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground">Gestiona tus propiedades y contenido</p>
            </div>
            <Button className="bg-gradient-hero hover:shadow-glow transition-all duration-300">
              <Plus className="h-4 w-4 mr-2" />
              Nueva Propiedad
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-card border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Este Mes</p>
                  <p className="text-2xl font-bold text-foreground">{currentMonth}</p>
                </div>
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Home className="h-6 w-6 text-primary" />
                </div>
              </div>
              <Progress value={usagePercentage} className="mt-3" />
              <p className="text-xs text-muted-foreground mt-2">{monthlyLimit - currentMonth} restantes</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Imágenes</p>
                  <p className="text-2xl font-bold text-foreground">1,240</p>
                </div>
                <div className="bg-accent/10 p-3 rounded-lg">
                  <Image className="h-6 w-6 text-accent" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">+12% vs mes anterior</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Videos</p>
                  <p className="text-2xl font-bold text-foreground">86</p>
                </div>
                <div className="bg-warning/10 p-3 rounded-lg">
                  <Video className="h-6 w-6 text-warning" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">+8% vs mes anterior</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Vistas Totales</p>
                  <p className="text-2xl font-bold text-foreground">12.5K</p>
                </div>
                <div className="bg-primary/10 p-3 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">+24% vs mes anterior</p>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar propiedades..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
        </div>

        {/* Properties Table */}
        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Propiedades Recientes
            </CardTitle>
            <CardDescription>
              Historial de propiedades procesadas y su estado actual
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProperties.map((property) => (
                <div
                  key={property.id}
                  className="flex items-center justify-between p-4 border border-border/50 rounded-lg hover:bg-muted/20 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{property.title}</h3>
                    <p className="text-sm text-muted-foreground">{property.address}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-sm font-medium text-primary">{property.price}</span>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        {property.date}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Eye className="h-3 w-3 mr-1" />
                        {property.views} vistas
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Image className="h-3 w-3 mr-1" />
                        {property.images}
                      </div>
                      {property.hasVideo && (
                        <div className="flex items-center text-sm text-accent mt-1">
                          <Video className="h-3 w-3 mr-1" />
                          Video
                        </div>
                      )}
                    </div>

                    <Badge 
                      variant={property.status === 'Procesado' ? 'default' : 'secondary'}
                      className={property.status === 'Procesado' ? 'bg-accent' : ''}
                    >
                      {property.status}
                    </Badge>

                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}