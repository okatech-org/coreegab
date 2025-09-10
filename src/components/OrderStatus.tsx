import { Badge } from "./ui/badge";
import { Order } from "@/types/database";

interface OrderStatusProps {
  status: Order['status'];
  className?: string;
}

interface StatusConfig {
  color: string;
  text: string;
  icon: string;
  variant: "default" | "secondary" | "destructive" | "outline";
}

const statusConfig: Record<Order['status'], StatusConfig> = {
  pending: { 
    color: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100', 
    text: 'En attente', 
    icon: '⏳',
    variant: 'outline'
  },
  confirmed: { 
    color: 'bg-primary/10 text-primary hover:bg-primary/10', 
    text: 'Confirmée', 
    icon: '✓',
    variant: 'default'
  },
  shipping: { 
    color: 'bg-purple-100 text-purple-800 hover:bg-purple-100', 
    text: 'En transit', 
    icon: '🚢',
    variant: 'secondary'
  },
  delivered: { 
    color: 'bg-secondary/10 text-secondary hover:bg-secondary/10', 
    text: 'Livrée', 
    icon: '📦',
    variant: 'default'
  }
};

export default function OrderStatus({ status, className }: OrderStatusProps) {
  const config = statusConfig[status];
  
  return (
    <Badge 
      variant={config.variant}
      className={`${config.color} ${className}`}
    >
      <span className="mr-1">{config.icon}</span>
      {config.text}
    </Badge>
  );
}