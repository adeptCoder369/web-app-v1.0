'use client'
import Layout from '../../layouts/Layout';
import { Breadcrumbs } from '../../components/ui/Breadcrumb/breadcrumb';
import ReportCardExplorerView from '../../components/reportCard/ReportCardExplorerView';
import { TbReportAnalytics } from 'react-icons/tb';
import { getSessionCache } from '../../utils/sessionCache';
import { useEffect, useState } from 'react';
import { getClassesList } from '../../api/classes';
import { getGradesList } from '../../api/grades';
import { getExamList } from '../../api/exam';
// ========================================================================================
const ReportCardPage = ({
    classes,
    subjects,
    exams,
    cookyGuid,
    cookyId,

    grades
}) => {

    // ========================================================================================
    const breadcrumbs = [
        { label: "Home", href: "/" },
        { label: "Dashboard", href: "/dashboard" },
        { label: "View Inventory" },
    ];




    const [classData, setClassData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    const config = getSessionCache("dashboardConfig");
    const Context = getSessionCache("dashboardContext");
    async function load() {
        setLoading(true);
        setError(null);
        try {
            const context = getSessionCache('dashboardContext') || {};
            const classData_ = await getClassesList(context?.profileId, context?.session, cookyGuid, cookyId);
            // console.log('payload  ==  $$$',context?.profileId, context?.session, cookyGuid, cookyId);
            const gradesData = await getGradesList(context?.profileId, context?.session, cookyGuid, cookyId);
            const examsData = await getExamList(context?.profileId, context?.session, cookyGuid, cookyId);


            if (mounted) setClassData(classData_?.results?.class_rooms);
        } catch (err) {
            if (mounted) setError(err);
            console.error('Failed to load student list', err);
        } finally {
            if (mounted) setLoading(false);
        }
    }
    let mounted = true;
    useEffect(() => {

        load();
        return () => { mounted = false; };
    }, [cookyGuid, cookyId]); // include deps you care about



            console.log('classData ---------------  $$$',classData);


    // ========================================================================================
    return (
        <Layout>
            <div
                style={{
                    backgroundImage: "url('/bg/appbackground@2x.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                }}
                className="p-4"
            >
                <Breadcrumbs items={breadcrumbs} />
               {classData ? <ReportCardExplorerView
                    classes={classes}
                    subjects={subjects}
                    exams={exams}
                    cookyGuid={cookyGuid}
                    cookyId={cookyId}
                    grades={grades}

                    headerTitle='Report Cards'
                    headerIcon={<TbReportAnalytics />}
                    columns={['Created By', 'Subject', 'Title & Description', 'Timings', 'Info', 'Start/join', 'Action']}
                    tableType='ReportCard'
                /> : <></>}
            </div>
        </Layout>
    );
};

// ========================================================================================
export default ReportCardPage;
// ========================================================================================