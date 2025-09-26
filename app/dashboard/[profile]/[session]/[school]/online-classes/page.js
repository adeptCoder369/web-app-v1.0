
import Layout from '../../../../../../layouts/Layout';
import { Breadcrumbs } from '../../../../../../components/ui/Breadcrumb/breadcrumb';
import ExplorerView from '../../../../../../components/ExplorerView';
import { Presentation } from 'lucide-react';
import { cookies } from 'next/headers';
import { getOnlineClasses } from '../../../../../../api/onlineClasses';

// ========================================================================================

export default async function OnlineClasses({ params }) {

  // ========================================================================================
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "View Inventory" },
  ];



  // =============================================================
  const resolvedParams = await params;
  const cookieStore = await cookies();
  const cookyGuid = cookieStore.get('guid').value
  const cookyId = cookieStore.get('id').value
  // -----------------------------------------------------------
  const onlineClassesData = await getOnlineClasses(resolvedParams.profile, resolvedParams.session, cookyGuid, cookyId)


 
  return (
    <Layout
    // // dashboardData={dashboardData?.results}
    >

      <div
        style={{
          backgroundImage: "url('/bg/appbackground@2x.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        className="min-h-[calc(100vh-100px)] p-6 space-y-6">

        <Breadcrumbs items={breadcrumbs} />

        <ExplorerView
        
          headerTitle='Online Classes'
          headerIcon={<Presentation />}
          data={onlineClassesData.results.meetings} // Pass the generated ordersData here
          columns={['Created By', 'Subject', 'Title & Description', 'Timings', 'Info', 'Start/join', 'Action']}
          tableType='onlineClasses'
        />
      </div>
    </Layout>
  );
};

