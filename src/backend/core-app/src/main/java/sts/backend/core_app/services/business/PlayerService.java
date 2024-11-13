package sts.backend.core_app.services.business;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

import org.springframework.stereotype.Service;

import sts.backend.core_app.dto.player.SessionsAllDayOfYear;
import sts.backend.core_app.dto.session.SessionInfoView;
import sts.backend.core_app.dto.player.MetricValue;
import sts.backend.core_app.dto.player.RealTimeExtraDetailsPlayer;
import sts.backend.core_app.exceptions.ResourceNotFoundException;
import sts.backend.core_app.models.SensorTimeSeriesData;
import sts.backend.core_app.services.analysis.interfaces.BasicDataAnalysis;
import sts.backend.core_app.services.analysis.interfaces.RealTimeAnalysis;

@Service
public class PlayerService {

    private final BasicDataAnalysis basicDataAnalysis;
    private final RealTimeAnalysis realTimeAnalysis;

    public PlayerService(BasicDataAnalysis basicDataAnalysis, RealTimeAnalysis realTimeAnalysis) {
        this.basicDataAnalysis = basicDataAnalysis;
        this.realTimeAnalysis = realTimeAnalysis;
    }

    public SessionsAllDayOfYear getPlayerSessionsAllDaysOfYear(Long playerId, Long year) throws ResourceNotFoundException {
        Set<SessionInfoView> allSessions = basicDataAnalysis.getSessionsInfoByPlayerId(playerId);

        Map<LocalDate, Integer> sessionsPerDay = new HashMap<>();
        for (SessionInfoView session : allSessions) {
            LocalDate sessionDate = session.getStartTime().toLocalDate();
            if (sessionDate.getYear() == year) {
                sessionsPerDay.put(sessionDate, sessionsPerDay.getOrDefault(sessionDate, 0) + 1);
            }
        }
        return new SessionsAllDayOfYear(playerId, year, sessionsPerDay);
        
    }

    public SensorTimeSeriesData addMetricValue(MetricValue metricValue) throws ResourceNotFoundException {
        return realTimeAnalysis.addMetricValue(metricValue);
    }

    public RealTimeExtraDetailsPlayer getRealTimeExtraDetailsLast24Hours(Long playerId) {
        return realTimeAnalysis.getRealTimeExtraDetailsLast24Hours(playerId);
    }
    
}