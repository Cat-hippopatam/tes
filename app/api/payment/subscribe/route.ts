import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/lib/prisma';
import { auth } from '@/auth/auth';
import { TransactionStatus, SubscriptionStatus } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const body = await request.json();
    const { planType, amount } = body;

    // Получаем профиль пользователя
    const profile = await prisma.profile.findUnique({
      where: { userId: session?.user?.id },
    });

    if (!profile) {
      return NextResponse.json(
        { success: false, error: 'Профиль пользователя не найден' },
        { status: 400 }
      );
    }

    // Фиктивная транзакция — всегда успешна
    const transaction = await prisma.transaction.create({
      data: {
        profileId: profile.id,
        amount: amount || 9900, // 99₽ по умолчанию
        currency: 'RUB',
        status: TransactionStatus.COMPLETED,
        type: 'subscription',
        provider: 'fake_provider',
        completedAt: new Date(),
      },
    });

    // Создаём или обновляем подписку
    const existingSubscriptions = await prisma.subscription.findMany({
      where: { profileId: profile.id },
      orderBy: { createdAt: 'desc' },
      take: 1,
    });
    const existingSubscription = existingSubscriptions[0];

    let subscription;
    if (existingSubscription) {
      subscription = await prisma.subscription.update({
        where: { id: existingSubscription.id },
        data: {
          status: SubscriptionStatus.ACTIVE,
          planType: planType || 'premium',
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      });
    } else {
      subscription = await prisma.subscription.create({
        data: {
          profileId: profile.id,
          status: SubscriptionStatus.ACTIVE,
          planType: planType || 'premium',
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          price: amount || 9900,
        },
      });
    }

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
