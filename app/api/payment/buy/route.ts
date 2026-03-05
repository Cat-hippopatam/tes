import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, contentId, amount } = body;

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

    // Фиктивная транзакция — всегда успешна
    const transaction = await prisma.transaction.create({
      data: {
        userId: userId || 'demo-user-id',
        amount: amount || content.price || 4900,
        currency: 'RUB',
        status: 'COMPLETED',
        type: 'PURCHASE',
        description: `Покупка контента: ${content.title}`,
        paymentMethod: 'fake_card',
        contentId: contentId,
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
