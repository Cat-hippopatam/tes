import { Suspense } from "react";
import Link from "next/link";
// избегаем клиентских UI-компонентов здесь, оставим простые серверно-совместимые элементы
import { notFound } from "next/navigation";

interface SearchParams {
  search?: string;
  type?: string;
  tags?: string;
  difficulty?: string;
  isPremium?: string;
  sort?: string;
  page?: string;
  pageSize?: string;
}

async function fetchContent(searchParams: SearchParams) {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
  const qs = new URLSearchParams(
    Object.entries(searchParams).reduce((acc: Record<string, string>, [k, v]) => {
      if (v === undefined || v === null) return acc;
      acc[k] = String(v);
      return acc;
    }, {})
  );
  const res = await fetch(`${baseUrl}/api/content?${qs.toString()}`, {
    method: 'GET',
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to load content');
  return res.json() as Promise<{ data: any[]; meta: { page: number; pageSize: number; total: number; totalPages: number } }>;
}

export default async function CatalogPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;
  let payload: Awaited<ReturnType<typeof fetchContent>>;
  try {
    payload = await fetchContent(sp);
  } catch {
    notFound();
  }

  const { data, meta } = payload!;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold" style={{ color: '#264653' }}>Каталог</h1>
          <p className="text-sm text-[#6C757D] mt-1">Найдено: {meta.total}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Примитивные фильтры (через query string) */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <Link href="/catalog?type=COURSE" className="inline-block"><span className="text-xs px-3 py-1 rounded-full border bg-white text-[#264653] border-gray-200">Курсы</span></Link>
          <Link href="/catalog?type=ARTICLE" className="inline-block"><span className="text-xs px-3 py-1 rounded-full border bg-white text-[#264653] border-gray-200">Статьи</span></Link>
          <Link href="/catalog?type=VIDEO" className="inline-block"><span className="text-xs px-3 py-1 rounded-full border bg-white text-[#264653] border-gray-200">Видео</span></Link>
          <Link href="/catalog?isPremium=true" className="inline-block"><span className="text-xs px-3 py-1 rounded-full text-white" style={{ backgroundColor: '#F4A261' }}>Премиум</span></Link>
          <Link href="/catalog?sort=likes" className="inline-block"><span className="text-xs px-3 py-1 rounded-full border bg-white text-[#264653] border-gray-200">По лайкам</span></Link>
          <Link href="/catalog?sort=views" className="inline-block"><span className="text-xs px-3 py-1 rounded-full border bg-white text-[#264653] border-gray-200">По просмотрам</span></Link>
        </div>

        {/* Сетка карточек */}
        {data.length === 0 ? (
          <div className="bg-white rounded-xl p-10 text-center border border-gray-200">Нет материалов по выбранным фильтрам</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((item) => (
              <Link key={item.id} href={`/content/${item.slug}`} className="group">
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col">
                  {item.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.coverImage} alt={item.title} className="w-full h-40 object-cover" />
                  ) : (
                    <div className="w-full h-40 bg-gray-100 flex items-center justify-center text-gray-400">Нет обложки</div>
                  )}
                  <div className="p-4 flex-1 flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      {item.isPremium && (
                        <span className="text-xs px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: '#F4A261' }}>Premium</span>
                      )}
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{item.type}</span>
                    </div>
                    <h3 className="font-semibold text-base leading-snug" style={{ color: '#264653' }}>{item.title}</h3>
                    {item.description && (
                      <p className="text-sm text-[#6C757D] line-clamp-2">{item.description}</p>
                    )}
                    <div className="mt-auto flex items-center gap-2 flex-wrap">
                      {item.tags?.slice(0, 3).map((t: any) => (
                        <span key={t.id} className="text-xs px-2 py-0.5 rounded-full border" style={{ borderColor: t.color || '#e5e7eb', color: '#6C757D' }}>{t.name}</span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-xs text-[#6C757D] mt-1">
                      <span>👁 {item.viewsCount}</span>
                      <span>👍 {item.likesCount}</span>
                      <span>💬 {item.commentsCount}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Пагинация */}
        {meta.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            {Array.from({ length: meta.totalPages }).map((_, i) => {
              const p = i + 1;
              const nsp = new URLSearchParams({ ...sp, page: String(p) } as any);
              const href = `/catalog?${nsp.toString()}`;
              const active = p === (Number((sp as any).page || 1));
              return (
                <Link key={p} href={href} className={`px-3 py-1 rounded border ${active ? 'bg-[#F4A261] text-white border-[#F4A261]' : 'bg-white text-[#264653] border-gray-200'}`}>
                  {p}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}