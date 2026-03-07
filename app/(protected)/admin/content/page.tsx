'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Spinner, Button, Input, Select, SelectItem, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from '@heroui/react';
import { FileText, Search, Edit, Trash2, Eye, ChevronLeft, ChevronRight, Video, FileBarChart, BookOpen, Mic } from 'lucide-react';

interface Content {
  id: string;
  title: string;
  slug: string;
  type: string;
  status: string;
  isPremium: boolean;
  publishedAt: string | null;
  viewsCount: number;
  likesCount: number;
  author: {
    id: string;
    nickname: string;
    displayName: string;
  };
  tags: Array<{ id: string; name: string; slug: string }>;
}

interface PaginationInfo {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

const CONTENT_TYPES = [
  { key: 'COURSE', label: 'Курс', icon: BookOpen },
  { key: 'ARTICLE', label: 'Статья', icon: FileText },
  { key: 'VIDEO', label: 'Видео', icon: Video },
  { key: 'PODCAST', label: 'Подкаст', icon: Mic },
];

const CONTENT_STATUSES = [
  { key: 'DRAFT', label: 'Черновик' },
  { key: 'PENDING_REVIEW', label: 'На проверке' },
  { key: 'PUBLISHED', label: 'Опубликован' },
  { key: 'ARCHIVED', label: 'В архиве' },
];

export default function AdminContentPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [content, setContent] = useState<Content[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({ page: 1, pageSize: 20, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Modal states
  const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  useEffect(() => {
    const userRole = (session?.user as any)?.role;
    if (userRole !== 'ADMIN' && userRole !== 'MODERATOR') {
      router.push('/');
    }
  }, [session, router]);

  useEffect(() => {
    fetchContent();
  }, [pagination.page, typeFilter, statusFilter]);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', pagination.page.toString());
      params.set('pageSize', pagination.pageSize.toString());
      if (typeFilter) params.set('type', typeFilter);
      if (statusFilter) params.set('status', statusFilter);
      if (search) params.set('search', search);

      // For admin we need to show all statuses, not just PUBLISHED
      // So we'll fetch directly from a new admin API or modify the query
      const res = await fetch(`/api/admin/content?${params}`);
      const data = await res.json();
      
      if (data.data) {
        setContent(data.data);
        setPagination(prev => ({ ...prev, ...data.meta }));
      }
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchContent();
  };

  const handleView = (item: Content) => {
    setSelectedContent(item);
    onViewOpen();
  };

  const handleDelete = (item: Content) => {
    setSelectedContent(item);
    onDeleteOpen();
  };

  const deleteContent = async () => {
    if (!selectedContent) return;
    
    try {
      const res = await fetch(`/api/admin/content?id=${selectedContent.id}`, {
        method: 'DELETE',
      });
      
      const data = await res.json();
      
      if (data.success) {
        onDeleteClose();
        fetchContent();
      } else {
        alert(data.error || 'Ошибка при удалении');
      }
    } catch (error) {
      console.error('Error deleting content:', error);
      alert('Ошибка при удалении');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'COURSE': return <BookOpen className="w-4 h-4" />;
      case 'VIDEO': return <Video className="w-4 h-4" />;
      case 'PODCAST': return <Mic className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED': return 'text-green-600 bg-green-50';
      case 'PENDING_REVIEW': return 'text-orange-600 bg-orange-50';
      case 'DRAFT': return 'text-gray-600 bg-gray-50';
      case 'ARCHIVED': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (status === 'loading' || loading && content.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" color="warning" />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8F6F3' }}>
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10" style={{ borderColor: '#E8E4DE' }}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="light"
              onPress={() => router.push('/admin')}
              startContent={<ChevronLeft className="w-4 h-4" />}
            >
              Назад
            </Button>
            <div>
              <h1 className="text-2xl font-bold" style={{ color: '#264653' }}>Управление контентом</h1>
              <p className="text-sm" style={{ color: '#6C757D' }}>Всего: {pagination.total} материалов</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Filters */}
        <div className="bg-white rounded-xl p-4 mb-6" style={{ border: '1px solid #E8E4DE' }}>
          <form onSubmit={handleSearch} className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder="Поиск по названию..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                startContent={<Search className="w-4 h-4" />}
              />
            </div>
            <div className="w-[180px]">
              <select
                className="w-full px-3 py-2 rounded-lg border bg-white"
                style={{ borderColor: '#E8E4DE', color: '#264653' }}
                value={typeFilter}
                onChange={(e) => {
                  setTypeFilter(e.target.value);
                  setPagination(prev => ({ ...prev, page: 1 }));
                }}
              >
                <option value="">Все типы</option>
                {CONTENT_TYPES.map((type) => (
                  <option key={type.key} value={type.key}>{type.label}</option>
                ))}
              </select>
            </div>
            <div className="w-[180px]">
              <select
                className="w-full px-3 py-2 rounded-lg border bg-white"
                style={{ borderColor: '#E8E4DE', color: '#264653' }}
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPagination(prev => ({ ...prev, page: 1 }));
                }}
              >
                <option value="">Все статусы</option>
                {CONTENT_STATUSES.map((status) => (
                  <option key={status.key} value={status.key}>{status.label}</option>
                ))}
              </select>
            </div>
            <Button type="submit" style={{ backgroundColor: '#2A9D8F', color: 'white' }}>
              Поиск
            </Button>
          </form>
        </div>

        {/* Content Table */}
        <div className="bg-white rounded-xl overflow-hidden" style={{ border: '1px solid #E8E4DE' }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: '#F8F6F3' }}>
                  <th className="text-left p-4 font-medium" style={{ color: '#264653' }}>Название</th>
                  <th className="text-left p-4 font-medium" style={{ color: '#264653' }}>Тип</th>
                  <th className="text-left p-4 font-medium" style={{ color: '#264653' }}>Статус</th>
                  <th className="text-left p-4 font-medium" style={{ color: '#264653' }}>Автор</th>
                  <th className="text-left p-4 font-medium" style={{ color: '#264653' }}>Просмотры</th>
                  <th className="text-left p-4 font-medium" style={{ color: '#264653' }}>Дата</th>
                  <th className="text-right p-4 font-medium" style={{ color: '#264653' }}>Действия</th>
                </tr>
              </thead>
              <tbody>
                {content.map((item) => (
                  <tr key={item.id} className="border-t" style={{ borderColor: '#E8E4DE' }}>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded flex items-center justify-center" style={{ backgroundColor: '#F8F6F3', color: '#6C757D' }}>
                          {getTypeIcon(item.type)}
                        </div>
                        <div>
                          <p className="font-medium" style={{ color: '#264653' }}>{item.title}</p>
                          <p className="text-xs" style={{ color: '#6C757D' }}>{item.slug}</p>
                        </div>
                        {item.isPremium && (
                          <span className="px-2 py-0.5 text-xs rounded-full" style={{ backgroundColor: '#FFD166', color: '#264653' }}>
                            Premium
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="flex items-center gap-1" style={{ color: '#6C757D' }}>
                        {getTypeIcon(item.type)}
                        {CONTENT_TYPES.find(t => t.key === item.type)?.label || item.type}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {CONTENT_STATUSES.find(s => s.key === item.status)?.label || item.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <span style={{ color: '#6C757D' }}>{item.author?.displayName || '—'}</span>
                    </td>
                    <td className="p-4">
                      <span style={{ color: '#6C757D' }}>{item.viewsCount || 0} / {item.likesCount || 0}</span>
                    </td>
                    <td className="p-4">
                      <span style={{ color: '#6C757D' }}>
                        {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString('ru-RU') : '—'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          onPress={() => handleView(item)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          className="text-red-500"
                          onPress={() => handleDelete(item)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6">
            <Button
              isIconOnly
              size="sm"
              variant="flat"
              isDisabled={pagination.page <= 1}
              onPress={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span style={{ color: '#6C757D' }}>
              Страница {pagination.page} из {pagination.totalPages}
            </span>
            <Button
              isIconOnly
              size="sm"
              variant="flat"
              isDisabled={pagination.page >= pagination.totalPages}
              onPress={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* View Modal */}
      <Modal isOpen={isViewOpen} onClose={onViewClose} size="lg">
        <ModalContent>
          <ModalHeader>Просмотр контента</ModalHeader>
          <ModalBody>
            {selectedContent && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold" style={{ color: '#264653' }}>Название</h3>
                  <p>{selectedContent.title}</p>
                </div>
                <div>
                  <h3 className="font-semibold" style={{ color: '#264653' }}>Slug</h3>
                  <p className="text-sm" style={{ color: '#6C757D' }}>{selectedContent.slug}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold" style={{ color: '#264653' }}>Тип</h3>
                    <p>{CONTENT_TYPES.find(t => t.key === selectedContent.type)?.label || selectedContent.type}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold" style={{ color: '#264653' }}>Статус</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedContent.status)}`}>
                      {CONTENT_STATUSES.find(s => s.key === selectedContent.status)?.label || selectedContent.status}
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold" style={{ color: '#264653' }}>Автор</h3>
                  <p>{selectedContent.author?.displayName || '—'}</p>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <h3 className="font-semibold" style={{ color: '#264653' }}>Просмотры</h3>
                    <p>{selectedContent.viewsCount || 0}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold" style={{ color: '#264653' }}>Лайки</h3>
                    <p>{selectedContent.likesCount || 0}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold" style={{ color: '#264653' }}>Premium</h3>
                    <p>{selectedContent.isPremium ? 'Да' : 'Нет'}</p>
                  </div>
                </div>
                {selectedContent.tags?.length > 0 && (
                  <div>
                    <h3 className="font-semibold" style={{ color: '#264653' }}>Теги</h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedContent.tags.map((tag) => (
                        <span key={tag.id} className="px-2 py-1 text-xs rounded-full bg-gray-100" style={{ color: '#6C757D' }}>
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={onViewClose}>Закрыть</Button>
            <Button
              style={{ backgroundColor: '#2A9D8F', color: 'white' }}
              onPress={() => {
                onViewClose();
                router.push(`/content/${selectedContent?.slug}`);
              }}
            >
              Открыть на сайте
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
        <ModalContent>
          <ModalHeader>Удаление контента</ModalHeader>
          <ModalBody>
            <p>Вы уверены, что хотите удалить контент <strong>{selectedContent?.title}</strong>?</p>
            <p className="text-sm mt-2" style={{ color: '#6C757D' }}>Это действие нельзя отменить.</p>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={onDeleteClose}>Отмена</Button>
            <Button color="danger" onPress={deleteContent}>
              Удалить
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
