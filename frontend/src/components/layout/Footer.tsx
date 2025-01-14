const Footer: React.FC = () => {
    return (
      <footer className="bg-gray-900 text-white py-4">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm">© {new Date().getFullYear()} EFREI. Tous droits réservés.</p>
          <nav className="flex space-x-4 mt-2 md:mt-0">
            <a href="/terms" className="text-gray-400 hover:text-white">
              Conditions d&apos;utilisation
            </a>
            <a href="/privacy" className="text-gray-400 hover:text-white">
              Politique de confidentialité
            </a>
          </nav>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  