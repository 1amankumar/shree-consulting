const Footer = () => {
  return (
    <footer className="py-8 bg-foreground text-background/80">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <span className="font-heading font-bold text-xl text-background">
              YourCompany
            </span>
          </div>
          <p className="text-sm">
            © {new Date().getFullYear()} YourCompany. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
