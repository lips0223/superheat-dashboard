// app/[locale]/page.tsx
import { redirect } from 'next/navigation';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Page({ params }: Props) {
  const { locale } = await params;
  console.log("🔴 [page.tsx] 开始执行，准备重定向到:", `/`);
  
  // 服务端重定向到 dashboard
  redirect(`/`);
  
  console.log("🔴 [page.tsx] 这行不应该被执行");
}