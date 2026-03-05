import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PlayCircle, FileText, ArrowLeft, CheckCircle, Lock } from 'lucide-react';

async function fetchModule(slug: string, moduleId: string) {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
  const res = await fetch(`${baseUrl}/api/course/${slug}/module/${moduleId}`, {
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

export default async function ModulePage({ 
  params 
}: { 
  params: Promise<{ slug: string; moduleId: string }> 
}) {
  const { slug, moduleId } = await params;
  const payload = await fetchModule(slug, moduleId);
  
  if (!payload) notFound();
  const { data: module } = payload;

  const totalDuration = module.lessons?.reduce(
    (acc: number, l: any) => acc + (l.videoDuration || 0), 
    0
  ) || 0;

  return (
    <div className="min-h-screen bg-[#F8F6F3]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <Link 
            href={`/course/${slug}`}
            className="text-sm text-[#6C757D] hover:text-[#264653] inline-flex items-center gap-1 mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            К курсу
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#264653]">{module.title}</h1>
              <p className="text-sm text-[#6C757D]">
                {module.courseTitle} • {module.lessons?.length || 0} уроков • {formatDuration(totalDuration)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Список уроков */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-3">
          {module.lessons?.map((lesson: any, index: number) => (
            <Link
              key={lesson.id}
              href={`/lesson/${lesson.slug}`}
              className="block bg-white border border-gray-200 rounded-xl p-4 hover:border-[#F4A261] hover:shadow-sm transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#F8F6F3] flex items-center justify-center flex-shrink-0">
                  {lesson.type === 'VIDEO' ? (
                    <PlayCircle className="w-5 h-5 text-[#2A9D8F]" />
                  ) : (
                    <FileText className="w-5 h-5 text-[#457B9D]" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-[#6C757D]">{index + 1}.</span>
                    <h3 className="font-medium text-[#264653] truncate">{lesson.title}</h3>
                  </div>
                  <p className="text-sm text-[#6C757D] mt-1">
                    {lesson.type === 'VIDEO' ? 'Видео-урок' : 'Статья'}
                    {lesson.videoDuration && ` • ${formatDuration(lesson.videoDuration)}`}
                    {lesson.description && ` • ${lesson.description}`}
                  </p>
                </div>
                
                <div className="flex-shrink-0">
                  <PlayCircle className="w-6 h-6 text-[#6C757D]" />
                </div>
              </div>
            </Link>
          ))}
          
          {(!module.lessons || module.lessons.length === 0) && (
            <div className="text-center py-12 text-[#6C757D]">
              Уроки пока не добавлены
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
