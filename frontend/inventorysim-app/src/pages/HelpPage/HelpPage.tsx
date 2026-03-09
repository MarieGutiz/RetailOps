import { Input } from '@/components/ui/Input';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { helpSections } from './utils/helpSections';
import { useHelpSearch } from './hooks/useHelpSearch';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

//The search page for the help center

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const HelpPage = () => {
  const queryParams = useQuery();
  const query = queryParams.get('query') || '';

  const { openSections, setOpenSections, search } = useHelpSearch(helpSections);

  // Run search on mount if query exists
  useEffect(() => {
    if (query) search(query);
  }, [query]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background px-6 py-16 flex justify-center">
      <div className="w-full max-w-5xl space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-3"
        >
          <h1 className="text-4xl font-bold tracking-tight">
            Help & Documentation
          </h1>

          <p className="text-muted-foreground max-w-xl mx-auto">
            Learn how to use the simulation modules, analytics, and reports
            inside the inventory simulator.
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Input
            placeholder="Search topics (EOQ, reports, analytics...)"
            onChange={(e) => search(e.target.value)}
            className="max-w-lg mx-auto bg-white"
          />
        </motion.div>

        {/* Accordion */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Accordion
            type="multiple"
            value={openSections}
            onValueChange={(v) => setOpenSections(v)}
          >
            {helpSections.map((section) => {
              const Icon = section.icon;

              return (
                <AccordionItem
                  key={section.value}
                  value={section.value}
                  id={section.id}
                >
                  <AccordionTrigger>
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4 text-muted-foreground" />

                      {section.title}
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="text-sm leading-relaxed">
                    {section.content}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </motion.div>
      </div>
    </div>
  );
};

export default HelpPage;
