namespace QLNT_TKYC.API.Common.Constants;

public static class RegistrationConstants
{
    public enum RegistrationStatus
    {
        DRAFT,
        SUBMITTED,
        UNDER_REVIEW,
        NEED_MORE_INFO,
        APPROVED,
        ACTIVE,
        REJECTED,
        WITHDRAWN,
        EXPIRED,
        TERMINATED
    }

    public enum RequestType
    {
        RENEWAL,
        CHANGE_ADDRESS,
        TERMINATION
    }
}
