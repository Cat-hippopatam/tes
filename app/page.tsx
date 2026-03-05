import { homeService } from '@/utils/lib/services/home-service';
import { Hero } from '@/components/home/Hero';
import { CourseCard } from '@/components/home/CourseCard';
import { ArticleCard } from '@/components/home/ArticleCard';
import { CalculatorCard } from '@/components/home/CalculatorCard';
import { Features } from '@/components/home/Features';
import { Testimonials } from '@/components/home/Testimonials';
// Footer импортируется из layout, он уже есть в RootLayout

export default async function HomePage() {
  // Получаем данные из сервиса
  const [popularCourses, latestArticles, calculators, features, testimonials] = await Promise.all([
    homeService.getPopularCourses(6),
    homeService.getLatestArticles(4),
    homeService.getCalculators(),
    homeService.getFeatures(),
    homeService.getTestimonials(4)
  ]);

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