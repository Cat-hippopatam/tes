'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Spinner, Button, Input, Select, SelectItem, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from '@heroui/react';
import { Users as UsersIcon, Search, Edit, Trash2, ChevronLeft, ChevronRight, Shield, User, Star } from 'lucide-react';

interface User {
  id: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  profile?: {
    nickname: string;
    displayName: string;
    avatarUrl: string | null;
    _count: {
      content: number;
      comments: number;
    };
  };
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

const ROLES = [
  { key: 'USER', label: 'Пользователь', icon: User },
  { key: 'AUTHOR', label: 'Автор', icon: Star },
  { key: 'MODERATOR', label: 'Модератор', icon: Shield },
  { key: 'ADMIN', label: 'Админ', icon: Shield },
];

export default function AdminUsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({ page: 1, limit: 20, total: 0, pages: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  
  // Modal states
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editRole, setEditRole] = useState('');
  const [editActive, setEditActive] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  useEffect(() => {
    const userRole = (session?.user as any)?.role;
    if (userRole !== 'ADMIN') {
      router.push('/');
    }
  }, [session, router]);

  useEffect(() => {
    fetchUsers();
  }, [pagination.page, roleFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', pagination.page.toString());
      params.set('limit', pagination.limit.toString());
      if (roleFilter) params.set('role', roleFilter);

      const res = await fetch(`/api/admin/users?${params}`);
      const data = await res.json();
      
      if (data.success) {
        setUsers(data.data);
        setPagination(prev => ({ ...prev, ...data.pagination }));
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    // TODO: implement search
    fetchUsers();
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setEditRole(user.role);
    setEditActive(user.isActive);
    onEditOpen();
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    onDeleteOpen();
  };

  const saveUser = async () => {
    if (!selectedUser) return;
    setSaving(true);
    
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedUser.id,
          role: editRole,
          isActive: editActive,
        }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        onEditClose();
        fetchUsers();
      } else {
        alert(data.error || 'Ошибка при сохранении');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Ошибка при сохранении');
    } finally {
      setSaving(false);
    }
  };

  const deleteUser = async () => {
    if (!selectedUser) return;
    setSaving(true);
    
    try {
      const res = await fetch(`/api/admin/users?id=${selectedUser.id}`, {
        method: 'DELETE',
      });
      
      const data = await res.json();
      
      if (data.success) {
        onDeleteClose();
        fetchUsers();
      } else {
        alert(data.error || 'Ошибка при удалении');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Ошибка при удалении');
    } finally {
      setSaving(false);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'text-red-600 bg-red-50';
      case 'MODERATOR': return 'text-orange-600 bg-orange-50';
      case 'AUTHOR': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (status === 'loading' || loading && users.length === 0) {
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
              <h1 className="text-2xl font-bold" style={{ color: '#264653' }}>Управление пользователями</h1>
              <p className="text-sm" style={{ color: '#6C757D' }}>Всего: {pagination.total} пользователей</p>
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
                placeholder="Поиск по email или никнейму..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                startContent={<Search className="w-4 h-4" />}
              />
            </div>
            <div className="w-[200px]">
              <select
                className="w-full px-3 py-2 rounded-lg border bg-white"
                style={{ borderColor: '#E8E4DE', color: '#264653' }}
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  setPagination(prev => ({ ...prev, page: 1 }));
                }}
              >
                <option value="">Все роли</option>
                {ROLES.map((role) => (
                  <option key={role.key} value={role.key}>{role.label}</option>
                ))}
              </select>
            </div>
            <Button type="submit" style={{ backgroundColor: '#2A9D8F', color: 'white' }}>
              Поиск
            </Button>
          </form>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl overflow-hidden" style={{ border: '1px solid #E8E4DE' }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: '#F8F6F3' }}>
                  <th className="text-left p-4 font-medium" style={{ color: '#264653' }}>Пользователь</th>
                  <th className="text-left p-4 font-medium" style={{ color: '#264653' }}>Роль</th>
                  <th className="text-left p-4 font-medium" style={{ color: '#264653' }}>Статус</th>
                  <th className="text-left p-4 font-medium" style={{ color: '#264653' }}>Контент</th>
                  <th className="text-left p-4 font-medium" style={{ color: '#264653' }}>Дата регистрации</th>
                  <th className="text-right p-4 font-medium" style={{ color: '#264653' }}>Действия</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-t" style={{ borderColor: '#E8E4DE' }}>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {user.profile?.avatarUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={user.profile.avatarUrl} alt="" className="w-10 h-10 rounded-full" />
                        ) : (
                          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: '#457B9D' }}>
                            {user.profile?.displayName?.charAt(0) || user.email.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="font-medium" style={{ color: '#264653' }}>{user.profile?.displayName || 'Без имени'}</p>
                          <p className="text-sm" style={{ color: '#6C757D' }}>{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                        {ROLES.find(r => r.key === user.role)?.label || user.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.isActive ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
                        {user.isActive ? 'Активен' : 'Заблокирован'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span style={{ color: '#6C757D' }}>{user.profile?._count?.content || 0} / {user.profile?._count?.comments || 0}</span>
                    </td>
                    <td className="p-4">
                      <span style={{ color: '#6C757D' }}>
                        {new Date(user.createdAt).toLocaleDateString('ru-RU')}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          onPress={() => handleEdit(user)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          className="text-red-500"
                          onPress={() => handleDelete(user)}
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
        {pagination.pages > 1 && (
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
              Страница {pagination.page} из {pagination.pages}
            </span>
            <Button
              isIconOnly
              size="sm"
              variant="flat"
              isDisabled={pagination.page >= pagination.pages}
              onPress={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <Modal isOpen={isEditOpen} onClose={onEditClose}>
        <ModalContent>
          <ModalHeader>Редактирование пользователя</ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#264653' }}>Роль</label>
                <select
                  className="w-full px-3 py-2 rounded-lg border"
                  style={{ borderColor: '#E8E4DE', color: '#264653' }}
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                >
                  {ROLES.map((role) => (
                    <option key={role.key} value={role.key}>{role.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editActive}
                    onChange={(e) => setEditActive(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm" style={{ color: '#264653' }}>Активный аккаунт</span>
                </label>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={onEditClose}>Отмена</Button>
            <Button
              style={{ backgroundColor: '#2A9D8F', color: 'white' }}
              isLoading={saving}
              onPress={saveUser}
            >
              Сохранить
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
        <ModalContent>
          <ModalHeader>Удаление пользователя</ModalHeader>
          <ModalBody>
            <p>Вы уверены, что хотите удалить пользователя <strong>{selectedUser?.profile?.displayName || selectedUser?.email}</strong>?</p>
            <p className="text-sm mt-2" style={{ color: '#6C757D' }}>Это действие нельзя отменить.</p>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={onDeleteClose}>Отмена</Button>
            <Button
              color="danger"
              isLoading={saving}
              onPress={deleteUser}
            >
              Удалить
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
