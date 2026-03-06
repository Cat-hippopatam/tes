import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Users, FileText, Shield, Settings, BarChart3, CheckCircle, XCircle, Clock } from 'lucide-react';

async function fetchStats() {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

  const [usersRes, contentRes, moderationRes] = await Promise.all([
    fetch(`${baseUrl}/api/admin/users?limit=1`, { cache: 'no-store' }),
    fetch(`${baseUrl}/api/content?limit=1`, { cache: 'no-store' }),
    fetch(`${baseUrl}/api/moderation?limit=1`, { cache: 'no-store' }),
  ]);

  const usersData = await usersRes.json();
  const contentData = await contentRes.json();
  const moderationData = await moderationRes.json();

  return {
    totalUsers: usersData.pagination?.total || 0,
    totalContent: contentData.pagination?.total || 0,
    pendingModeration: moderationData.pagination?.total || 0,
  };
}

export default async function AdminPage() {
  const stats = await fetchStats();

  const adminSections = [
    {
      title: 'Пользователи',
      description: 'Управление пользователями и ролями',
      icon: Users,
      href: '/admin/users',
      color: 'bg-blue-500',
    },
    {
      title: 'Контент',
      description: 'Управление контентом',
      icon: FileText,
      href: '/admin/content',
      color: 'bg-green-500',
    },
    {
      title: 'Модерация',
      description: 'Модерация контента',
      icon: Shield,
      href: '/admin/moderation',
      color: 'bg-orange-500',
      badge: stats.pendingModeration,
    },
    {
      title: 'Аналитика',
      description: 'Статистика и метрики',
      icon: BarChart3,
      href: '/admin/analytics',
      color: 'bg-purple-500',
    },
    {
      title: 'Настройки',
      description: 'Настройки системы',
      icon: Settings,
      href: '/admin/settings',
      color: 'bg-gray-500',
    },
  ];

  return (
    <div className="min-h-screen bg-warm">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-dark mb-2">Панель администратора</h1>
        <p className="text-mid mb-6 sm:mb-8">Управление платформой Economikus</p>

        {/* Статистика */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 sm:mb-8">
          <div className="bg-white rounded-xl border border-[#E8E4DE] p-6 card-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue" />
              </div>
              <div>
                <p className="text-sm text-mid">Пользователей</p>
                <p className="text-2xl font-bold text-dark">{stats.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#E8E4DE] p-6 card-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-green" />
              </div>
              <div>
                <p className="text-sm text-mid">Контента</p>
                <p className="text-2xl font-bold text-dark">{stats.totalContent}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#E8E4DE] p-6 card-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-sand/20 flex items-center justify-center">
                <Clock className="w-6 h-6 text-sand" />
              </div>
              <div>
                <p className="text-sm text-mid">На модерации</p>
                <p className="text-2xl font-bold text-dark">{stats.pendingModeration}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Секции */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {adminSections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="bg-white rounded-xl border border-[#E8E4DE] p-6 hover:card-shadow-hover transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-lg ${section.color} flex items-center justify-center`}>
                  <section.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-dark group-hover:text-sand transition-colors">
                      {section.title}
                    </h3>
                    {section.badge && section.badge > 0 && (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-600">
                        {section.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-mid mt-1">{section.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
