package bd.rightly.model.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class LocalNotificationGateway implements NotificationGateway {

    private static final Logger log = LoggerFactory.getLogger(LocalNotificationGateway.class);

    private final JavaMailSender mailSender;

    public LocalNotificationGateway(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Override
    public void sendEmail(String to, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
        } catch (Exception ex) {
            log.warn("Failed to send email to {}: {}", to, ex.getMessage());
        }
    }

    @Override
    public void sendSms(String phone, String message) {
        log.info("SMS to {}: {}", phone, message);
    }
}