package bd.rightly.controller.dto;

import bd.rightly.model.entity.VerificationStatus;

public record DashboardSummaryResponse(
        long totalProfessionals,
        long lawyersCount,
        long psychiatristsCount,
        long verifiedUsersCount,
        VerificationStatus verificationStatus) {
}