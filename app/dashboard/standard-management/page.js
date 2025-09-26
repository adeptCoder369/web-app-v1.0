
import { Breadcrumbs } from '../../../components/ui/Breadcrumb/breadcrumb';
import StandardsClassesManagement from '../../../components/standardManagement/StandardManagement';
import Layout from '../../../layouts/Layout';
// ===========================================================================
export default async function StandardsClassesManagementScreen({ params }) {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "Manage Standards & Classes" },
  ];
  // ===========================================================================
  return (
    // ===========================================================================
    <Layout>
      <div
        className="min-h-[calc(100vh-100px)] p-6 space-y-6"
        style={{
          backgroundImage: "url('/bg/appbackground@2x.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >


        <Breadcrumbs items={breadcrumbs} />


        < StandardsClassesManagement />
      </div>
    </Layout>
  )
}

// ===========================================================================