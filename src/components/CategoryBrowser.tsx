// src/components/CategoryBrowser.tsx

import React from 'react';
import { categories } from '../lib/categories';
import CategoryCard from './CategoryCard';

const CategoryBrowser: React.FC = () => {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-4 text-text-main">Browse Categories</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </section>
  );
};

export default CategoryBrowser;