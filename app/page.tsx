import { Hero } from '@/components/home/Hero';
import { CourseCard } from '@/components/home/CourseCard';
import { ArticleCard } from '@/components/home/ArticleCard';
import { CalculatorCard } from '@/components/home/CalculatorCard';
import { Features } from '@/components/home/Features';
import { Testimonials } from '@/components/home/Testimonials';
// Footer импортируется из layout, он уже есть в RootLayout

// Временные данные для главной страницы
const popularCourses = [
  { id: '1', title: 'Основы инвестирования', description: 'Научитесь основам работы с инвестициями', difficultyLevel: 'BEGINNER', coverImage: null, isPremium: false },
  { id: '2', title: 'Управление личными финансами', description: 'Как эффективно управлять своим бюджетом', difficultyLevel: 'BEGINNER', coverImage: null, isPremium: false },
  { id: '3', title: 'Налоги и страхование', description: 'Всё о налогах и страховых продуктах', difficultyLevel: 'INTERMEDIATE', coverImage: null, isPremium: true },
  { id: '4', title: 'Криптовалюты для начинающих', description: 'Введение в мир криптовалют', difficultyLevel: 'BEGINNER', coverImage: null, isPremium: true },
  { id: '5', title: 'Недвижимость как инвестиция', description: 'Как инвестировать в недвижимость', difficultyLevel: 'INTERMEDIATE', coverImage: null, isPremium: true },
  { id: '6', title: 'Пенсионное планирование', description: 'Как накопить на пенсию', difficultyLevel: 'ADVANCED', coverImage: null, isPremium: true },
];

const latestArticles = [
  { id: '1', title: 'Как начать инвестировать с нуля', description: 'Пошаговое руководство для начинающих', publishedAt: new Date().toISOString() },
  { id: '2', title: 'Что такое сложный процент', description: 'Математика финансового роста', publishedAt: new Date().toISOString() },
  { id: '3', title: 'Ошибки начинающих инвесторов', description: 'Чего следует избегать', publishedAt: new Date().toISOString() },
  { id: '4', title: 'Как выбрать брокера', description: 'На что обратить внимание', publishedAt: new Date().toISOString() },
];

const calculators = [
  { id: '1', title: 'Кредитный калькулятор', description: 'Рассчитайте платежи по кредиту', slug: 'credit', icon: '💳' },
  { id: '2', title: 'Калькулятор вкладов', description: 'Рассчитайте доходность вклада', slug: 'deposit', icon: '🏦' },
  { id: '3', title: 'Ипотечный калькулятор', description: 'Рассчитайте ипотеку', slug: 'mortgage', icon: '🏠' },
];

const features = [
  { title: 'Эксперты', description: 'Обучаем у практиков финансового рынка', icon: '👨‍🏫' },
  { title: 'Практика', description: 'Закрепляем знания на реальных кейсах', icon: '💼' },
  { title: 'Сертификаты', description: 'Подтверждаем вашу квалификацию', icon: '📜' },
  { title: 'Сообщество', description: 'Общаемся с единомышленниками', icon: '👥' },
];

const testimonials = [
  { id: '1', name: 'Анна К.', text: 'Отличный курс! Всё понятно и доступно.', role: 'Студент' },
  { id: '2', name: 'Михаил П.', text: 'Получил реальные навыки инвестирования.', role: 'Предприниматель' },
  { id: '3', name: 'Елена С.', text: 'Рекомендую всем, кто хочет разобраться в финансах.', role: 'Менеджер' },
  { id: '4', name: 'Иван Д.', text: 'Лучший курс по финансовой грамотности!', role: 'Разработчик' },
];

export default async function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero секция */}
      {/* <Hero /> */}

      {/* Популярные курсы */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#264653] mb-4">
              Популярные курсы
            </h2>
            <p className="text-xl text-[#6C757D] max-w-2xl mx-auto">
              Начните с самых востребованных направлений
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {popularCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>

          <div className="text-center mt-12">
            <a 
              href="/courses" 
              className="inline-flex items-center text-[#F4A261] hover:text-[#e08e4a] font-medium transition-colors"
            >
              Смотреть все курсы
              <svg className="w-5 h-5 ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Калькуляторы */}
      <section className="py-20 bg-[#F8F9FA]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#264653] mb-4">
              Финансовые калькуляторы
            </h2>
            <p className="text-xl text-[#6C757D] max-w-2xl mx-auto">
              Рассчитайте ипотеку, кредит или депозит за минуту
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {calculators.map((calculator) => (
              <CalculatorCard key={calculator.id} calculator={calculator} />
            ))}
          </div>
        </div>
      </section>

      {/* Преимущества */}
      <Features features={features} />

      {/* Последние статьи */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#264653] mb-4">
              Последние статьи
            </h2>
            <p className="text-xl text-[#6C757D] max-w-2xl mx-auto">
              Полезные материалы по финансовой грамотности
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {latestArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>

          <div className="text-center mt-12">
            <a 
              href="/articles" 
              className="inline-flex items-center text-[#F4A261] hover:text-[#e08e4a] font-medium transition-colors"
            >
              Читать все статьи
              <svg className="w-5 h-5 ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Отзывы */}
      <Testimonials testimonials={testimonials} />
    </main>
  );
}