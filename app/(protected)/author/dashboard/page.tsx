import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Plus, FileText, Eye, MessageCircle, TrendingUp, BarChart3 } from 'lucide-react';

async function fetchAuthorContent() {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
  
  // Получаем контент автора (для демо - весь контент)
  const res = await fetch(`${baseUrl}/api/content?limit=50`, {
    cache: 'no-store',
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function AuthorDashboardPage() {
  const payload = await fetchAuthorContent();
  if (!payload) notFound();

  const { data: contents } = payload;

  // Статистика
  const totalViews = contents.reduce((acc: number, c: any) => acc + (c.viewsCount || 0), 0);
  const totalComments = contents.reduce((acc: number, c: any) => acc + (c.commentsCount || 0), 0);
  const publishedCount = contents.filter((c: any) => c.status === 'PUBLISHED').length;
  const draftCount = contents.filter((c: any) => c.status === 'DRAFT').length;

  return (
    <div className="min-h-screen bg-[#F8F6F3]">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#264653] mb-2">Кабинет автора</h1>
            <p className="text-[#6C757D]">Управление вашим контентом</p>
          </div>
          <Link
            href="/author/content/new"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition-colors hover:opacity-90"
            style={{ backgroundColor: '#F4A261' }}
          >
            <Plus className="w-5 h-5" />
            Создать контент
          </Link>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Eye className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-[#6C757D]">Просмотры</p>
                <p className="text-2xl font-bold text-[#264653]">{totalViews}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-[#6C757D]">Комментарии</p>
                <p className="text-2xl font-bold text-[#264653]">{totalComments}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <FileText className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-[#6C757D]">Опубликовано</p>
                <p className="text-2xl font-bold text-[#264653]">{publishedCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-[#6C757D]">Черновики</p>
                <p className="text-2xl font-bold text-[#264653]">{draftCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Свой контент */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-[#264653]">Ваш контент</h2>
          </div>

          {contents.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-lg font-medium text-[#264653]">Контент не найден</p>
              <p className="text-sm text-[#6C757D] mb-4">Создайте свой первый курс или статью</p>
              <Link
                href="/author/content/new"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white"
                style={{ backgroundColor: '#F4A261' }}
              >
                <Plus className="w-4 h-4" />
                Создать контент
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {contents.slice(0, 10).map((content: any) => (
                <div key={content.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-16 h-12 bg-gray-200 rounded-lg flex-shrink-0">
                      {content.coverImage && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={content.coverImage}
                          alt=""
                          className="w-full h-full object-cover rounded-lg"
                        />
                      )}
                    </div>
                    <div className="min-w-0">
                      <Link
                        href={`/content/${content.slug}`}
                        className="font-medium text-[#264653] hover:text-[#F4A261] block truncate"
                      >
                        {content.title}
                      </Link>
                      <div className="flex items-center gap-2 text-sm text-[#6C757D]">
                        <span>{content.type}</span>
                        <span>•</span>
                        <span>{content.viewsCount || 0} просмотров</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        content.status === 'PUBLISHED'
                          ? 'bg-green-100 text-green-600'
                          : content.status === 'DRAFT'
                          ? 'bg-gray-100 text-gray-600'
                          : 'bg-orange-100 text-orange-600'
                      }`}
                    >
                      {content.status === 'PUBLISHED'
                        ? 'Опубликовано'
                        : content.status === 'DRAFT'
                        ? 'Черновик'
                        : 'На проверке'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
