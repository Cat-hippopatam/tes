import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/lib/prisma';
import { auth } from '@/auth/auth';
import { TransactionStatus } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const body = await request.json();
    const { contentId, amount } = body;

    // Проверяем, что контент существует
    const content = await prisma.content.findUnique({
      where: { id: contentId },
    });

    if (!content) {
      return NextResponse.json(
        { success: false, error: 'Контент не найден' },
        { status: 404 }
      );
    }

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
        amount: amount || 4900,
        currency: 'RUB',
        status: TransactionStatus.COMPLETED,
        type: 'one_time_purchase',
        contentId: contentId,
        provider: 'fake_provider',
        completedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        transactionId: transaction.id,
        contentId: contentId,
        status: 'PURCHASED',
      },
    });
  } catch (error) {
    console.error('Purchase error:', error);
    return NextResponse.json(
      { success: false, error: 'Ошибка при покупке' },
      { status: 500 }
    );
  }
}
