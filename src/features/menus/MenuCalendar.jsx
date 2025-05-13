import React from 'react';
import {
  FaDrumstickBite,
  FaLeaf,
  FaBreadSlice,
  FaMugHot,
  FaMapMarkerAlt,
} from 'react-icons/fa';

export default function MenuCalendar({ menus = [], ingredientsMap = {} }) {
  const groupedByDate = menus.reduce((acc, menu) => {
    if (!acc[menu.date]) acc[menu.date] = [];
    acc[menu.date].push(menu);
    return acc;
  }, {});

  const mealOrder = ['breakfast', 'lunch', 'snack', 'dinner'];
  const getName = (id) => ingredientsMap[id]?.name || id;

  return (
    <div className="space-y-6">
      {Object.entries(groupedByDate)
        .sort(([a], [b]) => new Date(a) - new Date(b))
        .map(([date, meals]) => (
          <div key={date} className="bg-white rounded-xl shadow p-4">
            <h2 className="text-lg font-bold text-gray-800 mb-3">
              {new Date(date).toDateString()}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mealOrder.map((type) => {
                const menu = meals.find((m) => m.mealType === type);
                if (!menu) return null;

                return (
                  <div key={type} className="border rounded-lg p-3">
                    <h3 className="text-md font-semibold capitalize mb-2 text-red-600">
                      {type}
                    </h3>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li className="flex items-center gap-2">
                        <FaDrumstickBite className="text-red-500" />
                        Protein: {getName(menu.protein)}
                      </li>
                      <li className="flex items-center gap-2">
                        <FaLeaf className="text-green-500" />
                        Sides: {menu.sides.map(getName).join(', ')}
                      </li>
                      <li className="flex items-center gap-2">
                        <FaBreadSlice className="text-yellow-600" />
                        Bread: {getName(menu.bread)}
                      </li>
                      <li className="flex items-center gap-2">
                        <FaMugHot className="text-purple-500" />
                        Beverage: {getName(menu.beverage)}
                      </li>
                      <li className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-gray-500" />
                        Base: {menu.base}
                      </li>
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
    </div>
  );
}
