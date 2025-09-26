
import { cookies } from 'next/headers';
import { getStandardList } from '../../../../../../api/standards';
import StandardsClassesManagement from '../../../../../../components/standardManagement/StandardManagement';

export default async function StandardsClassesManagementScreen({ params }) {
  const resolvedParams = await params;
  const cookieStore = await cookies();
  const cookyGuid = cookieStore.get('guid').value
  const cookyId = cookieStore.get('id').value

  const standardListData = await getStandardList(resolvedParams.profile, resolvedParams.session, cookyGuid, cookyId)



  return (

    < StandardsClassesManagement standard={standardListData.results.items} />
  )
}
