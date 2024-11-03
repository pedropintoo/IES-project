package sts.backend.core_app.dto;

import java.time.LocalDateTime;

public interface SessionInfoView {
    Long getSessionId();
    LocalDateTime getStartTime();
    int getNumParticipants();
    String getState();
}