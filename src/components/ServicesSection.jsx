import React from 'react';
import { motion } from 'framer-motion';
import { FaCogs, FaClipboardList, FaChartBar, FaUtensils } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const services = [
  {
    icon: <FaCogs className="text-4xl text-blue-500" />,
    titleKey: 'service_systems',
    descKey: 'service_systems_desc'
  },
  {
    icon: <FaClipboardList className="text-4xl text-blue-500" />,
    titleKey: 'service_inventory',
    descKey: 'service_inventory_desc'
  },
  {
    icon: <FaUtensils className="text-4xl text-blue-500" />,
    titleKey: 'service_menu',
    descKey: 'service_menu_desc'
  },
  {
    icon: <FaChartBar className="text-4xl text-blue-500" />,
    titleKey: 'service_reports',
    descKey: 'service_reports_desc'
  }
];

export default function ServicesSection() {
  const { t } = useTranslation();

  return (
    <section id="services" className="py-20 bg-gray-100">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-6">{t('our_services')}</h2>
        <p className="text-gray-600 mb-12">{t('services_subtitle')}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              className="bg-white rounded shadow-md p-6 hover:shadow-lg"
            >
              <div className="mb-4 flex justify-center">{service.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{t(service.titleKey)}</h3>
              <p className="text-gray-600 text-sm">{t(service.descKey)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
