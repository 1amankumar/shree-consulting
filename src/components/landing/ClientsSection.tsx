import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Quote } from "lucide-react";

interface Client {
  id: string;
  name: string;
  description: string;
  designation: string;
  image_url: string | null;
}

const ClientsSection = () => {
  const { data: clients, isLoading } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as Client[];
    },
  });

  return (
    <section id="clients" className="py-20 md:py-28 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16 animate-fade-in">
          <span className="inline-block px-3 py-1 text-sm font-medium tracking-wider uppercase text-secondary bg-secondary/10 rounded-full mb-4">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-4">
            Happy Clients
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our clients have to say.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Skeleton className="h-16 w-16 rounded-full" />
                  <div>
                    <Skeleton className="h-5 w-32 mb-2" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
                <Skeleton className="h-20 w-full" />
              </Card>
            ))}
          </div>
        ) : clients && clients.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {clients.map((client, index) => (
              <Card 
                key={client.id} 
                className="group relative overflow-hidden border-border/50 hover:border-secondary/50 transition-all duration-300 hover:shadow-xl animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <Quote className="absolute top-4 right-4 h-8 w-8 text-secondary/20 group-hover:text-secondary/40 transition-colors" />
                  
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative h-16 w-16 rounded-full overflow-hidden bg-gradient-to-br from-primary to-secondary flex-shrink-0">
                      {client.image_url ? (
                        <img
                          src={client.image_url}
                          alt={client.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-primary-foreground text-xl font-bold">
                          {client.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-foreground text-lg">
                        {client.name}
                      </h3>
                      <p className="text-secondary text-sm font-medium">
                        {client.designation}
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground italic leading-relaxed">
                    "{client.description}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No testimonials available yet.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ClientsSection;
