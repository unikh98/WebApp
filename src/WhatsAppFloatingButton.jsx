import { FaWhatsapp } from 'react-icons/fa';
import './WhatsAppFloatingButton.css';

function WhatsAppFloatingButton() {
  const phoneNumber = '919972706169'; 
  const message = `Hi, I'm interested in renting a DSLR camera. Please provide more details.`;
  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
    >
      <FaWhatsapp className="whatsapp-icon" />
    </a>
  );
}

export default WhatsAppFloatingButton;
