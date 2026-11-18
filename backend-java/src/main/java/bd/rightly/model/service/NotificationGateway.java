package bd.rightly.model.service;

public interface NotificationGateway {

    void sendEmail(String to, String subject, String body);

    void sendSms(String phone, String message);
}