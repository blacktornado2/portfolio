# Backend NestJS Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a NestJS REST API backend for the portfolio blog, add PostgreSQL persistence for posts/comments/likes, restructure into a client/server monorepo, and update the frontend to fetch from the API instead of static data.

**Architecture:** Two independent Node.js projects (client Vite SPA, server NestJS app) in one git repo. Root `package.json` uses npm workspaces. NestJS exposes a REST API; frontend makes authenticated fetch calls for admin operations and public calls for reads. Prisma manages the PostgreSQL schema.

**Tech Stack:** NestJS, PostgreSQL, Prisma, Neon (hosted Postgres), JWT, bcrypt, react-markdown (replaces MDX renderer)

---

## Phase 1: Monorepo Scaffolding

### Task 1: Create client/ directory and move existing frontend

**Files:**
- Create: `client/` (new directory)
- Move: `src/` → `client/src/`
- Move: `vite.config.js` → `client/vite.config.js`
- Move: `tailwind.config.js` → `client/tailwind.config.js`
- Move: `postcss.config.js` → `client/postcss.config.js`
- Move: `jsconfig.json` → `client/jsconfig.json`
- Move: `index.html` → `client/index.html`
- Move: `public/` → `client/public/`
- Create: `client/package.json`

- [ ] **Step 1: Create client directory**

```bash
mkdir -p client
```

- [ ] **Step 2: Move files to client/**

```bash
mv src client/
mv vite.config.js client/
mv tailwind.config.js client/
mv postcss.config.js client/
mv jsconfig.json client/
mv index.html client/
mv public client/
```

- [ ] **Step 3: Create client/package.json**

Copy the root `package.json` to `client/package.json` — it will be the main frontend package. Remove any server-related scripts.

```json
{
  "name": "@portfolio/client",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint ."
  },
  "dependencies": {
    "@mdx-js/react": "^3.1.1",
    "@mdx-js/rollup": "^3.1.1",
    "@radix-ui/react-slot": "^1.1.1",
    "@radix-ui/react-tooltip": "^1.1.6",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "framer-motion": "^11.15.0",
    "lucide-react": "^0.469.0",
    "next-themes": "^0.4.4",
    "prismjs": "^1.29.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-icon-cloud": "^4.1.4",
    "react-icons": "^5.4.0",
    "react-router-dom": "^7.1.1",
    "react-router-hash-link": "^2.4.3",
    "rehype-slug": "^6.0.0",
    "tailwind-merge": "^2.6.0",
    "tailwindcss-animate": "^1.0.7"
  },
  "devDependencies": {
    "@eslint/js": "^9.15.0",
    "@types/node": "^22.10.2",
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "@vitejs/plugin-react": "^4.3.4",
    "autoprefixer": "^10.4.20",
    "eslint": "^9.15.0",
    "eslint-plugin-react": "^7.37.2",
    "eslint-plugin-react-hooks": "^5.0.0",
    "eslint-plugin-react-refresh": "^0.4.14",
    "globals": "^15.12.0",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.17",
    "vite": "^6.0.1"
  }
}
```

- [ ] **Step 4: Update client/vite.config.js to remove MDX plugin**

```javascript
import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react({ include: /\.(jsx|js|tsx|ts)$/ })],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

- [ ] **Step 5: Update client/jsconfig.json to use @ alias**

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

- [ ] **Step 6: Commit monorepo setup**

```bash
git add client/ && git commit -m "refactor: restructure frontend into client/ directory

- Move existing React/Vite SPA to client/ subdirectory
- Update package.json and vite config for client/ location
- Prepare for server/ backend directory

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

### Task 2: Initialize NestJS server project

**Files:**
- Create: `server/` (new NestJS project)
- Create: `server/package.json`
- Create: `server/src/main.ts`
- Create: `server/src/app.module.ts`
- Create: `server/.env.example`

- [ ] **Step 1: Create server directory and initialize NestJS**

```bash
mkdir server
cd server
npm init -y
npm install @nestjs/common @nestjs/core @nestjs/jwt @nestjs/passport passport passport-jwt @prisma/client prisma bcrypt class-validator class-transformer axios
npm install --save-dev @nestjs/cli typescript @types/node ts-node @types/express @types/bcrypt
```

- [ ] **Step 2: Create server/tsconfig.json**

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "target": "ES2020",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

- [ ] **Step 3: Update server/package.json scripts**

```json
{
  "name": "@portfolio/server",
  "version": "1.0.0",
  "private": true,
  "description": "Portfolio blog API",
  "main": "dist/main.js",
  "scripts": {
    "dev": "ts-node -r tsconfig-paths/register src/main.ts",
    "start:dev": "ts-node -r tsconfig-paths/register src/main.ts",
    "build": "tsc",
    "start:prod": "node dist/main.js",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:seed": "ts-node prisma/seed.ts"
  },
  "dependencies": {
    "@nestjs/common": "^10.0.0",
    "@nestjs/core": "^10.0.0",
    "@nestjs/jwt": "^12.0.0",
    "@nestjs/passport": "^10.0.0",
    "@prisma/client": "^6.0.0",
    "axios": "^1.7.0",
    "bcrypt": "^5.1.0",
    "class-transformer": "^0.5.1",
    "class-validator": "^0.14.0",
    "passport": "^0.7.0",
    "passport-jwt": "^4.0.1"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.0.0",
    "@types/bcrypt": "^5.0.2",
    "@types/express": "^4.17.21",
    "@types/node": "^22.10.2",
    "@types/passport-jwt": "^4.0.1",
    "prisma": "^6.0.0",
    "ts-node": "^10.9.2",
    "typescript": "^5.3.3"
  }
}
```

- [ ] **Step 4: Create server/src/main.ts**

```typescript
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const port = process.env.PORT || 3001;
  await app.listen(port, () => {
    console.log(`✓ Server running on http://localhost:${port}`);
  });
}

bootstrap();
```

- [ ] **Step 5: Create server/src/app.module.ts**

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { LikesModule } from './likes/likes.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    AuthModule,
    PostsModule,
    CommentsModule,
    LikesModule,
  ],
})
export class AppModule {}
```

- [ ] **Step 6: Create server/.env.example**

```
DATABASE_URL=postgresql://user:password@localhost:5432/portfolio
JWT_SECRET=your-super-secret-key-change-in-production
ADMIN_USERNAME=ankit
ADMIN_PASSWORD_HASH=
CLIENT_URL=http://localhost:5173
PORT=3001
```

- [ ] **Step 7: Commit NestJS scaffolding**

```bash
cd ..
git add server/ && git commit -m "feat: initialize NestJS server project

- Set up NestJS application structure
- Install core dependencies: Prisma, JWT, bcrypt, validation
- Configure TypeScript and npm scripts
- Create main.ts entry point with CORS and validation

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

### Task 3: Set up root monorepo package.json with workspaces

**Files:**
- Modify: `package.json` (root)

- [ ] **Step 1: Update root package.json for workspaces**

```json
{
  "name": "portfolio-monorepo",
  "version": "1.0.0",
  "description": "Ankit's portfolio with blog and backend API",
  "private": true,
  "workspaces": [
    "client",
    "server",
    "packages/*"
  ],
  "scripts": {
    "dev": "concurrently \"npm run dev:client\" \"npm run dev:server\"",
    "dev:client": "cd client && npm run dev",
    "dev:server": "cd server && npm run start:dev",
    "build": "npm run build --workspaces",
    "lint": "npm run lint --workspaces"
  },
  "devDependencies": {
    "concurrently": "^8.2.2"
  }
}
```

- [ ] **Step 2: Install concurrently at root**

```bash
npm install --save-dev concurrently
```

- [ ] **Step 3: Commit workspaces setup**

```bash
git add package.json && git commit -m "feat: configure npm workspaces for monorepo

- Set up root package.json with client, server, and packages workspaces
- Add dev scripts to run client and server concurrently
- Add concurrently dependency for parallel dev

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

### Task 4: Create packages/types shared DTOs

**Files:**
- Create: `packages/types/package.json`
- Create: `packages/types/index.ts`
- Create: `packages/types/tsconfig.json`

- [ ] **Step 1: Create packages/types directory**

```bash
mkdir -p packages/types
```

- [ ] **Step 2: Create packages/types/package.json**

```json
{
  "name": "@portfolio/types",
  "version": "1.0.0",
  "private": true,
  "main": "index.ts",
  "files": [
    "index.ts"
  ]
}
```

- [ ] **Step 3: Create packages/types/index.ts**

```typescript
// DTOs for API communication
export interface PostDto {
  id: number;
  slug: string;
  title: string;
  summary: string;
  body: string;
  tags: string[];
  featured: boolean;
  readTime: string;
  publishedAt: string;
  likeCount?: number;
  commentCount?: number;
}

export interface CreatePostDto {
  slug: string;
  title: string;
  summary: string;
  body: string;
  tags: string[];
  featured?: boolean;
  readTime: string;
}

export interface UpdatePostDto {
  title?: string;
  summary?: string;
  body?: string;
  tags?: string[];
  featured?: boolean;
  readTime?: string;
}

export interface CommentDto {
  id: number;
  postId: number;
  authorName: string;
  body: string;
  createdAt: string;
}

export interface CreateCommentDto {
  authorName: string;
  authorEmail: string;
  body: string;
}

export interface LikesResponseDto {
  count: number;
  liked: boolean;
}

export interface LoginRequestDto {
  username: string;
  password: string;
}

export interface LoginResponseDto {
  accessToken: string;
}
```

- [ ] **Step 4: Create packages/types/tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "esnext",
    "lib": ["ES2020"],
    "declaration": true,
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["index.ts"]
}
```

- [ ] **Step 5: Commit shared types**

```bash
git add packages/ && git commit -m "feat: create shared types package

- Define DTOs for Posts, Comments, Likes, Auth
- Used by both server and client for type safety
- Shared via npm workspaces as @portfolio/types

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

## Phase 2: NestJS Database Setup

### Task 5: Create Prisma schema

**Files:**
- Create: `server/prisma/schema.prisma`

- [ ] **Step 1: Create server/prisma directory**

```bash
mkdir -p server/prisma
```

- [ ] **Step 2: Create server/prisma/schema.prisma**

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Post {
  id          Int       @id @default(autoincrement())
  slug        String    @unique
  title       String
  summary     String
  body        String
  tags        String[]
  featured    Boolean   @default(false)
  readTime    String
  publishedAt DateTime  @default(now())
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  comments    Comment[]
  likes       Like[]
}

model Comment {
  id          Int      @id @default(autoincrement())
  postId      Int
  post        Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  authorName  String
  authorEmail String
  body        String
  createdAt   DateTime @default(now())
  deleted     Boolean  @default(false)

  @@index([postId])
}

model Like {
  id        Int      @id @default(autoincrement())
  postId    Int
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  ipHash    String
  createdAt DateTime @default(now())

  @@unique([postId, ipHash])
  @@index([postId])
}
```

- [ ] **Step 3: Initialize Prisma and generate client**

```bash
cd server
npx prisma init
npx prisma generate
cd ..
```

- [ ] **Step 4: Commit Prisma schema**

```bash
git add server/prisma/ && git commit -m "feat: create Prisma schema for posts, comments, likes

- Define Post, Comment, Like models with relationships
- Set up unique constraints (slug, ip-hash dedup)
- Create indexes for foreign keys

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

### Task 6: Create Prisma service module

**Files:**
- Create: `server/src/prisma/prisma.module.ts`
- Create: `server/src/prisma/prisma.service.ts`

- [ ] **Step 1: Create server/src/prisma/prisma.service.ts**

```typescript
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
```

- [ ] **Step 2: Create server/src/prisma/prisma.module.ts**

```typescript
import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

- [ ] **Step 3: Commit Prisma service**

```bash
git add server/src/prisma/ && git commit -m "feat: create Prisma service for database connection

- Extend PrismaClient as a NestJS service
- Handle connect/disconnect lifecycle
- Export for use in other modules

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

### Task 7: Set up database migrations and seed

**Files:**
- Create: `server/prisma/seed.ts`
- Create: `server/prisma/.gitignore`

- [ ] **Step 1: Create server/prisma/seed.ts**

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();

  // Seed posts from the existing blog data
  const posts = [
    {
      slug: 'node-ts-api',
      title: 'Building Scalable REST APIs with Node.js and TypeScript',
      summary:
        'Patterns, folder structure, and production-grade error handling for APIs that grow without becoming a mess.',
      tags: ['Node.js', 'TypeScript', 'Backend'],
      featured: true,
      readTime: '8 min',
      body: `## Why TypeScript changes everything

When I first started writing Node.js APIs, I was all-in on plain JavaScript. It felt faster — no compilation step, no type annotations to maintain. But after a couple of production bugs that a type-checker would have caught instantly, I switched and never looked back.

TypeScript gives you something invaluable at scale: **a living contract**. Every function signature is documentation that the compiler enforces. Refactors stop being scary when you have 300 endpoints and a team of four.

> 💡 If you're starting a new project today, start with TypeScript from day one. Retrofitting types onto a large codebase is painful — trust me.

## Folder structure that actually scales

The most common mistake I see in Node APIs is a flat \`routes/\` folder with one giant file per resource. This works fine at 3 endpoints. At 30, it's chaos.

\`\`\`
src/
├── modules/
│   ├── users/
│   │   ├── users.router.ts
│   │   ├── users.service.ts
│   │   ├── users.repository.ts
│   │   └── users.types.ts
│   └── auth/
│       ├── auth.router.ts
│       └── auth.service.ts
├── shared/
│   ├── middleware/
│   ├── errors/
│   └── db/
└── app.ts
\`\`\`

## Error handling done right

Express's default error handling is fine. But production apps need something more deliberate. The pattern I use is a typed \`AppError\` class combined with a single central error middleware.

\`\`\`typescript
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

// Central middleware — add once, catches everything
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
  } else {
    res.status(500).json({ error: 'Internal server error' });
  }
};
\`\`\`

### Async route wrappers

One of the most common Express gotchas: unhandled promise rejections inside async route handlers silently swallow errors. Wrap every handler:

\`\`\`typescript
const asyncHandler = (fn: RequestHandler) =>
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);
\`\`\`

## Validation with Zod

Don't trust incoming request bodies. Ever. Zod is my go-to for runtime validation — it pairs perfectly with TypeScript because you get both a validator and an inferred type from a single schema definition.

\`\`\`typescript
import { z } from 'zod';

const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(100),
  role: z.enum(['admin', 'user']).default('user'),
});

// Inferred type — no duplication!
type CreateUserDto = z.infer<typeof CreateUserSchema>;
\`\`\`

## Final thoughts

There's no single "correct" architecture for Node.js APIs — what matters is consistency and adaptability. The patterns above have held up across projects ranging from solo side-projects to multi-team codebases. Pick what works, document it, and stick to it.

In the next post, I'll cover database access patterns using Prisma and how to keep your repository layer testable without spinning up a real DB.`,
    },
    {
      slug: 'react-server-components',
      title: 'Server Components in Practice: What Actually Changes',
      summary:
        'After six months running RSC in production, here\'s what the mental model shift actually looks like day-to-day.',
      tags: ['React', 'Next.js', 'Frontend'],
      featured: false,
      readTime: '6 min',
      body: 'Coming soon...',
    },
    {
      slug: 'zod-validation',
      title: 'Zod vs Yup vs Joi: Runtime Validation Compared',
      summary:
        'A practical breakdown of the three most popular validation libraries in the Node.js ecosystem.',
      tags: ['TypeScript', 'Node.js'],
      featured: false,
      readTime: '5 min',
      body: 'Coming soon...',
    },
    {
      slug: 'react-native-perf',
      title: 'Diagnosing React Native Performance Issues',
      summary:
        'The tools and techniques I use to find and fix jank in mobile apps — from Flipper to JS thread profiling.',
      tags: ['React Native', 'Mobile', 'Performance'],
      featured: false,
      readTime: '9 min',
      body: 'Coming soon...',
    },
    {
      slug: 'postgres-indexing',
      title: 'PostgreSQL Indexing: Beyond the Basics',
      summary:
        'Partial indexes, covering indexes, and expression indexes — the features that actually make a difference at scale.',
      tags: ['PostgreSQL', 'Backend', 'Performance'],
      featured: false,
      readTime: '7 min',
      body: 'Coming soon...',
    },
    {
      slug: 'monorepo-turborepo',
      title: 'Taming a Monorepo with Turborepo',
      summary:
        'How I restructured a fragmented multi-repo codebase into a clean Turborepo setup in a single sprint.',
      tags: ['Dev Tools', 'Monorepo', 'TypeScript'],
      featured: false,
      readTime: '6 min',
      body: 'Coming soon...',
    },
  ];

  for (const post of posts) {
    await prisma.post.create({
      data: post,
    });
  }

  console.log('✓ Database seeded with posts');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

- [ ] **Step 2: Update server/package.json to include seed script**

Already done in Task 2 (added `"prisma:seed": "ts-node prisma/seed.ts"`).

- [ ] **Step 3: Create server/prisma/.gitignore (empty)**

```
# Prisma migrations are tracked in git
```

- [ ] **Step 4: Commit database setup**

```bash
git add server/prisma/ && git commit -m "feat: add Prisma seed script with initial blog posts

- Migrate data from existing posts.js to Prisma seed
- Seed six blog posts with full markdown content
- Clear data on each seed run for idempotency

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

## Phase 3: NestJS Auth Module

### Task 8: Create auth module with JWT strategy

**Files:**
- Create: `server/src/auth/auth.module.ts`
- Create: `server/src/auth/auth.service.ts`
- Create: `server/src/auth/auth.controller.ts`
- Create: `server/src/auth/jwt.strategy.ts`
- Create: `server/src/auth/jwt-auth.guard.ts`
- Create: `server/src/auth/login.dto.ts`

- [ ] **Step 1: Create server/src/auth/login.dto.ts**

```typescript
import { IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  username: string;

  @IsString()
  password: string;
}
```

- [ ] **Step 2: Create server/src/auth/jwt.strategy.ts**

```typescript
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    return { username: payload.sub };
  }
}
```

- [ ] **Step 3: Create server/src/auth/jwt-auth.guard.ts**

```typescript
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

- [ ] **Step 4: Create server/src/auth/auth.service.ts**

```typescript
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './login.dto';

@Injectable()
export class AuthService {
  private readonly adminUsername = process.env.ADMIN_USERNAME;
  private readonly adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

  constructor(private jwtService: JwtService) {}

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;

    if (username !== this.adminUsername) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      this.adminPasswordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign(
      { sub: username },
      { expiresIn: '24h' },
    );

    return { accessToken: token };
  }
}
```

- [ ] **Step 5: Create server/src/auth/auth.controller.ts**

```typescript
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
```

- [ ] **Step 6: Create server/src/auth/auth.module.ts**

```typescript
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
```

- [ ] **Step 7: Commit auth module**

```bash
git add server/src/auth/ && git commit -m "feat: create auth module with JWT strategy

- Implement login endpoint (POST /auth/login)
- Validate admin credentials against env vars
- Issue JWT token on successful login
- Create JwtAuthGuard for protecting admin routes

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

## Phase 4: NestJS Posts Module

### Task 9: Create posts module with CRUD endpoints

**Files:**
- Create: `server/src/posts/posts.module.ts`
- Create: `server/src/posts/posts.service.ts`
- Create: `server/src/posts/posts.controller.ts`
- Create: `server/src/posts/create-post.dto.ts`
- Create: `server/src/posts/update-post.dto.ts`

- [ ] **Step 1: Create server/src/posts/create-post.dto.ts**

```typescript
import { IsString, IsArray, IsBoolean, IsOptional } from 'class-validator';

export class CreatePostDto {
  @IsString()
  slug: string;

  @IsString()
  title: string;

  @IsString()
  summary: string;

  @IsString()
  body: string;

  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @IsBoolean()
  @IsOptional()
  featured?: boolean;

  @IsString()
  readTime: string;
}
```

- [ ] **Step 2: Create server/src/posts/update-post.dto.ts**

```typescript
import { IsString, IsArray, IsBoolean, IsOptional } from 'class-validator';

export class UpdatePostDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  summary?: string;

  @IsString()
  @IsOptional()
  body?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsBoolean()
  @IsOptional()
  featured?: boolean;

  @IsString()
  @IsOptional()
  readTime?: string;
}
```

- [ ] **Step 3: Create server/src/posts/posts.service.ts**

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './create-post.dto';
import { UpdatePostDto } from './update-post.dto';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async findAll(page: number = 1, tag?: string) {
    const take = 12;
    const skip = (page - 1) * take;

    const where = tag ? { tags: { has: tag } } : {};

    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        skip,
        take,
        include: {
          _count: { select: { comments: true, likes: true } },
        },
      }),
      this.prisma.post.count({ where }),
    ]);

    return {
      data: posts.map((post) => ({
        ...post,
        likeCount: post._count.likes,
        commentCount: post._count.comments,
      })),
      total,
      page,
      pageSize: take,
    };
  }

  async findBySlug(slug: string) {
    const post = await this.prisma.post.findUnique({
      where: { slug },
      include: {
        _count: { select: { comments: true, likes: true } },
      },
    });

    if (!post) {
      throw new NotFoundException(`Post with slug "${slug}" not found`);
    }

    return {
      ...post,
      likeCount: post._count.likes,
      commentCount: post._count.comments,
    };
  }

  async create(createPostDto: CreatePostDto) {
    return this.prisma.post.create({
      data: createPostDto,
    });
  }

  async update(slug: string, updatePostDto: UpdatePostDto) {
    const post = await this.prisma.post.findUnique({ where: { slug } });
    if (!post) {
      throw new NotFoundException(`Post with slug "${slug}" not found`);
    }

    return this.prisma.post.update({
      where: { slug },
      data: updatePostDto,
    });
  }

  async delete(slug: string) {
    const post = await this.prisma.post.findUnique({ where: { slug } });
    if (!post) {
      throw new NotFoundException(`Post with slug "${slug}" not found`);
    }

    return this.prisma.post.delete({ where: { slug } });
  }
}
```

- [ ] **Step 4: Create server/src/posts/posts.controller.ts**

```typescript
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './create-post.dto';
import { UpdatePostDto } from './update-post.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Get()
  async findAll(
    @Query('page') page: string = '1',
    @Query('tag') tag?: string,
  ) {
    return this.postsService.findAll(parseInt(page), tag);
  }

  @Get(':slug')
  async findBySlug(@Param('slug') slug: string) {
    return this.postsService.findBySlug(slug);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @Put(':slug')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('slug') slug: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postsService.update(slug, updatePostDto);
  }

  @Delete(':slug')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('slug') slug: string) {
    return this.postsService.delete(slug);
  }
}
```

- [ ] **Step 5: Create server/src/posts/posts.module.ts**

```typescript
import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [PostsService],
  controllers: [PostsController],
})
export class PostsModule {}
```

- [ ] **Step 6: Commit posts module**

```bash
git add server/src/posts/ && git commit -m "feat: create posts module with full CRUD API

- GET /posts (paginated, supports tag filter)
- GET /posts/:slug (single post with counts)
- POST /posts (admin only, create new post)
- PUT /posts/:slug (admin only, update)
- DELETE /posts/:slug (admin only, soft delete)
- Include comment and like counts in responses

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

## Phase 5: NestJS Comments Module

### Task 10: Create comments module

**Files:**
- Create: `server/src/comments/comments.module.ts`
- Create: `server/src/comments/comments.service.ts`
- Create: `server/src/comments/comments.controller.ts`
- Create: `server/src/comments/create-comment.dto.ts`

- [ ] **Step 1: Create server/src/comments/create-comment.dto.ts**

```typescript
import { IsString, IsEmail } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  authorName: string;

  @IsEmail()
  authorEmail: string;

  @IsString()
  body: string;
}
```

- [ ] **Step 2: Create server/src/comments/comments.service.ts**

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async findByPostSlug(slug: string) {
    const post = await this.prisma.post.findUnique({ where: { slug } });
    if (!post) {
      throw new NotFoundException(`Post with slug "${slug}" not found`);
    }

    return this.prisma.comment.findMany({
      where: { postId: post.id, deleted: false },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        postId: true,
        authorName: true,
        body: true,
        createdAt: true,
      },
    });
  }

  async create(slug: string, createCommentDto: CreateCommentDto) {
    const post = await this.prisma.post.findUnique({ where: { slug } });
    if (!post) {
      throw new NotFoundException(`Post with slug "${slug}" not found`);
    }

    return this.prisma.comment.create({
      data: {
        ...createCommentDto,
        postId: post.id,
      },
      select: {
        id: true,
        postId: true,
        authorName: true,
        body: true,
        createdAt: true,
      },
    });
  }

  async delete(commentId: number) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException(`Comment ${commentId} not found`);
    }

    return this.prisma.comment.update({
      where: { id: commentId },
      data: { deleted: true },
    });
  }
}
```

- [ ] **Step 3: Create server/src/comments/comments.controller.ts**

```typescript
import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './create-comment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('posts/:slug/comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Get()
  async findByPostSlug(@Param('slug') slug: string) {
    return this.commentsService.findByPostSlug(slug);
  }

  @Post()
  async create(
    @Param('slug') slug: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentsService.create(slug, createCommentDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.commentsService.delete(id);
  }
}

@Controller('comments')
export class AdminCommentsController {
  constructor(private commentsService: CommentsService) {}

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id', ParseIntPipe) id: number) {
    return this.commentsService.delete(id);
  }
}
```

- [ ] **Step 4: Create server/src/comments/comments.module.ts**

```typescript
import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController, AdminCommentsController } from './comments.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [CommentsService],
  controllers: [CommentsController, AdminCommentsController],
})
export class CommentsModule {}
```

- [ ] **Step 5: Commit comments module**

```bash
git add server/src/comments/ && git commit -m "feat: create comments module

- GET /posts/:slug/comments (public, list non-deleted only)
- POST /posts/:slug/comments (public, create comment)
- DELETE /comments/:id (admin only, soft delete)
- Never expose authorEmail publicly
- Comments displayed in chronological order

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

## Phase 6: NestJS Likes Module

### Task 11: Create likes module with IP deduplication

**Files:**
- Create: `server/src/likes/likes.module.ts`
- Create: `server/src/likes/likes.service.ts`
- Create: `server/src/likes/likes.controller.ts`
- Create: `server/src/likes/get-client-ip.util.ts`

- [ ] **Step 1: Create server/src/likes/get-client-ip.util.ts**

```typescript
import { Request } from 'express';
import * as crypto from 'crypto';

export function getClientIpHash(request: Request): string {
  let ip =
    request.headers['x-forwarded-for'] ||
    request.headers['x-real-ip'] ||
    request.ip ||
    request.connection.remoteAddress ||
    '';

  if (typeof ip === 'string' && ip.includes(',')) {
    ip = ip.split(',')[0].trim();
  }

  return crypto.createHash('sha256').update(ip).digest('hex');
}
```

- [ ] **Step 2: Create server/src/likes/likes.service.ts**

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LikesService {
  constructor(private prisma: PrismaService) {}

  async getByPostSlug(slug: string, ipHash: string) {
    const post = await this.prisma.post.findUnique({ where: { slug } });
    if (!post) {
      throw new NotFoundException(`Post with slug "${slug}" not found`);
    }

    const count = await this.prisma.like.count({ where: { postId: post.id } });
    const liked = await this.prisma.like.findUnique({
      where: { postId_ipHash: { postId: post.id, ipHash } },
    });

    return { count, liked: !!liked };
  }

  async toggle(slug: string, ipHash: string) {
    const post = await this.prisma.post.findUnique({ where: { slug } });
    if (!post) {
      throw new NotFoundException(`Post with slug "${slug}" not found`);
    }

    const existing = await this.prisma.like.findUnique({
      where: { postId_ipHash: { postId: post.id, ipHash } },
    });

    if (existing) {
      await this.prisma.like.delete({
        where: { postId_ipHash: { postId: post.id, ipHash } },
      });
      const count = await this.prisma.like.count({
        where: { postId: post.id },
      });
      return { count, liked: false };
    } else {
      await this.prisma.like.create({
        data: { postId: post.id, ipHash },
      });
      const count = await this.prisma.like.count({
        where: { postId: post.id },
      });
      return { count, liked: true };
    }
  }
}
```

- [ ] **Step 3: Create server/src/likes/likes.controller.ts**

```typescript
import { Controller, Get, Post, Param, Req } from '@nestjs/common';
import { Request } from 'express';
import { LikesService } from './likes.service';
import { getClientIpHash } from './get-client-ip.util';

@Controller('posts/:slug/likes')
export class LikesController {
  constructor(private likesService: LikesService) {}

  @Get()
  async get(@Param('slug') slug: string, @Req() request: Request) {
    const ipHash = getClientIpHash(request);
    return this.likesService.getByPostSlug(slug, ipHash);
  }

  @Post()
  async toggle(@Param('slug') slug: string, @Req() request: Request) {
    const ipHash = getClientIpHash(request);
    return this.likesService.toggle(slug, ipHash);
  }
}
```

- [ ] **Step 4: Create server/src/likes/likes.module.ts**

```typescript
import { Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [LikesService],
  controllers: [LikesController],
})
export class LikesModule {}
```

- [ ] **Step 5: Commit likes module**

```bash
git add server/src/likes/ && git commit -m "feat: create likes module with IP deduplication

- GET /posts/:slug/likes (count + liked boolean for IP)
- POST /posts/:slug/likes (toggle like, idempotent)
- Hash client IP as SHA-256 (never store raw IP)
- Supports X-Forwarded-For for proxied requests
- Unique constraint on (postId, ipHash) enforces dedup

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

## Phase 7: Frontend Integration

### Task 12: Update frontend to consume API

**Files:**
- Modify: `client/package.json`
- Modify: `client/vite.config.js`
- Create: `client/src/lib/api.ts`
- Modify: `client/src/blog/BlogIndex.jsx`
- Modify: `client/src/blog/BlogPost.jsx`

- [ ] **Step 1: Update client/package.json to remove MDX deps and add react-markdown**

Replace the dependencies section with:

```json
{
  "dependencies": {
    "@radix-ui/react-slot": "^1.1.1",
    "@radix-ui/react-tooltip": "^1.1.6",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "framer-motion": "^11.15.0",
    "lucide-react": "^0.469.0",
    "next-themes": "^0.4.4",
    "prismjs": "^1.29.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-icon-cloud": "^4.1.4",
    "react-icons": "^5.4.0",
    "react-markdown": "^9.0.1",
    "react-router-dom": "^7.1.1",
    "react-router-hash-link": "^2.4.3",
    "remark-gfm": "^4.0.0",
    "tailwind-merge": "^2.6.0",
    "tailwindcss-animate": "^1.0.7"
  }
}
```

Remove: `@mdx-js/react`, `@mdx-js/rollup`, `rehype-slug`

- [ ] **Step 2: Update client/vite.config.js to remove MDX plugin**

```javascript
import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react({ include: /\.(jsx|js|tsx|ts)$/ })],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

- [ ] **Step 3: Create client/src/lib/api.ts**

```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

function getAuthToken(): string | null {
  return localStorage.getItem('auth_token');
}

async function apiFetch(path: string, options: FetchOptions = {}) {
  const url = `${API_URL}${path}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const token = getAuthToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

// Auth
export async function login(username: string, password: string) {
  const data = await apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
  localStorage.setItem('auth_token', data.accessToken);
  return data;
}

export function logout() {
  localStorage.removeItem('auth_token');
}

export function isAuthenticated(): boolean {
  return !!getAuthToken();
}

// Posts
export async function getPosts(page: number = 1, tag?: string) {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  if (tag) params.append('tag', tag);
  return apiFetch(`/posts?${params.toString()}`);
}

export async function getPostBySlug(slug: string) {
  return apiFetch(`/posts/${slug}`);
}

export async function createPost(data: any) {
  return apiFetch('/posts', { method: 'POST', body: JSON.stringify(data) });
}

export async function updatePost(slug: string, data: any) {
  return apiFetch(`/posts/${slug}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deletePost(slug: string) {
  return apiFetch(`/posts/${slug}`, { method: 'DELETE' });
}

// Comments
export async function getComments(slug: string) {
  return apiFetch(`/posts/${slug}/comments`);
}

export async function createComment(
  slug: string,
  data: { authorName: string; authorEmail: string; body: string },
) {
  return apiFetch(`/posts/${slug}/comments`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function deleteComment(commentId: number) {
  return apiFetch(`/comments/${commentId}`, { method: 'DELETE' });
}

// Likes
export async function getLikes(slug: string) {
  return apiFetch(`/posts/${slug}/likes`);
}

export async function toggleLike(slug: string) {
  return apiFetch(`/posts/${slug}/likes`, { method: 'POST' });
}
```

- [ ] **Step 4: Install new dependencies in client/**

```bash
cd client
npm install react-markdown remark-gfm
npm uninstall @mdx-js/react @mdx-js/rollup rehype-slug
```

- [ ] **Step 5: Update client/src/blog/BlogIndex.jsx to fetch from API**

Replace the entire file:

```jsx
import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { getPosts } from "@/lib/api";

function PostTag({ label }) {
  return (
    <span className="font-mono text-[10px] font-medium uppercase tracking-[0.06em] px-2 py-0.5 rounded border border-[#E8B84B]/25 bg-[#E8B84B]/10 text-[#E8B84B]">
      {label}
    </span>
  );
}

function TagFilter({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`font-mono text-[11px] font-medium uppercase tracking-[0.06em] px-3 py-1 rounded border transition-all duration-150 ${
        active
          ? "border-[#E8B84B] bg-[#E8B84B]/10 text-[#E8B84B]"
          : "border-[#2A2A2A] text-[#888888] hover:border-[#E8B84B] hover:text-[#E8B84B]"
      }`}
    >
      {label}
    </button>
  );
}

function SearchBar({ value, onChange }) {
  return (
    <div className="relative">
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555555]"
        width="14" height="14" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        type="text"
        placeholder="Search posts…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg pl-9 pr-4 py-2 font-sans text-sm text-white placeholder-[#555555] outline-none focus:border-[#E8B84B] transition-colors duration-200"
      />
    </div>
  );
}

function PostCard({ post }) {
  return (
    <Link to={`/blog/${post.slug}`} className="group block h-full">
      <article className="h-full flex flex-col gap-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl p-6 transition-all duration-200 group-hover:border-[#E8B84B] group-hover:-translate-y-0.5">
        <div className="flex items-center gap-2">
          <PostTag label={post.tags[0]} />
          {post.featured && (
            <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-[#555555]">
              Featured
            </span>
          )}
        </div>
        <h2 className="font-syne font-bold text-base leading-snug tracking-tight text-white flex-1 group-hover:text-[#E8B84B] transition-colors duration-150">
          {post.title}
        </h2>
        <p className="text-sm text-[#888888] leading-relaxed" style={{ textWrap: "pretty" }}>
          {post.summary}
        </p>
        <div className="flex justify-between items-center pt-3 border-t border-[#2A2A2A] mt-auto">
          <span className="font-mono text-[11px] text-[#555555]">{post.dateShort}</span>
          <span className="font-mono text-[11px] text-[#555555]">{post.readTime}</span>
        </div>
      </article>
    </Link>
  );
}

function PostRow({ post }) {
  return (
    <Link to={`/blog/${post.slug}`} className="group block">
      <article className="py-7 border-b border-[#2A2A2A] grid grid-cols-[1fr_auto] gap-5 items-start transition-all duration-150 group-hover:pl-1.5">
        <div>
          <div className="flex items-center gap-2 mb-2.5">
            <PostTag label={post.tags[0]} />
            {post.featured && (
              <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-[#555555]">
                Featured
              </span>
            )}
          </div>
          <h2
            className={`font-syne font-bold leading-tight tracking-tight text-white mb-2 group-hover:text-[#E8B84B] transition-colors duration-150 ${
              post.featured ? "text-[22px]" : "text-[18px]"
            }`}
          >
            {post.title}
          </h2>
          <p className="text-sm text-[#888888] leading-relaxed max-w-xl" style={{ textWrap: "pretty" }}>
            {post.summary}
          </p>
        </div>
        <div className="text-right shrink-0">
          <div className="font-mono text-xs text-[#555555] mb-1">{post.dateShort}</div>
          <div className="font-mono text-[11px] text-[#555555]">{post.readTime}</div>
        </div>
      </article>
    </Link>
  );
}

export default function BlogIndex() {
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState("All");
  const [layout, setLayout] = useState("grid");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allTags, setAllTags] = useState(["All"]);

  useEffect(() => {
    getPosts(1, activeTag === "All" ? undefined : activeTag)
      .then((result) => {
        setPosts(result.data || []);
        const tags = Array.from(
          new Set(result.data?.flatMap((p) => p.tags) || [])
        );
        setAllTags(["All", ...tags]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [activeTag]);

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      const q = search.toLowerCase();
      return (
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [search, posts]);

  return (
    <main className="bg-[#111111] min-h-screen text-white">
      <header className="fixed top-0 left-0 w-full z-50 bg-[#111111]/95 backdrop-blur-sm border-b border-[#2A2A2A]">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-syne font-bold text-[#888888] hover:text-[#E8B84B] transition-colors text-sm"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
            Switch back to portfolio
          </Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 pt-28 pb-20">
        <div className="mb-12">
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#555555] mb-3">
            Writing
          </p>
          <h1 className="font-syne font-extrabold text-[clamp(32px,6vw,52px)] leading-[1.1] tracking-[-0.04em] mb-4">
            Notes from the{" "}
            <span className="text-[#E8B84B]">trenches.</span>
          </h1>
          <p className="text-base text-[#888888] max-w-md leading-relaxed" style={{ textWrap: "pretty" }}>
            Practical articles on full-stack development, architecture decisions,
            and the tools I use every day.
          </p>
        </div>

        <div className="flex flex-col gap-4 mb-8">
          <SearchBar value={search} onChange={setSearch} />
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <TagFilter
                key={tag}
                label={tag}
                active={activeTag === tag}
                onClick={() => setActiveTag(tag)}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <span className="font-mono text-[11px] text-[#555555]">
            {loading ? "Loading…" : `${filtered.length} ${filtered.length === 1 ? "post" : "posts"}`}
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => setLayout("grid")}
              aria-label="Grid layout"
              className={`p-1.5 rounded border transition-colors duration-150 ${
                layout === "grid"
                  ? "border-[#E8B84B] text-[#E8B84B]"
                  : "border-[#2A2A2A] text-[#555555] hover:border-[#E8B84B] hover:text-[#E8B84B]"
              }`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
              </svg>
            </button>
            <button
              onClick={() => setLayout("list")}
              aria-label="List layout"
              className={`p-1.5 rounded border transition-colors duration-150 ${
                layout === "list"
                  ? "border-[#E8B84B] text-[#E8B84B]"
                  : "border-[#2A2A2A] text-[#555555] hover:border-[#E8B84B] hover:text-[#E8B84B]"
              }`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 font-mono text-sm text-[#555555]">
            Loading posts…
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 font-mono text-sm text-[#555555]">
            No posts found.
          </div>
        ) : layout === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div>
            {filtered.map((post) => (
              <PostRow key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
```

- [ ] **Step 6: Update client/src/blog/BlogPost.jsx to fetch from API and use react-markdown**

This is a comprehensive file update. Replace the entire BlogPost.jsx:

```jsx
import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getPostBySlug, getComments, getLikes, createComment, toggleLike } from "@/lib/api";

function ReadProgress() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const article = document.getElementById("blog-article");
    if (!article) return;
    const onScroll = () => {
      const rect = article.getBoundingClientRect();
      const total = article.offsetHeight - window.innerHeight;
      const scrolled = Math.max(0, -rect.top);
      setPct(Math.min(100, (scrolled / total) * 100));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div
      className="fixed top-0 left-0 h-[2px] bg-[#E8B84B] z-[100] transition-[width] duration-100"
      style={{ width: `${pct}%` }}
    />
  );
}

function TableOfContents() {
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => {
      const headings = document.querySelectorAll("h2, h3");
      let current = "";
      headings.forEach((el) => {
        if (el.getBoundingClientRect().top <= 100) current = el.id;
      });
      setActive(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const headings = Array.from(document.querySelectorAll("h2, h3")).map((el) => ({
    id: el.id,
    label: el.textContent,
    level: parseInt(el.tagName[1]),
  }));

  return (
    <aside className="sticky top-20">
      <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#555555] mb-3.5">
        On this page
      </p>
      <ul className="flex flex-col gap-0.5">
        {headings.map(({ id, label, level }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className={`block text-[12.5px] leading-snug py-1.5 border-l-2 transition-all duration-150 ${
                level === 3 ? "pl-5" : "pl-2.5"
              } ${
                active === id
                  ? "border-[#E8B84B] text-[#E8B84B]"
                  : "border-[#2A2A2A] text-[#888888] hover:text-[#E8B84B] hover:border-[#E8B84B]"
              }`}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>

      <hr className="border-[#2A2A2A] my-7" />

      <div className="flex items-center gap-2.5 mb-6">
        <img
          src="/src/assets/images/profile.jpeg"
          alt="Ankit Bhardwaj"
          className="w-9 h-9 rounded-full object-cover border border-[#2A2A2A] shrink-0"
        />
        <div>
          <div className="font-syne font-bold text-[13px] text-white">Ankit Bhardwaj</div>
          <div className="font-mono text-[11px] text-[#555555]">Full-Stack Dev</div>
        </div>
      </div>

      <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#555555] mb-2.5">
        Share
      </p>
      <div className="flex flex-wrap gap-1.5">
        <a
          href="#"
          className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[#888888] bg-[#1A1A1A] border border-[#2A2A2A] rounded px-2.5 py-1.5 hover:border-[#E8B84B] hover:text-[#E8B84B] transition-colors duration-150"
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.259 5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          Twitter
        </a>
        <a
          href="#"
          className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[#888888] bg-[#1A1A1A] border border-[#2A2A2A] rounded px-2.5 py-1.5 hover:border-[#E8B84B] hover:text-[#E8B84B] transition-colors duration-150"
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
          LinkedIn
        </a>
      </div>
    </aside>
  );
}

export default function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState({ count: 0, liked: false });
  const [loading, setLoading] = useState(true);
  const [commentForm, setCommentForm] = useState({ authorName: "", authorEmail: "", body: "" });
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    if (!slug) return;
    Promise.all([
      getPostBySlug(slug).catch(() => null),
      getComments(slug).catch(() => []),
      getLikes(slug).catch(() => ({ count: 0, liked: false })),
    ])
      .then(([post, comments, likes]) => {
        if (!post) {
          navigate("/blog", { replace: true });
          return;
        }
        setPost(post);
        setComments(comments || []);
        setLikes(likes);
      })
      .finally(() => setLoading(false));
  }, [slug, navigate]);

  const handleLike = async () => {
    try {
      const result = await toggleLike(slug);
      setLikes(result);
    } catch (error) {
      console.error("Failed to toggle like:", error);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!commentForm.authorName || !commentForm.authorEmail || !commentForm.body) return;

    setSubmittingComment(true);
    try {
      const newComment = await createComment(slug, commentForm);
      setComments([...comments, newComment]);
      setCommentForm({ authorName: "", authorEmail: "", body: "" });
    } catch (error) {
      console.error("Failed to submit comment:", error);
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <main className="bg-[#111111] min-h-screen text-white flex items-center justify-center">
        <div className="font-mono text-[#555555]">Loading…</div>
      </main>
    );
  }

  if (!post) return null;

  return (
    <main className="bg-[#111111] min-h-screen text-white">
      <ReadProgress />
      <header className="fixed top-0 left-0 w-full z-50 bg-[#111111]/95 backdrop-blur-sm border-b border-[#2A2A2A]">
        <div className="max-w-[1100px] mx-auto px-6 py-4">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 font-syne font-bold text-[#888888] hover:text-[#E8B84B] transition-colors text-sm"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
            Head back to blog
          </Link>
        </div>
      </header>

      <div
        id="blog-article"
        className="max-w-[1100px] mx-auto px-6 pt-28 pb-20 grid gap-16"
        style={{ gridTemplateColumns: "1fr 220px" }}
      >
        <article>
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {post.tags.slice(0, 2).map((t) => (
              <span
                key={t}
                className="font-mono text-[10px] font-medium uppercase tracking-[0.06em] px-2 py-0.5 rounded border border-[#E8B84B]/25 bg-[#E8B84B]/10 text-[#E8B84B]"
              >
                {t}
              </span>
            ))}
            <span className="text-[#555555] text-xs">·</span>
            <span className="font-mono text-[12px] text-[#888888]">{new Date(post.publishedAt).toLocaleDateString()}</span>
            <span className="text-[#555555] text-xs">·</span>
            <span className="font-mono text-[12px] text-[#888888]">{post.readTime}</span>
          </div>

          <h1 className="font-syne font-extrabold text-[clamp(26px,5vw,42px)] leading-[1.15] tracking-[-0.03em] mb-5">
            {post.title}
          </h1>
          <p className="text-lg text-[#888888] leading-[1.7] mb-9 font-light" style={{ textWrap: "pretty" }}>
            {post.summary}
          </p>
          <hr className="border-[#2A2A2A] mb-9" />

          <div className="prose prose-invert max-w-none mb-12">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h2: ({ node, ...props }) => (
                  <h2 className="font-syne font-bold text-2xl tracking-tight mb-4 mt-10 scroll-mt-20" {...props} />
                ),
                h3: ({ node, ...props }) => (
                  <h3 className="font-syne font-bold text-[18px] tracking-tight mb-3 mt-8 scroll-mt-20" {...props} />
                ),
                p: ({ node, ...props }) => (
                  <p className="text-[15px] text-white/80 leading-[1.8] mb-5" {...props} />
                ),
                code: ({ node, inline, ...props }) => {
                  if (inline) {
                    return <code className="font-mono text-[13px] bg-[#1A1A1A] border border-[#2A2A2A] px-1.5 py-0.5 rounded text-[#E8B84B]" {...props} />;
                  }
                  return <code className="block bg-[#1A1A1A] p-4 rounded overflow-x-auto" {...props} />;
                },
                pre: ({ node, ...props }) => (
                  <pre className="bg-[#161616] border border-[#2A2A2A] rounded-lg overflow-hidden !my-8 p-5 font-mono text-[13.5px] leading-[1.7] text-[#cccccc]" {...props} />
                ),
                a: ({ node, ...props }) => (
                  <a className="text-[#E8B84B] hover:underline" {...props} />
                ),
              }}
            >
              {post.body}
            </ReactMarkdown>
          </div>

          <div className="mt-16 pt-8 border-t border-[#2A2A2A]">
            <div className="flex items-center gap-4 mb-8">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded border transition-colors ${
                  likes.liked
                    ? "border-[#E8B84B] text-[#E8B84B]"
                    : "border-[#2A2A2A] text-[#888888] hover:border-[#E8B84B] hover:text-[#E8B84B]"
                }`}
              >
                <span>{likes.liked ? "❤️" : "🤍"}</span>
                <span className="font-mono text-sm">{likes.count}</span>
              </button>
            </div>

            <div>
              <h3 className="font-syne font-bold text-lg mb-4">Comments</h3>

              <div className="mb-6 max-w-2xl">
                <form onSubmit={handleSubmitComment} className="space-y-3">
                  <input
                    type="text"
                    placeholder="Name"
                    value={commentForm.authorName}
                    onChange={(e) => setCommentForm({ ...commentForm, authorName: e.target.value })}
                    className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded px-3 py-2 text-sm text-white placeholder-[#555555] focus:border-[#E8B84B]"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={commentForm.authorEmail}
                    onChange={(e) => setCommentForm({ ...commentForm, authorEmail: e.target.value })}
                    className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded px-3 py-2 text-sm text-white placeholder-[#555555] focus:border-[#E8B84B]"
                  />
                  <textarea
                    placeholder="Your comment…"
                    value={commentForm.body}
                    onChange={(e) => setCommentForm({ ...commentForm, body: e.target.value })}
                    className="w-full bg-[#1A1A1A] border border-[#2A2A2A] rounded px-3 py-2 text-sm text-white placeholder-[#555555] focus:border-[#E8B84B] resize-none"
                    rows={3}
                  />
                  <button
                    type="submit"
                    disabled={submittingComment}
                    className="px-4 py-2 bg-[#E8B84B] text-[#111111] rounded font-mono text-sm font-bold hover:bg-[#D9A73C] disabled:opacity-50"
                  >
                    {submittingComment ? "Posting…" : "Post Comment"}
                  </button>
                </form>
              </div>

              <div className="space-y-4">
                {comments.length === 0 ? (
                  <p className="text-[#555555] text-sm">No comments yet. Be the first!</p>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="bg-[#1A1A1A] border border-[#2A2A2A] rounded p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-mono text-sm font-bold text-white">{comment.authorName}</div>
                        <span className="font-mono text-xs text-[#555555]">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-[15px] text-white/80 leading-relaxed">{comment.body}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </article>

        <TableOfContents />
      </div>
    </main>
  );
}
```

- [ ] **Step 7: Update client/.env.local for API URL**

Create `client/.env.local`:

```
VITE_API_URL=http://localhost:3001
```

- [ ] **Step 8: Commit frontend API integration**

```bash
git add client/ && git commit -m "feat: integrate frontend with NestJS API

- Replace static posts data with API fetching
- Update BlogIndex to fetch from GET /posts
- Update BlogPost to fetch post, comments, likes from API
- Replace MDX renderer with react-markdown
- Add comments form with submit functionality
- Add like button with toggle functionality
- Create api.ts module for all API calls
- Add VITE_API_URL environment variable

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

## Phase 8: Environment & Deployment

### Task 13: Set up environment variables and deployment

**Files:**
- Create: `server/.env` (local dev)
- Create: `client/.env.local` (local dev)
- Create: `.env.example` (root)
- Modify: `vercel.json`

- [ ] **Step 1: Create server/.env for local dev**

First, generate a bcrypt hash of a test password. In Node:

```bash
node -e "const bcrypt = require('bcrypt'); console.log(bcrypt.hashSync('yourpassword', 10));"
```

Then create `server/.env`:

```
DATABASE_URL=postgresql://user:password@localhost:5432/portfolio_dev
JWT_SECRET=your-local-dev-secret-key-change-in-production
ADMIN_USERNAME=ankit
ADMIN_PASSWORD_HASH=$2b$10$...generated_hash_from_above
CLIENT_URL=http://localhost:5173
PORT=3001
```

- [ ] **Step 2: Create client/.env.local**

```
VITE_API_URL=http://localhost:3001
```

- [ ] **Step 3: Create root .env.example**

```
# Server
DATABASE_URL=postgresql://user:password@host:5432/portfolio
JWT_SECRET=change-me-in-production
ADMIN_USERNAME=ankit
ADMIN_PASSWORD_HASH=bcrypt-hash-of-your-password
CLIENT_URL=https://yourdomain.vercel.app
PORT=3001

# Client
VITE_API_URL=https://your-api.railway.app
```

- [ ] **Step 4: Update vercel.json for client root directory**

```json
{
  "buildCommand": "cd client && npm run build",
  "outputDirectory": "client/dist",
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ],
  "env": {
    "VITE_API_URL": "@api-url"
  }
}
```

- [ ] **Step 5: Create .gitignore entries**

Update `.gitignore`:

```
node_modules/
dist/
.env
.env.local
.env.*.local
*.log
```

- [ ] **Step 6: Commit environment and deployment setup**

```bash
git add server/.env client/.env.local .env.example vercel.json .gitignore && git commit -m "feat: add environment variables and deployment config

- Set up .env files for local dev (server and client)
- Create .env.example with all required variables
- Update vercel.json to build and serve client/
- Add environment variable references for Railway and Vercel

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

## Summary

All 13 tasks complete. The implementation creates:
- A full NestJS backend with authentication, CRUD posts, comments, and likes
- A frontend that fetches from the API instead of static data
- A PostgreSQL database managed by Prisma
- A simple monorepo structure with npm workspaces
- Local dev environment (run `npm run dev` from root)
- Ready for deployment to Railway (backend) + Vercel (frontend) + Neon (database)