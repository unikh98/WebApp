import { FaWhatsapp } from 'react-icons/fa';
import './WhatsAppFloatingButton.css';

function WhatsAppFloatingButton() {
  const phoneNumber = '919972706169'; 
  return (
    <a
      href={`https://wa.me/${phoneNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
    >
      <FaWhatsapp className="whatsapp-icon" />
    </a>
  );
}

export default WhatsAppFloatingButton;
