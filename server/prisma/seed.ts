import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();

  const posts = [
    {
      slug: 'node-ts-api',
      title: 'Building Scalable REST APIs with Node.js and TypeScript',
      summary:
        'Patterns, folder structure, and production-grade error handling for APIs that grow without becoming a mess.',
      tags: ['Node.js', 'TypeScript', 'Backend'],
      featured: true,
      readTime: '8 min',
      body: [
        '## Why TypeScript changes everything',
        '',
        'When I first started writing Node.js APIs, I was all-in on plain JavaScript. It felt faster — no compilation step, no type annotations to maintain. But after a couple of production bugs that a type-checker would have caught instantly, I switched and never looked back.',
        '',
        'TypeScript gives you something invaluable at scale: **a living contract**. Every function signature is documentation that the compiler enforces. Refactors stop being scary when you have 300 endpoints and a team of four.',
        '',
        '> 💡 If you\'re starting a new project today, start with TypeScript from day one. Retrofitting types onto a large codebase is painful — trust me.',
        '',
        '## Folder structure that actually scales',
        '',
        'The most common mistake I see in Node APIs is a flat `routes/` folder with one giant file per resource. This works fine at 3 endpoints. At 30, it\'s chaos.',
        '',
        '```',
        'src/',
        '├── modules/',
        '│   ├── users/',
        '│   │   ├── users.router.ts',
        '│   │   ├── users.service.ts',
        '│   │   ├── users.repository.ts',
        '│   │   └── users.types.ts',
        '│   └── auth/',
        '│       ├── auth.router.ts',
        '│       └── auth.service.ts',
        '├── shared/',
        '│   ├── middleware/',
        '│   ├── errors/',
        '│   └── db/',
        '└── app.ts',
        '```',
        '',
        '## Error handling done right',
        '',
        'Express\'s default error handling is fine. But production apps need something more deliberate.',
        '',
        '```typescript',
        'export class AppError extends Error {',
        '  constructor(',
        '    public statusCode: number,',
        '    public message: string,',
        '    public isOperational = true',
        '  ) {',
        '    super(message);',
        '    Object.setPrototypeOf(this, AppError.prototype);',
        '  }',
        '}',
        '```',
        '',
        '### Async route wrappers',
        '',
        'One of the most common Express gotchas: unhandled promise rejections inside async route handlers silently swallow errors.',
        '',
        '```typescript',
        'const asyncHandler = (fn: RequestHandler) =>',
        '  (req: Request, res: Response, next: NextFunction) =>',
        '    Promise.resolve(fn(req, res, next)).catch(next);',
        '```',
        '',
        '## Validation with Zod',
        '',
        "Don't trust incoming request bodies. Ever.",
        '',
        '```typescript',
        "import { z } from 'zod';",
        '',
        'const CreateUserSchema = z.object({',
        '  email: z.string().email(),',
        "  name: z.string().min(2).max(100),",
        "  role: z.enum(['admin', 'user']).default('user'),",
        '});',
        '',
        'type CreateUserDto = z.infer<typeof CreateUserSchema>;',
        '```',
        '',
        '## Final thoughts',
        '',
        "There's no single \"correct\" architecture for Node.js APIs — what matters is consistency and adaptability.",
      ].join('\n'),
    },
    {
      slug: 'react-server-components',
      title: 'Server Components in Practice: What Actually Changes',
      summary:
        "After six months running RSC in production, here's what the mental model shift actually looks like day-to-day.",
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
    await prisma.post.create({ data: post });
  }

  console.log('✓ Database seeded with', posts.length, 'posts');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
