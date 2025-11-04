import React, { useEffect, useState } from "react";
import {
    X,
    Calendar,
    Layers,
    ReceiptIndianRupee,
    Users,
    Banknote,
    Clock,
    CheckCircle2,
    XCircle,
    TrendingUp,
    GraduationCap,
    IndianRupee,
    DollarSign,
} from "lucide-react";
import { MdEvent } from "react-icons/md";

const EventTypeDrawer = ({ drawerOpen, selectedFee, context, setDrawerOpen }) => {
    const [feeDetailData, setFeeDetailData] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchFeeTypeDetail = async () => {
        if (!drawerOpen || !selectedFee?.id) return;
        setLoading(true);
        try {
            const res = await getFeeTypeDetail(
                context?.profileId,
                context?.session,
                selectedFee?.id
            );
            if (res?.data?.success) {
                setFeeDetailData(res.data.results);
            }
        } catch (err) {
            console.error("Error fetching fee type detail:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // fetchFeeTypeDetail();
    }, [drawerOpen, selectedFee]);

    const data = feeDetailData;
    console.log(data?.standard);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN").format(amount || 0);
    };

    return (
        <>
            {/* Drawer */}
            <div
                className={`fixed inset-y-0 right-0 w-full md:w-[32rem] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out ${drawerOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-accent px-6 py-5 flex items-center justify-between text-white">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                            <MdEvent className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">Event Type  Details</h3>
                            <p className="text-sm text-blue-100 mt-0.5">Complete breakdown and information</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setDrawerOpen(false)}
                        className="cursor-pointer p-2 hover:bg-white/20 rounded-xl transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                            <p className="mt-4 text-gray-500 font-medium">Loading details...</p>
                        </div>
                    </div>
                ) : data ? (
                    <div className="overflow-y-auto h-[calc(100vh-88px)]">
                     
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                                <MdEvent className="w-8 h-8 text-gray-400" />
                            </div>
                            <p className="text-gray-500 font-medium">No Events Data Available</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Backdrop */}
            {drawerOpen && (
                <div
                    onClick={() => setDrawerOpen(false)}
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 cursor-pointer"
                />
            )}
        </>
    );
};

export default EventTypeDrawer;
