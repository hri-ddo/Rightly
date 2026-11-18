package bd.rightly.model.service;

import java.util.LinkedHashMap;
import java.util.Map;
import javax.sql.DataSource;
import org.springframework.data.redis.core.RedisCallback;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

@Service
public class HealthService {

    private final DataSource dataSource;
    private final StringRedisTemplate redisTemplate;

    public HealthService(DataSource dataSource, StringRedisTemplate redisTemplate) {
        this.dataSource = dataSource;
        this.redisTemplate = redisTemplate;
    }

    public Map<String, Object> check() {
        Map<String, Object> body = new LinkedHashMap<>();
        boolean postgresUp = checkPostgres();
        boolean redisUp = checkRedis();
        body.put("status", postgresUp && redisUp ? "UP" : "DOWN");
        body.put("postgres", postgresUp ? "UP" : "DOWN");
        body.put("redis", redisUp ? "UP" : "DOWN");
        return body;
    }

    private boolean checkPostgres() {
        try (var connection = dataSource.getConnection();
                var statement = connection.createStatement();
                var rs = statement.executeQuery("SELECT 1")) {
            return rs.next();
        } catch (Exception e) {
            return false;
        }
    }

    private boolean checkRedis() {
        try {
            String pong = redisTemplate.execute((RedisCallback<String>) connection -> connection.ping());
            return "PONG".equalsIgnoreCase(pong);
        } catch (Exception e) {
            return false;
        }
    }
}