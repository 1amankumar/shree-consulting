const HeroSection = () => {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-primary">
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/90" />
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-secondary rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/50 rounded-full blur-3xl" />
      </div>
      
      <div className="container relative z-10 px-4 md:px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
          <span className="inline-block px-4 py-2 text-sm font-medium tracking-wider uppercase bg-secondary/20 text-secondary rounded-full">
            Welcome to Our Company
          </span>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-primary-foreground leading-tight">
            We Build Solutions That
            <span className="block text-secondary"> Drive Success</span>
          </h1>
          
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto leading-relaxed">
            Transforming ideas into powerful digital experiences. 
            We partner with forward-thinking businesses to create 
            innovative solutions that make a lasting impact.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <a 
              href="#projects" 
              className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-all duration-300 hover:scale-105"
            >
              View Our Work
            </a>
            <a 
              href="#contact" 
              className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold border-2 border-primary-foreground/30 text-primary-foreground rounded-lg hover:bg-primary-foreground/10 transition-all duration-300"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary-foreground/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary-foreground/50 rounded-full mt-2" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
