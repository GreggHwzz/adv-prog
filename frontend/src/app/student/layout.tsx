import Navbar from "@/components/layout/NavBar"; 
import Footer from "@/components/layout/Footer";


const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
      <div className="flex flex-col min-h-screen">
      <Navbar role="STUDENT" />

      <main className="flex-1">{children}</main> 

      <Footer />
    </div>
    );
};

export default AdminLayout;