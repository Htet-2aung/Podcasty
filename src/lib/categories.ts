// src/lib/categories.ts

export interface Category {
  id: string;
  name: string;
  color: string; // For styling the cards
}

// A curated list of popular podcast genres and their official IDs.
export const categories: Category[] = [
  { id: '1310', name: 'Technology', color: 'from-blue-500 to-cyan-500' },
  { id: '1303', name: 'Comedy', color: 'from-yellow-500 to-orange-500' },
  { id: '1321', name: 'Society & Culture', color: 'from-purple-500 to-pink-500' },
  { id: '1309', name: 'News', color: 'from-red-500 to-rose-500' },
  { id: '1324', name: 'True Crime', color: 'from-gray-700 to-slate-800' },
  { id: '1304', name: 'Education', color: 'from-green-500 to-emerald-500' },
  { id: '1323', name: 'Health & Fitness', color: 'from-teal-500 to-emerald-400' },
  { id: '1301', name: 'Arts', color: 'from-indigo-500 to-violet-600' },
  { id: '1487', name: 'History', color: 'from-amber-700 to-orange-800' },
  { id: '1307', name: 'Music', color: 'from-pink-500 to-fuchsia-500' },
  { id: '1318', name: 'Business', color: 'from-sky-600 to-blue-700' },
  { id: '1315', name: 'Sports', color: 'from-lime-500 to-green-600' },
];