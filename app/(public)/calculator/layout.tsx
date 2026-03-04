import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Калькуляторы | Экономикус',
  description: 'Финансовые калькуляторы для расчета вкладов, кредитов, ипотеки',
};

export default function CalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}