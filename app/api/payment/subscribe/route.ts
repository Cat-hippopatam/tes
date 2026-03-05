import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, planType, amount } = body;

    // Фиктивная транзакция — всегда успешна
    const transaction = await prisma.transaction.create({
      data: {
        userId: userId || 'demo-user-id', // Для демо используем заглушку
        amount: amount || 9900, // 99₽ по умолчанию
        currency: 'RUB',
        status: 'COMPLETED',
        type: 'SUBSCRIPTION',
        description: `Подписка ${planType || 'premium'} - Economikus`,
        paymentMethod: 'fake_card',
      },
    });

    // Создаём или обновляем подписку
    const subscription = await prisma.subscription.upsert({
      where: { userId: userId || 'demo-user-id' },
      update: {
        status: 'ACTIVE',
        planType: planType || 'premium',
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 дней
      },
      create: {
        userId: userId || 'demo-user-id',
        status: 'ACTIVE',
        planType: planType || 'premium',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        transactionId: transaction.id,
        subscriptionId: subscription.id,
        status: 'ACTIVE',
      },
    });
  } catch (error) {
    console.error('Subscribe error:', error);
    return NextResponse.json(
      { success: false, error: 'Ошибка при оформлении подписки' },
      { status: 500 }
    );
  }
}
