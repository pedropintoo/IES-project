import { SideBar, ChartSection, StripedTable } from "../../components";
import {
    FaArrowLeft,
    FaFutbol,
    FaHeadSideCough,
    FaHeart,
    FaTemperatureHigh,
    FaHeartPulse,
} from "react-icons/fa6";
import { Link, useParams } from "react-router-dom";
import { useAuth, useUser } from "../../hooks";
import { useEffect, useState } from "react";
import {
    getSessionHistoricalInfo,
    getSessionInfo,
    getSessionRealTimeInfo,
    SessionHistoricalInfo,
    SessionRealTimeInfo,
    connectPlayerWebSocketRealTimeInfo,
} from "../../api";

export default function PersonalTrainerPlayerDetailsPage() {
    const navLinks = [
        { icon: <FaFutbol />, to: "/personal-trainer/session" },
        { icon: <FaHeartPulse />, to: "/personal-trainer/sensors" },
    ];

    const { sessionId, playerId } = useParams();
    const user = useUser();
    const auth = useAuth();

    const [isHistorical, setIsHistorical] = useState(false);
    const [sessionInfo, setSessionInfo] = useState<
        SessionHistoricalInfo | SessionRealTimeInfo | null
    >(null);

    useEffect(() => {
        if (user?.username === "") {
            auth.authMe();
        }
    }, [user, auth]);

    // Fetch display data
    useEffect(() => {
        if (user?.username === "") {
            auth.authMe();
        }
    }, [user, auth]);

    // Fetch display data
    useEffect(() => {
        const fetchDataAndConnectWebSocket = async () => {
            const sessionInfo = await getSessionInfo(
                auth.axiosInstance,
                Number(sessionId)
            );

            const fetchHistoricalData = async () => {
                try {
                    const response = await getSessionHistoricalInfo(
                        auth.axiosInstance,
                        Number(sessionId),
                        Number(playerId)
                    );
                    setSessionInfo(response);
                } catch (error) {
                    console.error(
                        "Error fetching historical session info:",
                        error
                    );
                    setSessionInfo(null);
                }
            };
 
            const fetchRealTimeData = async () => {
                try {
                    const response = await getSessionRealTimeInfo(
                        auth.axiosInstance,
                        Number(sessionId),
                        Number(playerId)
                    );
                    setSessionInfo(response);
                } catch (error) {
                    console.error(
                        "Error fetching real-time session info:",
                        error
                    );
                    setSessionInfo(null);
                }
            };

            if (sessionId !== null) {
                if (sessionInfo?.endTime !== null) {
                    setIsHistorical(true);
                    fetchHistoricalData();
                } else {
                    setIsHistorical(false);
                    fetchRealTimeData(); // Fetch initial data

                    if (playerId) {
                        const cleanupWebSocket =
                            await connectPlayerWebSocketRealTimeInfo(
                                setSessionInfo,
                                playerId
                            );

                        return cleanupWebSocket;
                    }
                }
            }
        };

        const cleanupWebSocketPromise = fetchDataAndConnectWebSocket();

        return () => {
            cleanupWebSocketPromise.then((cleanupWebSocket) => {
                cleanupWebSocket?.(); // Cleanup WebSocket connection
            });
        };
    }, [auth.axiosInstance, playerId, sessionId]);

    const avatarUrl = user.profilePictureUrl;

    const heartRateData =
        sessionInfo?.historicalDataPlayers[0].heartRateData.map(
            (item: { value: number }, index: number) => ({
                name: index,
                value: item.value,
            })
        );

    const bodyTemperatureData =
        sessionInfo?.historicalDataPlayers[0].bodyTemperatureData.map(
            (item: { value: number }, index: number) => ({
                name: index,
                value: item.value,
            })
        );

    const respiratoryRateData =
        sessionInfo?.historicalDataPlayers[0].respiratoryRateData.map(
            (item: { value: number }, index: number) => ({
                name: index,
                value: item.value,
            })
        );

    const heartRateValue =
        sessionInfo && isHistorical && "averageHeartRate" in sessionInfo
            ? parseInt(sessionInfo.averageHeartRate.toString(), 10)
            : sessionInfo && "lastHeartRate" in sessionInfo
            ? parseInt(sessionInfo.lastHeartRate.toString(), 10)
            : 2;

    const bodyTemperatureValue =
        sessionInfo && isHistorical && "averageBodyTemperature" in sessionInfo
            ? parseFloat(
                  (
                      sessionInfo as SessionHistoricalInfo
                  ).averageBodyTemperature.toString()
              ).toFixed(1)
            : sessionInfo && "lastBodyTemperature" in sessionInfo
            ? parseFloat(
                  (
                      sessionInfo as SessionRealTimeInfo
                  ).lastBodyTemperature.toString()
              ).toFixed(1)
            : 0.0;

    const respiratoryRateValue =
        sessionInfo && isHistorical && "averageRespiratoryRate" in sessionInfo
            ? parseInt(sessionInfo.averageRespiratoryRate.toString(), 10)
            : sessionInfo && "lastRespiratoryRate" in sessionInfo
            ? parseInt(sessionInfo.lastRespiratoryRate.toString(), 10)
            : 0;

    return (
        <div className="flex min-h-screen h-lvh">
            <SideBar
                avatarUrl={avatarUrl}
                navLinks={navLinks}
                activePath={"/personal-trainer/session"}
            />

            {/* Main Content */}
            <div className="flex-grow p-8 overflow-y-auto h-full">
                {/* Logo */}
                <img
                    src="/logo.png"
                    alt="Logo"
                    className="absolute top-8 right-8 h-24"
                />
                {/* Content */}
                <div className="flex-grow flex p-6 flex-col jsutify-center items-center">
                    <div className="flex w-full items-start mb-20">
                        <Link to={`/personal-trainer/session`}>
                            <button className="bg-green-t3 hover:bg-gray-400 transition duration-300 text-white px-4 py-2 rounded-lg my-5">
                                <FaArrowLeft className="inline-block mr-2" />
                                <strong>Back</strong>
                            </button>
                        </Link>
                        <div className="border-4 w-4/5 p-6 ml-20">
                            <StripedTable
                                widthClass="justify-center mx-auto"
                                heightClass="h-full"
                                columnsName={[
                                    "Session Name",
                                    "Date",
                                    "Time(min)",
                                    "Participants",
                                ]}
                                rows={
                                    sessionInfo
                                        ? [
                                              [
                                                  sessionInfo.sessionName,
                                                  sessionInfo.date,
                                                  sessionInfo.time,
                                                  sessionInfo.participants,
                                              ],
                                          ]
                                        : []
                                }
                            />
                        </div>
                    </div>

                    <div className="w-full space-y-6">
                        {/* heartRateData */}
                        <ChartSection
                            bgClass=""
                            icon={
                                <FaHeart className="text-red-primary text-5xl mr-4" />
                            }
                            title={
                                isHistorical
                                    ? "Average Heart Rate"
                                    : "Last Heart Rate"
                            }
                            value={heartRateValue}
                            unit="bpm"
                            data={heartRateData || []}
                            strokeColor="#E46C6C"
                        />

                        {/* bodyTemperatureData */}
                        <ChartSection
                            bgClass="bg-gray-100"
                            icon={
                                <FaTemperatureHigh className="text-cyan-500 text-5xl mr-4" />
                            }
                            title={
                                isHistorical
                                    ? "Average Body Temperature"
                                    : "Last Body Temperature"
                            }
                            value={bodyTemperatureValue}
                            unit="°C"
                            data={bodyTemperatureData || []}
                            strokeColor="#25bfd9"
                        />

                        {/* respiratoryRateData */}
                        <ChartSection
                            bgClass=""
                            icon={
                                <FaHeadSideCough className="text-violet-500 text-5xl mr-4" />
                            }
                            title={
                                isHistorical
                                    ? "Average Respiratory Rate"
                                    : "Last Respiratory Rate"
                            }
                            value={respiratoryRateValue}
                            unit="rpm"
                            data={respiratoryRateData || []}
                            strokeColor="#8884d8"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
