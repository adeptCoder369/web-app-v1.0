
import Layout from '../../../../../../layouts/Layout';
import { Breadcrumbs } from '../../../../../../components/ui/Breadcrumb/breadcrumb';
import ExplorerView from '../../../../../../components/ExplorerView';
import { Presentation } from 'lucide-react';
import { cookies } from 'next/headers';
import { getOnlineClasses } from '../../../../../../api/onlineClasses';
import FeeManagementDashboard from '../../../../../../components/FeeSummary/dashboard';
// import FeeManagementDashboard from '../../../../../../components/FeeSummary/dashboard_og';

// ========================================================================================

export default async function FeeManagement({ params }) {


  // =============================================================
  const resolvedParams = await params;
  const cookieStore = await cookies();
  const cookyGuid = cookieStore.get('guid').value
  const cookyId = cookieStore.get('id').value
  // -----------------------------------------------------------





  return (
    <FeeManagementDashboard

      profile={resolvedParams.profile}
      session={resolvedParams.session}
      school={resolvedParams.school}
      cookyGuid={cookyGuid}
      cookyId={cookyId}



    />

  );
};

