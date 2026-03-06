import { notFound } from 'next/navigation';
import Link from 'next/link';
import React from 'react';
import DOMPurify from 'isomorphic-dompurify';
import { ArrowLeft, PlayCircle, FileText, Clock, Bookmark } from 'lucide-react';
import Reactions from '@/components/common/reactions';
import ViewTracker from '@/components/common/view-tracker';

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
function PremiumGate({ isPremium }: { isPremium: boolean }): React.ReactNode {
  if (!isPremium) return null;
  
  return (
    <div className="p-6 border-2 border-dashed rounded-xl text-center" style={{ borderColor: '#FFD166', backgroundColor: '#FBF9F6' }}>
      <p className="font-semibold mb-2" style={{ color: '#2C3E50' }}>🔒 Премиум контент</p>
      <p className="text-sm mb-4" style={{ color: '#5A6A7A' }}>
        Для доступа к этому уроку оформите подписку
      </p>
      <div className="flex justify-center gap-3 flex-wrap">
        <button 
          data-open-modal="subscribe"
          className="px-4 py-2 rounded-lg text-white font-medium transition-all hover:opacity-90"
          style={{ backgroundColor: '#457B9D', boxShadow: '0 4px 16px rgba(69, 123, 157, 0.15)' }}
        >
          Оформить подписку
        </button>
        <button 
          data-open-modal="payment"
          className="px-4 py-2 rounded-lg border-2 font-medium transition-all hover:bg-gray-50"
          style={{ borderColor: '#FFD166', color: '#2C3E50' }}
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
    <div className="min-h-screen" style={{ backgroundColor: '#F8F6F3' }}>
      <ViewTracker contentId={lesson.id} />
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10" style={{ borderColor: '#E8E4DE' }}>
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link 
                href={lesson.module?.course?.slug ? `/course/${lesson.module.course.slug}` : '/catalog'}
                className="hover:opacity-80"
                style={{ color: '#5A6A7A' }}
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                {lesson.module?.course && (
                  <Link 
                    href={`/course/${lesson.module.course.slug}`}
                    className="text-xs hover:opacity-80"
                    style={{ color: '#5A6A7A' }}
                  >
                    {lesson.module.course.title}
                  </Link>
                )}
                {lesson.module && (
                  <Link 
                    href={`/course/${lesson.module.course?.slug}/module/${lesson.module.id}`}
                    className="text-xs hover:opacity-80 block"
                    style={{ color: '#5A6A7A' }}
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
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                style={{ color: '#5A6A7A' }}
                title="В избранное"
              >
                <Bookmark className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Основной контент */}
          <div className="lg:col-span-8 space-y-6">
            {/* Заголовок */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: '#2C3E50' }}>
                {lesson.title}
              </h1>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-sm" style={{ color: '#5A6A7A' }}>
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
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs" style={{ backgroundColor: '#457B9D' }}>
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
            <div className="bg-white rounded-xl overflow-hidden" style={{ border: '1px solid #E8E4DE' }}>
              {isVideo && (
                <div className="aspect-video w-full" style={{ backgroundColor: '#2C3E50' }}>
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
                <div className="p-4 sm:p-6 prose max-w-none">
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

            {/* Реакции */}
            <div className="bg-white rounded-xl p-4" style={{ border: '1px solid #E8E4DE' }}>
              <Reactions 
                contentId={lesson.id} 
                initialLikes={lesson.likesCount || 0}
                initialDislikes={lesson.dislikesCount || 0}
              />
            </div>

            {/* Навигация между уроками */}
            {lesson.module?.lessons && (
              <div className="flex justify-between text-sm" style={{ color: '#5A6A7A' }}>
                <div>Предыдущий урок</div>
                <div>Следующий урок</div>
              </div>
            )}
          </div>

          {/* Боковая панель */}
          <aside className="lg:col-span-4 space-y-4">
            {/* Теги */}
            {lesson.tags?.length > 0 && (
              <div className="bg-white rounded-xl p-4" style={{ border: '1px solid #E8E4DE' }}>
                <p className="text-sm font-semibold mb-3" style={{ color: '#2C3E50' }}>Теги</p>
                <div className="flex flex-wrap gap-2">
                  {lesson.tags.map((tag: any) => (
                    <Link
                      key={tag.id}
                      href={`/catalog?tag=${tag.slug}`}
                      className="text-xs px-2 py-1 rounded-full border hover:bg-gray-50"
                      style={{ borderColor: tag.color || '#E8E4DE', color: '#5A6A7A' }}
                    >
                      {tag.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Структура модуля */}
            {lesson.module && (
              <div className="bg-white rounded-xl p-4" style={{ border: '1px solid #E8E4DE' }}>
                <p className="text-sm font-semibold mb-3" style={{ color: '#2C3E50' }}>
                  {lesson.module.title}
                </p>
                <div className="space-y-2">
                  <Link 
                    href={`/course/${lesson.module.course?.slug}/module/${lesson.module.id}`}
                    className="text-sm hover:underline"
                    style={{ color: '#457B9D' }}
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
