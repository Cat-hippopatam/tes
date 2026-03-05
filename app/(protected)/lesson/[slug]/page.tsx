import { notFound } from 'next/navigation';
import Link from 'next/link';
import DOMPurify from 'isomorphic-dompurify';
import { ArrowLeft, PlayCircle, FileText, Clock, Bookmark } from 'lucide-react';

async function fetchLesson(slug: string) {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
  const res = await fetch(`${baseUrl}/api/lesson/${slug}`, {
    method: 'GET',
    cache: 'no-store',
  });
  if (!res.ok) return null;
  return res.json() as Promise<{ data: any }>;
}

// Функция для форматирования времени
function formatDuration(seconds: number | null | undefined): string {
  if (!seconds) return '';
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours > 0) {
    return `${hours}ч ${mins}мин`;
  }
  return `${mins} мин`;
}

// Premium Gate Component
function PremiumGate({ isPremium }: { isPremium: boolean }) {
  if (!isPremium) return null;
  
  return (
    <div className="p-6 border-2 border-dashed border-[#F4A261] rounded-xl text-center bg-[#FFF8F0]">
      <p className="text-[#264653] font-semibold mb-2">🔒 Премиум контент</p>
      <p className="text-sm text-[#6C757D] mb-4">
        Для доступа к этому уроку оформите подписку
      </p>
      <div className="flex justify-center gap-3">
        <button 
          data-open-modal="subscribe"
          className="px-4 py-2 rounded-lg text-white font-medium transition-colors"
          style={{ backgroundColor: '#F4A261' }}
        >
          Оформить подписку
        </button>
        <button 
          data-open-modal="payment"
          className="px-4 py-2 rounded-lg border-2 font-medium transition-colors hover:bg-[#FFF8F0]"
          style={{ borderColor: '#F4A261', color: '#F4A261' }}
        >
          Купить доступ
        </button>
      </div>
    </div>
  );
}

export default async function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const payload = await fetchLesson(slug);
  
  if (!payload) notFound();
  const { data: lesson } = payload;

  const isVideo = lesson.type === 'VIDEO' && lesson.videoUrl;
  const isArticle = lesson.type === 'ARTICLE' && lesson.body;

  // Форматирование даты
  const formattedDate = lesson.publishedAt 
    ? new Date(lesson.publishedAt).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    : '';

  return (
    <div className="min-h-screen bg-[#F8F6F3]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link 
                href={lesson.module?.course?.slug ? `/course/${lesson.module.course.slug}` : '/catalog'}
                className="text-[#6C757D] hover:text-[#264653]"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                {lesson.module?.course && (
                  <Link 
                    href={`/course/${lesson.module.course.slug}`}
                    className="text-xs text-[#6C757D] hover:text-[#264653]"
                  >
                    {lesson.module.course.title}
                  </Link>
                )}
                {lesson.module && (
                  <Link 
                    href={`/course/${lesson.module.course?.slug}/module/${lesson.module.id}`}
                    className="text-xs text-[#6C757D] hover:text-[#264653] block"
                  >
                    {lesson.module.title}
                  </Link>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Кнопка избранного */}
              <button 
                data-open-modal="favorite"
                data-content-id={lesson.id}
                className="p-2 rounded-lg hover:bg-gray-100 text-[#6C757D] hover:text-[#F4A261] transition-colors"
                title="В избранное"
              >
                <Bookmark className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Основной контент */}
          <div className="lg:col-span-8 space-y-6">
            {/* Заголовок */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-[#264653] mb-3">
                {lesson.title}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-[#6C757D]">
                {lesson.author && (
                  <div className="flex items-center gap-2">
                    {lesson.author.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img 
                        src={lesson.author.avatarUrl} 
                        alt={lesson.author.displayName}
                        className="w-6 h-6 rounded-full"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-[#457B9D] flex items-center justify-center text-white text-xs">
                        {lesson.author.displayName?.charAt(0)}
                      </div>
                    )}
                    <span>{lesson.author.displayName}</span>
                  </div>
                )}
                <span>•</span>
                <span>{formattedDate}</span>
                {lesson.videoDuration && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {formatDuration(lesson.videoDuration)}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Видео или статья */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {isVideo && (
                <div className="aspect-video w-full bg-black">
                  <iframe
                    className="w-full h-full"
                    src={lesson.videoUrl}
                    title={lesson.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}

              {isArticle && (
                <div className="p-6 prose max-w-none">
                  <div 
                    dangerouslySetInnerHTML={{ 
                      __html: DOMPurify.sanitize(lesson.body || '') 
                    }} 
                  />
                </div>
              )}
            </div>

            {/* Premium Gate */}
            <PremiumGate isPremium={lesson.courseIsPremium} />

            {/* Реакции (заглушка — будет реализовано на Этапе 4) */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-1 text-[#6C757D] hover:text-[#2A9D8F] transition-colors">
                  <span>👍</span>
                  <span className="text-sm">{lesson.likesCount || 0}</span>
                </button>
                <button className="flex items-center gap-1 text-[#6C757D] hover:text-[#FF6B6B] transition-colors">
                  <span>👎</span>
                </button>
              </div>
            </div>

            {/* Навигация между уроками */}
            {lesson.module?.lessons && (
              <div className="flex justify-between">
                <div className="text-sm text-[#6C757D]">
                  Предыдущий урок
                </div>
                <div className="text-sm text-[#6C757D]">
                  Следующий урок
                </div>
              </div>
            )}
          </div>

          {/* Боковая панель */}
          <aside className="lg:col-span-4 space-y-4">
            {/* Теги */}
            {lesson.tags?.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <p className="text-sm font-semibold mb-3 text-[#264653]">Теги</p>
                <div className="flex flex-wrap gap-2">
                  {lesson.tags.map((tag: any) => (
                    <Link
                      key={tag.id}
                      href={`/catalog?tag=${tag.slug}`}
                      className="text-xs px-2 py-1 rounded-full border hover:bg-gray-50"
                      style={{ borderColor: tag.color || '#e5e7eb', color: '#6C757D' }}
                    >
                      {tag.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Структура модуля */}
            {lesson.module && (
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <p className="text-sm font-semibold mb-3 text-[#264653]">
                  {lesson.module.title}
                </p>
                <div className="space-y-2">
                  {/* Сюда можно добавить навигацию по урокам модуля */}
                  <Link 
                    href={`/course/${lesson.module.course?.slug}/module/${lesson.module.id}`}
                    className="text-sm text-[#457B9D] hover:underline"
                  >
                    Все уроки модуля →
                  </Link>
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
