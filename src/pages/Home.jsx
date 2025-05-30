import Footer from '../components/Footer';
import Header from '../components/Header';
import ServicesSection from '../components/ServicesSection';
import { useTranslation } from 'react-i18next';

export default function Home() {
  const { t } = useTranslation();

  return (
    <>
      <Header />
      <main className="">
        {/* Hero section remains unchanged */}
        <section className="h-screen bg-cover bg-center flex items-center justify-center text-white"
          style={{ backgroundImage: 'url(https://www.eg-software.com/assets/img/best_recipe_management_software_for_professional_chefs-min.webp)' }}>
          {/* <div className="bg-black bg-opacity-50 p-10 rounded">
            <h1 className="text-4xl font-bold mb-4">{t('hero_title')}</h1>
            <p className="text-lg">{t('hero_subtitle')}</p>
          </div> */}
        </section>

        <ServicesSection />
      </main>
      <Footer />
    </>
  );
}
