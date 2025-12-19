import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Mail, CheckCircle } from "lucide-react";
import { z } from "zod";

const emailSchema = z.string().trim().email("Please enter a valid email address");

const NewsletterSection = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const mutation = useMutation({
    mutationFn: async (email: string) => {
      const { error } = await supabase
        .from("newsletter_subscribers")
        .insert([{ email }]);
      if (error) {
        if (error.code === "23505") {
          throw new Error("This email is already subscribed");
        }
        throw error;
      }
    },
    onSuccess: () => {
      setSubscribed(true);
      setEmail("");
      toast({
        title: "Subscribed!",
        description: "You've successfully subscribed to our newsletter.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to subscribe. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    const result = emailSchema.safeParse(email);
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }
    
    mutation.mutate(email);
  };

  return (
    <section className="py-20 md:py-28 bg-primary relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-64 h-64 bg-secondary rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-secondary/50 rounded-full blur-3xl" />
      </div>

      <div className="container px-4 md:px-6 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          {subscribed ? (
            <div className="animate-fade-in">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-secondary/20 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-secondary" />
              </div>
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-primary-foreground mb-4">
                You're on the list!
              </h2>
              <p className="text-primary-foreground/80 mb-6">
                Thank you for subscribing. We'll keep you updated with our latest news.
              </p>
              <Button 
                onClick={() => setSubscribed(false)} 
                variant="outline"
                className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
              >
                Subscribe Another Email
              </Button>
            </div>
          ) : (
            <div className="animate-fade-in">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-secondary/20 flex items-center justify-center">
                <Mail className="h-8 w-8 text-secondary" />
              </div>
              <h2 className="text-2xl md:text-4xl font-heading font-bold text-primary-foreground mb-4">
                Stay Updated
              </h2>
              <p className="text-primary-foreground/80 mb-8 text-lg">
                Subscribe to our newsletter for the latest updates, insights, and exclusive content.
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <div className="flex-1">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    placeholder="Enter your email"
                    className={`h-12 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:border-secondary ${error ? "border-destructive" : ""}`}
                  />
                  {error && (
                    <p className="text-sm text-secondary mt-2 text-left">{error}</p>
                  )}
                </div>
                <Button 
                  type="submit" 
                  size="lg"
                  className="h-12 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? "Subscribing..." : "Subscribe"}
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
