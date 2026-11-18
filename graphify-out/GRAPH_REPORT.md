# Graph Report - CSE370  (2026-11-18)

## Corpus Check
- 110 files · ~236,719 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 676 nodes · 1378 edges · 28 communities (25 shown, 3 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 112 edges (avg confidence: 0.8)
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
- compilerOptions
- compilerOptions
- DESIGN.md
- DESIGN.md
- Rightly Architecture (concise)
- SafetyLayout.tsx
- plugins
- React + TypeScript + Vite
- tsconfig.json

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
10. `compilerOptions` - 18 edges

## Surprising Connections (you probably didn't know these)
- `AuthController` --references--> `AuthService`  [EXTRACTED]
  backend-java/src/main/java/bd/rightly/controller/AuthController.java → backend-java/src/main/java/bd/rightly/model/service/AuthService.java
- `VerificationController` --references--> `AuthService`  [EXTRACTED]
  backend-java/src/main/java/bd/rightly/controller/VerificationController.java → backend-java/src/main/java/bd/rightly/model/service/AuthService.java
- `DashboardSummaryResponse` --references--> `VerificationStatus`  [EXTRACTED]
  backend-java/src/main/java/bd/rightly/controller/dto/DashboardSummaryResponse.java → backend-java/src/main/java/bd/rightly/model/entity/VerificationStatus.java
- `RegisterRequest` --references--> `Role`  [EXTRACTED]
  backend-java/src/main/java/bd/rightly/controller/dto/RegisterRequest.java → backend-java/src/main/java/bd/rightly/model/entity/Role.java
- `UserResponse` --references--> `Role`  [EXTRACTED]
  backend-java/src/main/java/bd/rightly/controller/dto/UserResponse.java → backend-java/src/main/java/bd/rightly/model/entity/Role.java

## Import Cycles
- None detected.

## Communities (28 total, 3 thin omitted)

### Community 0 - "AuthService"
Cohesion: 0.06
Nodes (31): ConfigurationProperties, RightlyJwtProperties, ConfigurationProperties, RightlyOtpProperties, RedisKeys, Entity, Table, User (+23 more)

### Community 1 - "UserRepository"
Cohesion: 0.07
Nodes (27): ApplicationArguments, ApplicationRunner, Component, Logger, Override, Transactional, ProfessionalSeedRunner, DashboardController (+19 more)

### Community 2 - "CookieUtils"
Cohesion: 0.08
Nodes (26): AuthUserPrincipal, Bean, Configuration, SecurityConfig, CookieNames, CsrfValidationFilter, Component, FilterChain (+18 more)

### Community 3 - "User"
Cohesion: 0.06
Nodes (64): App(), ProfessionalCard(), RequireAuth(), SiteHeader(), Alert(), Variant, Button(), ButtonLink() (+56 more)

### Community 4 - "AuthController.java"
Cohesion: 0.14
Nodes (13): AuthController, GetMapping, HttpServletResponse, PostMapping, RequestMapping, ResponseEntity, RestController, AuthSessionResult (+5 more)

### Community 5 - "ProfessionalProfile"
Cohesion: 0.06
Nodes (26): DirectoryController, GetMapping, RequestMapping, RestController, DirectoryPageResponse, ProfessionalProfileResponse, Entity, Table (+18 more)

### Community 6 - "ApiException"
Cohesion: 0.08
Nodes (25): ConfigurationProperties, RightlyMinioProperties, MultipartFile, PostMapping, RequestMapping, RestController, VerificationController, ApiException (+17 more)

### Community 7 - "Role"
Cohesion: 0.05
Nodes (39): axios, dependencies, axios, react, react-dom, react-router-dom, devDependencies, oxlint (+31 more)

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
Cohesion: 0.08
Nodes (24): Architecture Protection, Workflow & Verification Rules, Left Out, Locked Decisions, MVC Architecture & Layer Rules, Rightly Sprint-by-Sprint Build Plan (MVC Architecture), Sprint 1 (Weeks 1–2): Core Setup, Auth & Directory, Sprint 2 (Weeks 3–4): Messaging, Scheduling & WebRTC Calls, Sprint 3 (Weeks 5–6): Community, SOS & Evidence Vault (+16 more)

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

### Community 18 - "compilerOptions"
Cohesion: 0.08
Nodes (23): compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection (+15 more)

### Community 19 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, noEmit, noFallthroughCasesInSwitch (+11 more)

### Community 20 - "DESIGN.md"
Cohesion: 0.11
Nodes (17): Accreditation & Legal Badges, Aesthetic Foundation, Brand & Style, Buttons, Cards & Legal Brief Panels, Colors, Components, Elevation & Depth (+9 more)

### Community 21 - "DESIGN.md"
Cohesion: 0.11
Nodes (17): Accreditation & Legal Badges, Aesthetic Foundation, Brand & Style, Buttons, Cards & Legal Brief Panels, Colors, Components, Elevation & Depth (+9 more)

### Community 22 - "Rightly Architecture (concise)"
Cohesion: 0.12
Nodes (15): Authentication (FR-01), Data stores, Directory (FR-10/11), Infrastructure, MVC boundaries, Rightly Architecture (concise), Verification (FR-02), Local URLs (+7 more)

### Community 23 - "SafetyLayout.tsx"
Cohesion: 0.38
Nodes (5): CrisisBar(), SiteFooter(), useQuickExit(), SafetyLayout(), triggerQuickExit()

### Community 24 - "plugins"
Cohesion: 0.22
Nodes (8): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema, oxc, typescript, warn

### Community 25 - "React + TypeScript + Vite"
Cohesion: 0.50
Nodes (3): Expanding the Oxlint configuration, React Compiler, React + TypeScript + Vite

## Knowledge Gaps
- **138 isolated node(s):** `bd.rightly:rightly-backend`, `USER`, `LAWYER`, `PSYCHIATRIST`, `UNVERIFIED` (+133 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `User` connect `AuthService` to `UserRepository`, `ProfessionalProfile`, `ApiException`?**
  _High betweenness centrality (0.055) - this node is a cross-community bridge._
- **Why does `UserRepository` connect `UserRepository` to `AuthService`, `ApiException`?**
  _High betweenness centrality (0.041) - this node is a cross-community bridge._
- **Why does `AuthService` connect `AuthService` to `UserRepository`, `CookieUtils`, `AuthController.java`, `ApiException`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **What connects `bd.rightly:rightly-backend`, `USER`, `LAWYER` to the rest of the system?**
  _138 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `AuthService` be split into smaller, more focused modules?**
  _Cohesion score 0.06234177215189873 - nodes in this community are weakly interconnected._
- **Should `UserRepository` be split into smaller, more focused modules?**
  _Cohesion score 0.07390648567119155 - nodes in this community are weakly interconnected._
- **Should `CookieUtils` be split into smaller, more focused modules?**
  _Cohesion score 0.0782608695652174 - nodes in this community are weakly interconnected._