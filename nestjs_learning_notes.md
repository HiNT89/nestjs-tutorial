Giai đoạn 1: Nền tảng Backend & NestJS cơ bản

Ôn lại kiến thức cơ bản về Node.js (event loop, async/await, module system).

TypeScript căn bản (interface, class, decorator, generic).

NestJS Core:

Module, Controller, Service

Dependency Injection

DTO (Data Transfer Object)

Pipes, Guards, Interceptors

👉 Dự án mini: Todo API (CRUD cơ bản, chưa dùng DB).

Giai đoạn 2: Làm việc với Database

ORM: TypeORM / Prisma (mình khuyên dùng TypeORM để nắm entity rõ ràng).

PostgreSQL (schema, table, relation).

Repository pattern trong NestJS.

Migration, Seeder.

Pagination, Filtering, Sorting.

👉 Dự án mini: User + Auth API (JWT, Refresh Token, PostgreSQL).

Giai đoạn 3: Xây dựng API nâng cao

Middleware (logging, request validation).

Exception filter.

Guards (role-based, permission-based).

File upload (Multer).

WebSocket (real-time).

Swagger (API documentation).

👉 Dự án mini: Blog API (User, Post, Comment, Like, Role-based Access).

Giai đoạn 4: Production-ready Backend

Caching (Redis).

Rate limiting.

Queues (BullMQ).

Config module (dotenv).

Testing (Unit test + E2E test).

CI/CD cơ bản (Docker + Deploy).


# Backend NestJS Learning Notes

## Phase 1 – NestJS Cơ bản
- Cấu trúc project NestJS (Module, Controller, Service).
- Dependency Injection.
- DTO (Data Transfer Object) + Validation (class-validator).
- Global ValidationPipe (whitelist, transform).
- Response Interceptor & HttpExceptionFilter cơ bản.
- Bài tập: TodoModule (CRUD in-memory).

## Phase 2 – Database + Auth + Response chuẩn

### 2.1 PostgreSQL + TypeORM
- Cài PostgreSQL (local/Docker).
- Tích hợp TypeORM vào NestJS (forRootAsync với ConfigService).
- Entity, Repository, QueryBuilder.
- Migration chuẩn (TypeORM 0.3+).
- Seeder dữ liệu.
- Bài tập: UserModule + CRUD user.

### 2.2 Authentication (JWT + Refresh Token)
- Cài passport, jwt, bcrypt.
- LocalStrategy (validate email + password).
- JwtStrategy (parse access token).
- AuthService (register, login, refresh).
- IssueTokens: accessToken + refreshToken.
- Bảo mật password với bcrypt.
- Lưu ý: `passwordHash` select: false.
- Bài tập: AuthModule (register, login, refresh).

### 2.3 Pagination, Filtering, Sorting, Soft Delete
- Query DTO (page, limit, search, sortBy, order).
- Service: findAndCount, meta (total, totalPages, hasNext, hasPrev).
- Soft Delete: `@DeleteDateColumn`, `repo.softDelete()`, `repo.restore()`.
- Response Envelope chuẩn (success, data, meta).
- Global ResponseInterceptor (format response).
- Error Filter (HttpExceptionFilter).
- DTO với class-transformer (Expose/Exclude).
- Global BaseResponseDto, PaginatedResponseDto<T>.
- LiteResponseDto + helper `toLiteDto()` cho quan hệ.
- Generic `paginate<T>()` helper (Repository hoặc QueryBuilder).
- Bài tập: chuẩn hoá response + list endpoint.

## Phase 3 – API nâng cao

### 3.1 Role-Based Access Control (RBAC)
- User.role (enum: admin, manager, user).
- Nhét role vào JWT payload.
- @Roles() decorator + RolesGuard.
- @CurrentUser() decorator (custom param decorator).
- Guard kết hợp với AuthGuard('jwt').
- Seeder tạo admin user.
- Best practice: có thể nâng lên Role + Permissions (nhiều role, bảng permissions).
- Bài tập: chặn route theo role.

---

## Tiếp theo (chưa học)
- Refresh Token Rotation + Revoke.
- File Upload (Multer + S3).
- Caching với Redis.
- Rate limiting.
- Testing (Unit test + E2E).
- CI/CD với Docker.
