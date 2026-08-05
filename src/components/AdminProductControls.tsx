// src/components/AdminProductControls.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { 
  FiEdit2, 
  FiEye, 
  FiEyeOff, 
  FiX, 
  FiSave, 
  FiTrash2,
  FiImage,
  FiTag,
  FiPackage,
  FiInfo,
  FiDollarSign,
  FiHash,
  FiAlertCircle
} from 'react-icons/fi';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

interface Category {
  id: number;
  cat_name: string;
  cat_priority: number;
}

interface AdminProductControlsProps {
  productId: number;
  currentData: {
    title: string;
    cat_name?: string;
    category_id?: number;
    price: number;
    oldPrice: number;
    type: string;
    description: string;
    image: string;
    quantity: number;
    ingredients: string;
    hide: number;
    isNew: number;
  };
  onUpdate: (updatedData: any) => void;
}

// ===== ФУНКЦИЯ ДЛЯ ПОЛУЧЕНИЯ БАЗОВОГО URL =====
const getApiBaseUrl = () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
  return baseUrl.replace(/\/api$/, '');
};

// ===== КОМПОНЕНТ ПОЛЯ ВВОДА ЧИСЛА =====
interface NumberInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  required?: boolean;
  step?: string;
  min?: number;
  placeholder?: string;
  disabled?: boolean;
}

const NumberInput: React.FC<NumberInputProps> = ({
  label,
  value,
  onChange,
  required = false,
  step = "1",
  min = 0,
  placeholder = "0",
  disabled = false,
}) => {
  const [displayValue, setDisplayValue] = useState<string>(value?.toString() || '');

  // Обновляем отображаемое значение при изменении пропса
  useEffect(() => {
    setDisplayValue(value?.toString() || '');
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    setDisplayValue(rawValue);

    // Если поле пустое - устанавливаем 0
    if (rawValue === '') {
      onChange(0);
      return;
    }

    // Удаляем ведущие нули
    let cleanValue = rawValue.replace(/^0+/, '');
    if (cleanValue === '') {
      cleanValue = '0';
    }

    const numValue = Number(cleanValue);
    if (!isNaN(numValue) && numValue >= min) {
      onChange(numValue);
    }
  };

  const handleBlur = () => {
    // При потере фокуса форматируем значение
    if (displayValue === '' || displayValue === '0' || displayValue === '-') {
      setDisplayValue('0');
      onChange(0);
      return;
    }

    const numValue = Number(displayValue);
    if (!isNaN(numValue) && numValue >= min) {
      setDisplayValue(numValue.toString());
      onChange(numValue);
    } else {
      setDisplayValue('0');
      onChange(0);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type="text"
        inputMode="decimal"
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
      />
    </div>
  );
};

const AdminProductControls: React.FC<AdminProductControlsProps> = ({ 
  productId, 
  currentData, 
  onUpdate 
}) => {
  const { admin } = useAdminAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isVisible, setIsVisible] = useState(currentData.hide !== 1);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: currentData.title || '',
    category_id: currentData.category_id || 0,
    price: currentData.price || 0,
    oldPrice: currentData.oldPrice || 0,
    type: currentData.type || '',
    description: currentData.description || '',
    image: currentData.image || '',
    quantity: currentData.quantity || 0,
    ingredients: currentData.ingredients || '',
    hide: currentData.hide || 0,
    isNew: currentData.isNew || 0,
  });

  // Загружаем категории
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const baseUrl = getApiBaseUrl();
        const response = await fetch(`${baseUrl}/api/categories`);
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Если не админ - не показываем
  if (!admin) return null;

  // Переключение видимости
  const toggleVisibility = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const baseUrl = getApiBaseUrl();
      const response = await fetch(`${baseUrl}/api/products/${productId}/hide`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ hide: isVisible ? 1 : 0 }),
      });

      if (response.ok) {
        const newVisibility = !isVisible;
        setIsVisible(newVisibility);
        toast.success(newVisibility ? 'Товар показан' : 'Товар скрыт');
        onUpdate({ ...currentData, hide: newVisibility ? 0 : 1 });
      } else {
        toast.error('Ошибка изменения видимости');
      }
    } catch (error) {
      console.error('Error toggling visibility:', error);
      toast.error('Ошибка изменения видимости');
    }
  };

  // Сохранение изменений
  const handleSave = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      
      // Валидация
      if (!formData.title.trim()) {
        toast.error('Название товара обязательно');
        setLoading(false);
        return;
      }

      if (formData.price < 0) {
        toast.error('Цена не может быть отрицательной');
        setLoading(false);
        return;
      }

      if (formData.quantity < 0) {
        toast.error('Количество не может быть отрицательным');
        setLoading(false);
        return;
      }

      const baseUrl = getApiBaseUrl();
      const response = await fetch(`${baseUrl}/api/admin/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success('Товар успешно обновлен');
        setIsEditing(false);
        onUpdate(data.product);
      } else {
        const error = await response.json();
        toast.error(error.message || 'Ошибка обновления товара');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Ошибка обновления товара');
    } finally {
      setLoading(false);
    }
  };

  // Удаление товара
  const handleDelete = async () => {
    if (!confirm('Вы уверены, что хотите удалить этот товар?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const baseUrl = getApiBaseUrl();
      const response = await fetch(`${baseUrl}/api/admin/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success('Товар удален');
        window.location.href = '/';
      } else {
        toast.error('Ошибка удаления товара');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Ошибка удаления товара');
    }
  };

  // Обработчики для числовых полей
  const handleNumberChange = (field: keyof typeof formData, value: number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="mb-4">
      {/* Кнопки управления */}
      <div className="flex flex-wrap items-center gap-2 p-3 bg-white rounded-xl shadow-sm border border-gray-200">
        <span className="text-sm font-medium text-gray-500 mr-2">Админ:</span>
        
        <button
          onClick={toggleVisibility}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
            isVisible
              ? 'bg-green-50 text-green-600 hover:bg-green-100'
              : 'bg-red-50 text-red-600 hover:bg-red-100'
          }`}
        >
          {isVisible ? <FiEye className="w-4 h-4" /> : <FiEyeOff className="w-4 h-4" />}
          {isVisible ? 'Показан' : 'Скрыт'}
        </button>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-sm font-medium transition-all"
        >
          <FiEdit2 className="w-4 h-4" />
          Редактировать
        </button>

        <button
          onClick={handleDelete}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-medium transition-all"
        >
          <FiTrash2 className="w-4 h-4" />
          Удалить
        </button>
      </div>

      {/* Модальное окно редактирования */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsEditing(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Заголовок */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
                <h3 className="text-xl font-bold text-gray-800">Редактирование товара</h3>
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FiX className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Форма */}
              <div className="p-6 space-y-4">
                {/* Название */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Название *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                {/* Категория */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Категория
                  </label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value={0}>Без категории</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.cat_name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Цены - используем кастомный NumberInput */}
                <div className="grid grid-cols-2 gap-4">
                  <NumberInput
                    label="Цена"
                    value={formData.price}
                    onChange={(value) => handleNumberChange('price', value)}
                    required
                    step="0.01"
                    min={0}
                    placeholder="0.00"
                  />
                  <NumberInput
                    label="Старая цена"
                    value={formData.oldPrice}
                    onChange={(value) => handleNumberChange('oldPrice', value)}
                    step="0.01"
                    min={0}
                    placeholder="0.00"
                  />
                </div>

                {/* Тип и количество */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Тип
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value="">Выберите тип</option>
                      <option value="кг">кг</option>
                      <option value="гр">гр</option>
                      <option value="л">л</option>
                      <option value="мл">мл</option>
                      <option value="шт">шт</option>
                    </select>
                  </div>
                  <NumberInput
                    label="Количество"
                    value={formData.quantity}
                    onChange={(value) => handleNumberChange('quantity', value)}
                    min={0}
                    placeholder="0"
                  />
                </div>

                {/* Состав */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Состав
                  </label>
                  <input
                    type="text"
                    value={formData.ingredients}
                    onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Состав продукта"
                  />
                </div>

                {/* Описание */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Описание
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                    placeholder="Описание товара"
                  />
                </div>

                {/* Новинка и видимость */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Новинка
                    </label>
                    <select
                      value={formData.isNew}
                      onChange={(e) => setFormData({ ...formData, isNew: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value={0}>Нет</option>
                      <option value={1}>Да</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Видимость
                    </label>
                    <select
                      value={formData.hide}
                      onChange={(e) => setFormData({ ...formData, hide: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                      <option value={0}>Показан</option>
                      <option value={1}>Скрыт</option>
                    </select>
                  </div>
                </div>

                {/* Фото */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Фото (имя файла)
                  </label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="image_name.webp"
                  />
                </div>

                {/* Кнопки */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-xl transition-colors disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                    ) : (
                      <>
                        <FiSave className="w-4 h-4" />
                        Сохранить
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-xl transition-colors"
                  >
                    Отмена
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminProductControls;