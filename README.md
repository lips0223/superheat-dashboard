This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### 1. 环境配置

首先，复制环境变量示例文件并配置：

```bash
cp .env.example .env.local
```

然后编辑 `.env.local` 文件，配置后端 API 地址：

```env
NEXT_PUBLIC_API_URL=https://api.superheat.xyz
```

**注意：** 如果后端 API 地址不可用，你需要：
- 启动本地后端服务（如果有）
- 或者联系项目管理员获取正确的 API 地址

### 2. 安装依赖

```bash
pnpm install
```

### 3. 启动开发服务器

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 邮件服务 (Email Server)

如果需要邮件验证功能，启动邮件服务：

```bash
cd email-server
node server.js
```

## 常见问题

### Network Error 错误

如果启动后遇到 "Network Error" 错误：

1. **检查环境变量**：确保 `.env.local` 文件存在并配置了正确的 `NEXT_PUBLIC_API_URL`
2. **验证 API 地址**：确认后端 API 服务是否可访问
3. **检查网络连接**：确保你的网络可以访问配置的 API 地址

### 如果没有后端服务

如果项目只是前端展示，你可以：
- 注释掉登录页面的 API 调用
- 或者使用 Mock 数据替代真实 API
