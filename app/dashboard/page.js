
import DashboardMenus from '../../components/dashboard/menus';
import { cookies } from 'next/headers';

export default async function Dashboard({ }) {



  const cookieStore = await cookies();
  const cookyGuid = cookieStore.get('guid').value
  const cookyId = cookieStore.get('id').value







  return (
    <>

        <DashboardMenus
          cookyGuid={cookyGuid}
          cookyId={cookyId}
        />
    </>
  );
};

