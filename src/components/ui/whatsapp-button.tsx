import { FaWhatsapp } from 'react-icons/fa';
import { useContact } from '@/hooks/use-contact';

export function WhatsAppButton() {
  const { contactInfo } = useContact();

  if (!contactInfo) return null;

  const handleClick = () => {
    const whatsappUrl = `https://wa.me/${contactInfo.phone.replace(/\D/g, '')}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-colors duration-300 hover:scale-110 transform"
      aria-label="WhatsApp ile İletişime Geç"
    >
      <FaWhatsapp size={24} />
    </button>
  );
}