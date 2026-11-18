# Graph Report - .  (2026-11-18)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 382 nodes · 905 edges · 18 communities (16 shown, 2 thin omitted)
- Extraction: 88% EXTRACTED · 12% INFERRED · 0% AMBIGUOUS · INFERRED: 112 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- AuthService
- UserRepository
- CookieUtils
- User
- AuthController.java
- ProfessionalProfile
- ApiException
- Role
- HealthService
- GlobalExceptionHandler.java
- CorsConfig.java
- ProfileController.java
- LocalNotificationGateway
- RedisConfig.java
- MinioConfig.java
- RightlyConfig.java
- RightlyApplication
- bd.rightly:rightly-backend

## God Nodes (most connected - your core abstractions)
1. `User` - 40 edges
2. `ProfessionalProfile` - 37 edges
3. `AuthService` - 29 edges
4. `UserRepository` - 25 edges
5. `Role` - 23 edges
6. `ApiException` - 22 edges
7. `ProfessionalProfileRepository` - 19 edges
8. `VerificationStatus` - 18 edges
9. `AuthServiceTest` - 18 edges
10. `VerificationService` - 15 edges

## Surprising Connections (you probably didn't know these)
- `AuthController` --references--> `AuthService`  [EXTRACTED]
  backend-java/src/main/java/bd/rightly/controller/AuthController.java → backend-java/src/main/java/bd/rightly/model/service/AuthService.java
- `ProfileController` --references--> `ProfileService`  [EXTRACTED]
  backend-java/src/main/java/bd/rightly/controller/ProfileController.java → backend-java/src/main/java/bd/rightly/model/service/ProfileService.java
- `VerificationController` --references--> `VerificationService`  [EXTRACTED]
  backend-java/src/main/java/bd/rightly/controller/VerificationController.java → backend-java/src/main/java/bd/rightly/model/service/VerificationService.java
- `RegisterRequest` --references--> `Role`  [EXTRACTED]
  backend-java/src/main/java/bd/rightly/controller/dto/RegisterRequest.java → backend-java/src/main/java/bd/rightly/model/entity/Role.java
- `UserResponse` --references--> `Role`  [EXTRACTED]
  backend-java/src/main/java/bd/rightly/controller/dto/UserResponse.java → backend-java/src/main/java/bd/rightly/model/entity/Role.java

## Import Cycles
- None detected.

## Communities (18 total, 2 thin omitted)

### Community 0 - "AuthService"
Cohesion: 0.08
Nodes (28): ConfigurationProperties, RightlyJwtProperties, ConfigurationProperties, RightlyOtpProperties, RedisKeys, RequestMapping, RestController, VerificationController (+20 more)

### Community 1 - "UserRepository"
Cohesion: 0.08
Nodes (26): ApplicationArguments, ApplicationRunner, Component, Logger, Override, Transactional, ProfessionalSeedRunner, DashboardController (+18 more)

### Community 2 - "CookieUtils"
Cohesion: 0.08
Nodes (26): AuthUserPrincipal, Bean, Configuration, SecurityConfig, CookieNames, CsrfValidationFilter, Component, FilterChain (+18 more)

### Community 3 - "User"
Cohesion: 0.15
Nodes (4): Entity, Table, User, Test

### Community 4 - "AuthController.java"
Cohesion: 0.10
Nodes (16): AuthController, GetMapping, HttpServletResponse, PostMapping, RequestMapping, ResponseEntity, RestController, AuthSessionResult (+8 more)

### Community 5 - "ProfessionalProfile"
Cohesion: 0.12
Nodes (4): Entity, Table, ProfessionalProfile, Transactional

### Community 6 - "ApiException"
Cohesion: 0.14
Nodes (14): ConfigurationProperties, RightlyMinioProperties, ApiException, IdentityVerifier, MinioClient, Override, Service, LocalIdentityVerifier (+6 more)

### Community 7 - "Role"
Cohesion: 0.13
Nodes (19): DirectoryController, GetMapping, RequestMapping, RestController, DirectoryPageResponse, ProfessionalProfileResponse, Role, LAWYER (+11 more)

### Community 8 - "HealthService"
Cohesion: 0.22
Nodes (9): HealthController, GetMapping, RequestMapping, ResponseEntity, RestController, HealthService, Service, StringRedisTemplate (+1 more)

### Community 9 - "GlobalExceptionHandler.java"
Cohesion: 0.31
Nodes (8): ErrorResponse, GlobalExceptionHandler, HttpServletRequest, Logger, ResponseEntity, ExceptionHandler, MethodArgumentNotValidException, RestControllerAdvice

### Community 10 - "CorsConfig.java"
Cohesion: 0.33
Nodes (6): CorsConfig, Bean, Configuration, ConfigurationProperties, RightlyCorsProperties, CorsConfigurationSource

### Community 11 - "ProfileController.java"
Cohesion: 0.33
Nodes (5): ProfileUpdateRequest, RequestMapping, RestController, ProfileController, PutMapping

### Community 12 - "LocalNotificationGateway"
Cohesion: 0.36
Nodes (5): Logger, Override, Service, LocalNotificationGateway, JavaMailSender

### Community 13 - "RedisConfig.java"
Cohesion: 0.48
Nodes (5): Bean, Configuration, StringRedisTemplate, RedisConfig, RedisConnectionFactory

### Community 14 - "MinioConfig.java"
Cohesion: 0.53
Nodes (4): Bean, Configuration, MinioClient, MinioConfig

### Community 15 - "RightlyConfig.java"
Cohesion: 0.83
Nodes (3): Configuration, RightlyConfig, EnableConfigurationProperties

## Knowledge Gaps
- **8 isolated node(s):** `bd.rightly:rightly-backend`, `USER`, `LAWYER`, `PSYCHIATRIST`, `UNVERIFIED` (+3 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `User` connect `User` to `AuthService`, `UserRepository`, `ProfessionalProfile`, `ApiException`, `Role`?**
  _High betweenness centrality (0.163) - this node is a cross-community bridge._
- **Why does `UserRepository` connect `UserRepository` to `AuthService`, `User`, `ApiException`?**
  _High betweenness centrality (0.124) - this node is a cross-community bridge._
- **Why does `AuthService` connect `AuthService` to `UserRepository`, `CookieUtils`, `User`, `AuthController.java`?**
  _High betweenness centrality (0.106) - this node is a cross-community bridge._
- **What connects `bd.rightly:rightly-backend`, `USER`, `LAWYER` to the rest of the system?**
  _8 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `AuthService` be split into smaller, more focused modules?**
  _Cohesion score 0.08421985815602837 - nodes in this community are weakly interconnected._
- **Should `UserRepository` be split into smaller, more focused modules?**
  _Cohesion score 0.08325624421831637 - nodes in this community are weakly interconnected._
- **Should `CookieUtils` be split into smaller, more focused modules?**
  _Cohesion score 0.08080808080808081 - nodes in this community are weakly interconnected._