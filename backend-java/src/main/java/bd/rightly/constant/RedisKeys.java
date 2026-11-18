package bd.rightly.constant;

import java.util.UUID;

public final class RedisKeys {

    public static final String OTP_PREFIX = "rightly:otp:";
    public static final String OTP_SEND_PREFIX = "rightly:otp-send:";
    public static final String DIRECTORY_DEFAULT = "rightly:directory:default";

    public static String otp(UUID userId) {
        return OTP_PREFIX + userId;
    }

    public static String otpSend(UUID userId) {
        return OTP_SEND_PREFIX + userId;
    }

    private RedisKeys() {
    }
}