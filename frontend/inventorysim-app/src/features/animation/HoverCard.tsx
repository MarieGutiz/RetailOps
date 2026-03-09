import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

//Hove card for hero section

const HoverCard = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <Card className="rounded-2xl shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-6 space-y-2">
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default HoverCard;
