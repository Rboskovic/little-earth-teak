import {useState, useEffect} from 'react';
import {Truck, Package} from 'lucide-react';

const messages = [
  {
    icon: Truck,
    text: 'FREE DELIVERY ON ORDERS OVER $50',
  },
  {
    icon: Package,
    text: 'ORDER SHIPPED SAME DAY FROM US WAREHOUSE',
  },
];

export function CarouselMessage() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % messages.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const CurrentIcon = messages[currentIndex].icon;

  return (
    <div className="carousel-message">
      <div className="carousel-message-content">
        <CurrentIcon className="carousel-message-icon" size={20} />
        <span className="carousel-message-text">{messages[currentIndex].text}</span>
      </div>
    </div>
  );
}