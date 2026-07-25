import { User } from '../models/User.js';
import { Resource } from '../models/Resource.js';
import { Category } from '../models/Category.js';
import { Setting } from '../models/Setting.js';

export const seedDatabase = async () => {
  try {
    // 1. Seed Users Collection
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      await User.create([
        { name: 'Admin', email: 'admin@dstack.com', password: '12345678', role: 'Administrador', status: 1 },
        { name: 'Dev User', email: 'dev@dstack.com', password: '12345678', role: 'Desarrollador', status: 1 },
      ]);
      console.log('🌱 Seeded collection: Users (2 records)');
    }

    // 2. Seed Categories Collection
    const categoryCount = await Category.countDocuments();
    if (categoryCount === 0) {
      await Category.create([
        { name: 'Backend', description: 'Servicios de servidor Express', status: 1 },
        { name: 'Frontend', description: 'Interfaz React con Vite', status: 1 },
        { name: 'Base de Datos', description: 'Modelos MongoDB Mongoose', status: 1 },
        { name: 'Seguridad', description: 'Zod y Helmet', status: 1 },
      ]);
      console.log('🌱 Seeded collection: Categories (4 records)');
    }

    // 3. Seed Resources Collection (CRUD items with Currency Data)
    const resourceCount = await Resource.countDocuments();
    if (resourceCount === 0) {
      await Resource.create([
        { code: 'REC-001', name: 'Servidor Principal API', category: 'Backend', price: 1250.50, currency: 'USD', status: 1, date: '2026-07-24' },
        { code: 'REC-002', name: 'Cliente Fluent REST', category: 'Frontend', price: 499.00, currency: 'USD', status: 1, date: '2026-07-24' },
        { code: 'REC-003', name: 'Esquema de Validación Zod', category: 'Seguridad', price: 150.00, currency: 'USD', status: 1, date: '2026-07-23' },
        { code: 'REC-004', name: 'Plugin Mongoose SoftDelete', category: 'Base de Datos', price: 24900.00, currency: 'MXN', status: 0, date: '2026-07-22' },
      ]);
      console.log('🌱 Seeded collection: Resources with Currency Data (4 records)');
    }

    // 4. Seed Settings Collection
    const settingCount = await Setting.countDocuments();
    if (settingCount === 0) {
      await Setting.create([
        { key: 'app_name', value: 'D-Stack Monolith', description: 'Nombre de la aplicación' },
        { key: 'rest_client', value: 'fluent-rest-client', description: 'Librería cliente REST' },
        { key: 'datatable_engine', value: 'react-apextable-pro', description: 'Librería de tablas de datos' },
        { key: 'currency_helper', value: 'intl-currency-helper', description: 'Librería formateadora de moneda Intl' },
      ]);
      console.log('🌱 Seeded collection: Settings (4 records)');
    }
  } catch (err) {
    console.error('⚠️ Database Seeding Warning:', err);
  }
};
