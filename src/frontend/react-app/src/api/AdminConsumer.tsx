interface SensorAssign {
    sensorId: number;
    name: string;
    playerId: number;
}


const addTeamSensor = async (axiosInstance: any, sensorId: number ,teamId: number) => {
    try {
        const response = await axiosInstance.post("/team/sensors", {
            sensorId: sensorId,
            teamId: teamId,
        });

        if (response) {
            const authResponse = response.data;
            return authResponse;
        }
        return null;

    } catch (error) {
        console.error("Error adding new sensor:", error);
        return null;
    }
};

const deleteTeamSensor = async (
    axiosInstance: any, 
    sensorId: number 
) => {
    try {
        console.log("Deleting sensor:", sensorId);

        const response = await axiosInstance.delete(
            "/team/sensors?sensorId=" + sensorId
        );
        
        if (response) {
            console.log(response);
        }

    } catch (error) {
        console.error("Error deleting sensor :", sensorId);
        return null;
    }
};

export { addTeamSensor, deleteTeamSensor };
