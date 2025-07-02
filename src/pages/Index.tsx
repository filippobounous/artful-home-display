
import { useState } from "react";
import { Search, Grid, List, Filter, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

// Sample data - replace with API calls later
const sampleItems = [
  {
    id: 1,
    name: "Vintage Oak Dining Table",
    category: "furniture",
    type: "table",
    status: "available",
    price: 1200,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
    description: "Beautiful vintage oak dining table from the 1960s",
    dimensions: "72\" x 36\" x 30\"",
    condition: "excellent"
  },
  {
    id: 2,
    name: "Abstract Canvas Painting",
    category: "art",
    type: "painting",
    status: "sold",
    price: 800,
    image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop",
    description: "Original abstract painting by local artist",
    dimensions: "24\" x 36\"",
    condition: "mint"
  },
  {
    id: 3,
    name: "Mid-Century Modern Chair",
    category: "furniture",
    type: "chair",
    status: "available",
    price: 450,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
    description: "Iconic mid-century modern lounge chair",
    dimensions: "32\" x 30\" x 34\"",
    condition: "good"
  },
  {
    id: 4,
    name: "Contemporary Sculpture",
    category: "art",
    type: "sculpture",
    status: "reserved",
    price: 2500,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
    description: "Modern bronze sculpture by renowned artist",
    dimensions: "18\" x 12\" x 24\"",
    condition: "excellent"
  },
  {
    id: 5,
    name: "Antique Persian Rug",
    category: "furniture",
    type: "rug",
    status: "available",
    price: 3200,
    image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=300&fit=crop",
    description: "Authentic Persian rug with intricate patterns",
    dimensions: "9' x 12'",
    condition: "very good"
  },
  {
    id: 6,
    name: "Oil Painting Landscape",
    category: "art",
    type: "painting",
    status: "available",
    price: 1100,
    image: "https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=400&h=300&fit=crop",
    description: "Beautiful landscape oil painting",
    dimensions: "30\" x 40\"",
    condition: "excellent"
  }
];

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [viewMode, setViewMode] = useState("grid");

  const filteredItems = sampleItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesStatus = selectedStatus === "all" || item.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available": return "bg-green-100 text-green-800 border-green-200";
      case "sold": return "bg-red-100 text-red-800 border-red-200";
      case "reserved": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-slate-50">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-white border-b border-slate-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <SidebarTrigger />
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Inventory Management</h1>
                  <p className="text-slate-600">Manage your art and furniture collection</p>
                </div>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6">
            {/* Search and Filters */}
            <div className="mb-8 space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    placeholder="Search items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="art">Art</SelectItem>
                    <SelectItem value="furniture">Furniture</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="sold">Sold</SelectItem>
                    <SelectItem value="reserved">Reserved</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex gap-2">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Results Summary */}
            <div className="mb-6">
              <p className="text-slate-600">
                Showing {filteredItems.length} of {sampleItems.length} items
              </p>
            </div>

            {/* Items Display */}
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredItems.map((item) => (
                  <Card key={item.id} className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                    <CardContent className="p-0">
                      <div className="aspect-square overflow-hidden rounded-t-lg">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-slate-900 line-clamp-2">{item.name}</h3>
                          <Badge className={getStatusColor(item.status)}>
                            {item.status}
                          </Badge>
                        </div>
                        <p className="text-slate-600 text-sm mb-3 line-clamp-2">{item.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-slate-900">
                            ${item.price.toLocaleString()}
                          </span>
                          <span className="text-xs text-slate-500 capitalize">
                            {item.category}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredItems.map((item) => (
                  <Card key={item.id} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-lg font-semibold text-slate-900">{item.name}</h3>
                            <Badge className={getStatusColor(item.status)}>
                              {item.status}
                            </Badge>
                          </div>
                          <p className="text-slate-600 mb-2">{item.description}</p>
                          <div className="flex items-center gap-4 text-sm text-slate-500">
                            <span className="capitalize">{item.category}</span>
                            <span>•</span>
                            <span>{item.dimensions}</span>
                            <span>•</span>
                            <span className="capitalize">{item.condition}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xl font-bold text-slate-900">
                            ${item.price.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {filteredItems.length === 0 && (
              <div className="text-center py-12">
                <div className="text-slate-400 mb-4">
                  <Search className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No items found</h3>
                <p className="text-slate-600">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
