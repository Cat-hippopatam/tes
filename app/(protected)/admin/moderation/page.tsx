import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, XCircle, Clock, FileText, User } from 'lucide-react';

async function fetchModerationContent() {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
  const res = await fetch(`${baseUrl}/api/moderation?status=PENDING_REVIEW`, {
    cache: 'no-store',
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function ModerationPage() {
  const payload = await fetchModerationContent();
  if (!payload) notFound();

  const { data: contents } = payload;

  return (
    <div className="min-h-screen bg-[#F8F6F3]">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-2">
          <Link href="/admin" className="text-sm text-[#6C757D] hover:text-[#264653]">
            ← Админ-панель
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-[#264653] mb-2">Модерация контента</h1>
        <p className="text-[#6C757D] mb-8">Проверка и утверждение контента авторов</p>

        {contents.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <p className="text-lg font-medium text-[#264653]">Нет контента на модерацию</p>
            <p className="text-sm text-[#6C757D]">Все материалы проверены</p>
          </div>
        ) : (
          <div className="space-y-4">
            {contents.map((content: any) => (
              <div
                key={content.id}
                className="bg-white rounded-xl border border-gray-200 p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 text-xs rounded-full bg-orange-100 text-orange-600">
                        {content.type}
                      </span>
                      <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600">
                        {content.difficultyLevel}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold text-[#264653] mb-2">
                      {content.title}
                    </h3>
                    <p className="text-sm text-[#6C757D] mb-4 line-clamp-2">
                      {content.description}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-[#6C757D]">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {content.author?.profile?.displayName || 'Автор'}
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        {content._count?.comments || 0} комментариев
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {new Date(content.createdAt).toLocaleDateString('ru-RU')}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <form action="/api/moderation" method="POST">
                      <input type="hidden" name="contentId" value={content.id} />
                      <input type="hidden" name="action" value="approve" />
                      <button
                        type="submit"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Одобрить
                      </button>
                    </form>
                    <form action="/api/moderation" method="POST">
                      <input type="hidden" name="contentId" value={content.id} />
                      <input type="hidden" name="action" value="reject" />
                      <button
                        type="submit"
                        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-500 text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                        Отклонить
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
