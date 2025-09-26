
import { getUserDashboardData } from '../../../../../api/dashboard';
import DashboardMenus from '../../../../../components/dashboard/menus';
// import DashboardMenus from '../../../../../components/dashboard/menus_og';
import { cookies } from 'next/headers';

export default async function Dashboard({ params }) {


  const profileId = await params?.profile;
  const sessionId = await params?.session;
  const resolvedParams = await params;
  const cookieStore = await cookies();
  const cookyGuid = cookieStore.get('guid').value
  const cookyId = cookieStore.get('id').value


  const dashboardData = await getUserDashboardData(
    profileId,
    sessionId,
    cookyGuid,
    cookyId,
  );







  return (
    <>
      <DashboardMenus dashboardData={dashboardData} />
    </>
  );
};

