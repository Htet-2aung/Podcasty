import React from 'react';
import { Link } from 'react-router-dom';
import { Category } from '../lib/categories';

interface CategoryCardProps {
  category: Category;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    <Link
      to={`/category/${category.id}`}
      className={`relative flex items-end p-4 h-28 rounded-lg shadow-lg overflow-hidden
                  bg-gradient-to-r ${category.color} 
                  text-white font-bold text-xl 
                  hover:scale-105 transform transition-transform duration-300`}
    >
      <span>{category.name}</span>
    </Link>
  );
};


export default CategoryCard;
