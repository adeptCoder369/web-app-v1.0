
import { getStudentList } from '../../../api/student';
import StudentMangementDashboard from '../../../components/studentManagement/dashboard';
import { cookies } from 'next/headers';
// =============================================================
  export default async function StudentProfile({ params }) {
  // =============================================================
  const resolvedParams = await params;
  const cookieStore = await cookies();
  const cookyGuid = cookieStore.get('guid').value
  const cookyId = cookieStore.get('id').value
  // -----------------------------------------------------------
  const standardListData = await getStudentList(resolvedParams.profile, resolvedParams.session, cookyGuid, cookyId)

  // =============================================================
  return (

    <StudentMangementDashboard
      // students={standardListData.results.items}
      profile={resolvedParams.profile}
      session={resolvedParams.session}
      school={resolvedParams.school}
      cookyGuid={cookyGuid}
      cookyId={cookyId}
    />

  );
};

// =============================================================