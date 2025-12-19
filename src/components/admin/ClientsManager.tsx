import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Upload, Plus, User } from "lucide-react";

interface Client {
  id: string;
  name: string;
  description: string;
  designation: string;
  image_url: string | null;
  created_at: string;
}

const ClientsManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({ name: "", description: "", designation: "" });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { data: clients, isLoading } = useQuery({
    queryKey: ["admin-clients"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Client[];
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: { name: string; description: string; designation: string; image_url: string | null }) => {
      const { error } = await supabase.from("clients").insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-clients"] });
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      setFormData({ name: "", description: "", designation: "" });
      setImageFile(null);
      setImagePreview(null);
      toast({ title: "Client added successfully!" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to add client", variant: "destructive" });
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.description || !formData.designation) {
      toast({ title: "Error", description: "Please fill all fields", variant: "destructive" });
      return;
    }

    setIsUploading(true);
    let image_url: string | null = null;

    if (imageFile) {
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(`clients/${fileName}`, imageFile);

      if (uploadError) {
        toast({ title: "Error", description: "Failed to upload image", variant: "destructive" });
        setIsUploading(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("images")
        .getPublicUrl(`clients/${fileName}`);
      image_url = urlData.publicUrl;
    }

    mutation.mutate({ ...formData, image_url });
    setIsUploading(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add New Client
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="client-image">Client Image</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-secondary transition-colors">
                {imagePreview ? (
                  <div className="relative">
                    <img src={imagePreview} alt="Preview" className="max-h-40 mx-auto rounded-full" />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute top-0 right-0"
                      onClick={() => { setImageFile(null); setImagePreview(null); }}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <div className="flex flex-col items-center gap-2 py-4">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Click to upload image</span>
                    </div>
                    <input
                      id="client-image"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="client-name">Client Name</Label>
              <Input
                id="client-name"
                value={formData.name}
                onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                placeholder="Enter client name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="client-designation">Designation</Label>
              <Input
                id="client-designation"
                value={formData.designation}
                onChange={(e) => setFormData((p) => ({ ...p, designation: e.target.value }))}
                placeholder="e.g. CEO at Company"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="client-description">Testimonial</Label>
              <Textarea
                id="client-description"
                value={formData.description}
                onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                placeholder="Enter client testimonial"
                rows={4}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-secondary hover:bg-secondary/90"
              disabled={mutation.isPending || isUploading}
            >
              {mutation.isPending || isUploading ? "Adding..." : "Add Client"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Clients</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : clients && clients.length > 0 ? (
            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              {clients.map((client) => (
                <div key={client.id} className="flex gap-4 p-3 bg-muted/50 rounded-lg">
                  <div className="w-12 h-12 flex-shrink-0 rounded-full bg-gradient-to-br from-primary to-secondary overflow-hidden">
                    {client.image_url ? (
                      <img src={client.image_url} alt={client.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-primary-foreground">
                        <User className="h-5 w-5" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-foreground">{client.name}</h4>
                    <p className="text-sm text-secondary">{client.designation}</p>
                    <p className="text-sm text-muted-foreground line-clamp-1">{client.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">No clients yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientsManager;
