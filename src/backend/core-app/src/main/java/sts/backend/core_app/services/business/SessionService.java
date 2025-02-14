package sts.backend.core_app.services.business;

import java.time.LocalDateTime;
import java.util.Set;

import org.springframework.stereotype.Service;

import sts.backend.core_app.dto.session.AssignSessionPlayer;
import sts.backend.core_app.dto.session.HistoricalExtraDetailsResponse;
import sts.backend.core_app.dto.session.MatchRequest;
import sts.backend.core_app.dto.session.NotificationResponse;
import sts.backend.core_app.dto.session.RealTimeExtraDetailsResponse;
import sts.backend.core_app.dto.session.RealTimeInfoResponse;
import sts.backend.core_app.dto.session.SessionInfoView;
import sts.backend.core_app.dto.session.SessionRequest;
import sts.backend.core_app.exceptions.ResourceNotFoundException;
import sts.backend.core_app.models.Match;
import sts.backend.core_app.models.PlayerSession;
import sts.backend.core_app.models.PlayerSessionId;
import sts.backend.core_app.models.Session;
import sts.backend.core_app.models.Team;
import sts.backend.core_app.services.analysis.HistoricalAnalysisImpl;
import sts.backend.core_app.services.analysis.RealTimeAnalysisImpl;
import sts.backend.core_app.services.analysis.interfaces.BasicDataAnalysis;
import sts.backend.core_app.services.analysis.interfaces.RealTimeAnalysis;

@Service
public class SessionService {

    private final BasicDataAnalysis basicDataAnalysis;
    private final RealTimeAnalysis realTimeAnalysis;
    private final HistoricalAnalysisImpl historicalAnalysisImpl;
    private final RealTimeAnalysisImpl realTimeAnalysisImpl;

    public SessionService(BasicDataAnalysis basicDataAnalysis, RealTimeAnalysis realTimeAnalysis, HistoricalAnalysisImpl historicalAnalysisImpl, RealTimeAnalysisImpl realTimeAnalysisImpl) {
        this.basicDataAnalysis = basicDataAnalysis;
        this.realTimeAnalysis = realTimeAnalysis;
        this.historicalAnalysisImpl = historicalAnalysisImpl;
        this.realTimeAnalysisImpl = realTimeAnalysisImpl;
    }

    public Set<SessionInfoView> getSessionsInfoByTeamId(Long teamId) throws ResourceNotFoundException {
        Team team = basicDataAnalysis.getTeamById(teamId);
        return basicDataAnalysis.getSessionsInfoByTeamId(team);
    }

    public Session getSessionInfo(Long sessionId) throws ResourceNotFoundException {
        return basicDataAnalysis.getSessionById(sessionId);
    }

    public Session createSession(SessionRequest sessionRequest) throws ResourceNotFoundException {
        Session session = new Session();
        session.setName(sessionRequest.getName());
        session.setStartTime(LocalDateTime.now());
        session.setEndTime(null);
        session.setTrainer(basicDataAnalysis.getTrainerById(sessionRequest.getTrainerId()));
        return basicDataAnalysis.createSession(session);
    }

    public Session createMatch(MatchRequest matchRequest) throws ResourceNotFoundException {
        Match match = new Match();
        match.setOpponentTeam(matchRequest.getOpponentTeam());
        match.setType(matchRequest.getType());
        match.setLocation(matchRequest.getLocation());
        match.setWeather(matchRequest.getWeather());

        match.setName(matchRequest.getName());
        match.setStartTime(LocalDateTime.now());
        match.setEndTime(null);
        match.setTrainer(basicDataAnalysis.getTrainerById(matchRequest.getTrainerId()));

        return basicDataAnalysis.createMatch(match);
    }

    public Session endSession(Long sessionId) throws ResourceNotFoundException {
        Session session = basicDataAnalysis.getSessionById(sessionId);
        session.setEndTime(LocalDateTime.now());
        return basicDataAnalysis.createSession(session);
    }

    public PlayerSession assignPlayer(AssignSessionPlayer assignSessionPlayer) throws ResourceNotFoundException{
        PlayerSession playerSession = new PlayerSession();
        Long playerId = assignSessionPlayer.getPlayerId();
        Long sessionId = assignSessionPlayer.getSessionId();
        playerSession.setPlayer(basicDataAnalysis.getPlayerById(playerId));
        playerSession.setSession(basicDataAnalysis.getSessionById(sessionId));
        playerSession.setId(new PlayerSessionId(playerId, sessionId));
        return basicDataAnalysis.createPlayerSession(playerSession);
    }

    public Set<SessionInfoView> getSessionsInfoByPlayerId(Long playerId) throws ResourceNotFoundException {
        return basicDataAnalysis.getSessionsInfoByPlayerId(playerId);
    }

    public RealTimeInfoResponse getRealTimeInfo(Long sessionId) throws ResourceNotFoundException {
        return realTimeAnalysisImpl.getRealTimeInfo(sessionId);
    }

    public RealTimeInfoResponse getRealTimeInfoTrainer(Long trainerId) throws ResourceNotFoundException {
        return realTimeAnalysisImpl.getRealTimeInfoTrainer(trainerId);
    }

    public RealTimeExtraDetailsResponse getRealTimeExtraDetails(Long sessionId, Long playerId) throws ResourceNotFoundException {
        return realTimeAnalysisImpl.getRealTimeExtraDetails(sessionId, playerId);
    }

    public Set<NotificationResponse> getNotifications(Long sessionId) throws ResourceNotFoundException {
        return realTimeAnalysis.getNotifications(sessionId);
    }

    public HistoricalExtraDetailsResponse getHistoricalExtraDetails(Long sessionId, Long playerId) throws ResourceNotFoundException {
        return historicalAnalysisImpl.getHistoricalExtraDetails(sessionId, playerId);
    }

    public HistoricalExtraDetailsResponse getHistoricalInfo(Long sessionId) throws ResourceNotFoundException {
        return historicalAnalysisImpl.getHistoricalInfo(sessionId);
    }

}