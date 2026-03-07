import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import DOMPurify from 'isomorphic-dompurify';

async function fetchContent(slug: string) {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
  const res = await fetch(`${baseUrl}/api/content/${slug}`, {
    method: 'GET',
    cache: 'no-store',
  });
  if (!res.ok) return null;
  return res.json() as Promise<{ data: any }>;
}

function PremiumGate({ isPremium, children }: { isPremium: boolean; children?: React.ReactNode }) {
  // Клиентский триггер через глобальный стор
  if (!isPremium) return <>{children}</>;
  return (
    <div className="p-6 border border-dashed border-gray-300 rounded-xl text-center bg-white">
      <p className="text-[#264653] font-medium mb-3">Материал доступен по подписке</p>
      <div className="flex justify-center gap-3">
        {/* Использовать data-атрибуты, кнопки обрабатываются на клиенте (Header/Provider) */}
        <button data-open-modal="subscribe" className="px-4 py-2 rounded text-white" style={{ background: '#F4A261' }}>Оформить подписку</button>
        <button data-open-modal="payment" className="px-4 py-2 rounded border" style={{ borderColor: '#F4A261', color: '#F4A261' }}>Купить доступ</button>
      </div>
      <p className="text-xs text-[#6C757D] mt-2">Для тестирования оплаты откроется демо-окно</p>
    </div>
  );
}

export default async function ContentDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const payload = await fetchContent(slug);
  if (!payload) notFound();
  const { data } = payload;

  const isVideo = data.type === 'VIDEO' && data.videoUrl;
  const isArticle = data.type === 'ARTICLE' && data.body;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/catalog" className="text-[#6C757D] hover:text-[#264653]">← Каталог</Link>
            {data.isPremium && (
              <span className="text-xs px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: '#F4A261' }}>Premium</span>
            )}
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{data.type}</span>
          </div>
          <h1 className="text-2xl font-bold mt-2" style={{ color: '#264653' }}>{data.title}</h1>
          <div className="flex items-center gap-3 mt-2 text-sm text-[#6C757D]">
            {data.author?.avatarUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={data.author.avatarUrl} alt={data.author.displayName} className="w-7 h-7 rounded-full" />
            )}
            <span>{data.author?.displayName}</span>
            <span>•</span>
            <span>{data.publishedAt && new Date(data.publishedAt).toLocaleDateString('ru-RU')}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          {isVideo && (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="aspect-video w-full bg-black">
                <iframe
                  className="w-full h-full"
                  src={data.videoUrl}
                  title={data.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {isArticle && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 prose max-w-none">
              <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.body) }} />
            </div>
          )}

          {/* Premium Gate */}
          <PremiumGate isPremium={Boolean(data.isPremium)} />
        </div>

        <aside className="lg:col-span-4 space-y-6">
          {/* Теги */}
          {data.tags?.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-sm font-medium mb-3" style={{ color: '#264653' }}>Теги</p>
              <div className="flex flex-wrap gap-2">
                {data.tags.map((t: any) => (
                  <span key={t.id} className="text-xs px-2 py-0.5 rounded-full border" style={{ borderColor: t.color || '#e5e7eb', color: '#6C757D' }}>{t.name}</span>
                ))}
              </div>
            </div>
          )}

          {/* Структура курса / Модули и уроки */}
          {data.type === 'COURSE' && data.courseModules?.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-sm font-medium mb-3" style={{ color: '#264653' }}>Содержание курса</p>
              <div className="space-y-3">
                {data.courseModules.map((m: any) => (
                  <div key={m.id}>
                    <p className="text-sm font-semibold" style={{ color: '#264653' }}>{m.title}</p>
                    <ul className="mt-1 pl-4 list-disc text-sm text-[#6C757D]">
                      {m.lessons?.map((l: any) => (
                        <li key={l.id} className=""><Link href={`/content/${l.slug}`} className="hover:text-[#264653]">{l.title}</Link></li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
