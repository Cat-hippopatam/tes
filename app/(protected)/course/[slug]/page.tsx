import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PlayCircle, FileText, Clock, Users, ChevronDown } from 'lucide-react';

async function fetchCourse(slug: string) {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
  const res = await fetch(`${baseUrl}/api/course/${slug}`, {
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

// Компонент модуля с раскрытием
function ModuleAccordion({ 
  module, 
  courseSlug,
  index 
}: { 
  module: any; 
  courseSlug: string;
  index: number;
}) {
  const totalDuration = module.lessons?.reduce((acc: number, l: any) => acc + (l.videoDuration || 0), 0) || 0;
  const completedLessons = 0; // TODO: получить из прогресса пользователя
  
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
      <div className="p-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-[#F4A261] text-white flex items-center justify-center text-sm font-medium">
            {index + 1}
          </span>
          <div>
            <h3 className="font-semibold text-[#264653]">{module.title}</h3>
            <p className="text-sm text-[#6C757D]">
              {module.lessons?.length || 0} уроков • {formatDuration(totalDuration)}
            </p>
          </div>
        </div>
        <ChevronDown className="w-5 h-5 text-[#6C757D]" />
      </div>
      
      <div className="divide-y divide-gray-100">
        {module.lessons?.map((lesson: any) => (
          <Link
            key={lesson.id}
            href={`/lesson/${lesson.slug}`}
            className="p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors"
          >
            {lesson.type === 'VIDEO' ? (
              <PlayCircle className="w-5 h-5 text-[#2A9D8F]" />
            ) : (
              <FileText className="w-5 h-5 text-[#457B9D]" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#264653] truncate">{lesson.title}</p>
              <p className="text-xs text-[#6C757D]">
                {lesson.type === 'VIDEO' ? 'Видео' : 'Статья'} 
                {lesson.videoDuration && ` • ${formatDuration(lesson.videoDuration)}`}
              </p>
            </div>
            {completedLessons > 0 && (
              <span className="text-xs text-[#2A9D8F]">✓</span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const payload = await fetchCourse(slug);
  
  if (!payload) notFound();
  const { data: course } = payload;

  const totalLessons = course.courseModules?.reduce(
    (acc: number, m: any) => acc + (m.lessons?.length || 0), 
    0
  ) || 0;
  
  const totalDuration = course.courseModules?.reduce(
    (acc: number, m: any) => acc + m.lessons?.reduce((a: number, l: any) => a + (l.videoDuration || 0), 0),
    0
  ) || 0;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8F6F3' }}>
      {/* Header */}
      <div className="bg-white border-b" style={{ borderColor: '#E8E4DE' }}>
        <div className="container mx-auto px-4 py-6">
          <Link 
            href="/catalog" 
            className="text-sm mb-4 inline-flex items-center gap-1 hover:opacity-80"
            style={{ color: '#5A6A7A' }}
          >
            ← Вернуться к каталогу
          </Link>
          
          <div className="flex flex-col lg:flex-row gap-6 mt-4">
            {/* Обложка курса */}
            <div className="w-full lg:w-80 h-48 rounded-xl overflow-hidden flex-shrink-0" style={{ backgroundColor: '#E8E4DE' }}>
              {course.coverImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                  src={course.coverImage} 
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#457B9D] to-[#2A9D8F]">
                  <span className="text-white text-4xl font-bold">
                    {course.title?.charAt(0)}
                  </span>
                </div>
              )}
            </div>
            
            {/* Информация о курсе */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                {course.isPremium && (
                  <span className="text-xs px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: '#F4A261' }}>
                    Premium
                  </span>
                )}
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#F0EDE8', color: '#5A6A7A' }}>
                  {course.difficultyLevel === 'BEGINNER' ? 'Начинающий' : 
                   course.difficultyLevel === 'INTERMEDIATE' ? 'Средний' : 'Продвинутый'}
                </span>
              </div>
              
              <h1 className="text-2xl lg:text-3xl font-bold mb-3" style={{ color: '#2C3E50' }}>{course.title}</h1>
              
              <p className="mb-4" style={{ color: '#5A6A7A' }}>{course.description}</p>
              
              {/* Статистика */}
              <div className="flex flex-wrap gap-4 text-sm mb-4" style={{ color: '#5A6A7A' }}>
                <span className="flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  {totalLessons} уроков
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {formatDuration(totalDuration)}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {course.viewsCount || 0} просмотров
                </span>
              </div>
              
              {/* Автор */}
              {course.author && (
                <div className="flex items-center gap-2">
                  {course.author.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={course.author.avatarUrl} 
                      alt={course.author.displayName}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm" style={{ backgroundColor: '#457B9D' }}>
                      {course.author.displayName?.charAt(0)}
                    </div>
                  )}
                  <span className="text-sm" style={{ color: '#2C3E50' }}>{course.author.displayName}</span>
                </div>
              )}
              
              {/* Кнопки для Premium контента */}
              {course.isPremium && (
                <div className="flex flex-wrap gap-3 mt-4">
                  <button 
                    data-open-modal="subscribe"
                    className="px-4 py-2 rounded-lg text-white font-medium transition-all hover:opacity-90"
                    style={{ backgroundColor: '#457B9D', boxShadow: '0 4px 16px rgba(69, 123, 157, 0.15)' }}
                  >
                    Оформить подписку
                  </button>
                  <button 
                    data-open-modal="payment"
                    data-product-id={course.id}
                    className="px-4 py-2 rounded-lg border-2 font-medium transition-all hover:bg-gray-50"
                    style={{ borderColor: '#FFD166', color: '#2C3E50' }}
                  >
                    Купить курс
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Содержание курса */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-xl font-bold mb-4" style={{ color: '#2C3E50' }}>Содержание курса</h2>
        
        <div className="space-y-4">
          {course.courseModules?.map((module: any, index: number) => (
            <ModuleAccordion 
              key={module.id} 
              module={module} 
              courseSlug={slug}
              index={index}
            />
          ))}
        </div>
        
        {(!course.courseModules || course.courseModules.length === 0) && (
          <div className="text-center py-12" style={{ color: '#5A6A7A' }}>
            Модули курса пока не добавлены
          </div>
        )}
      </div>
    </div>
  );
}
