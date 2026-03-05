import { useState } from "react";

type HelpSection = {
  id: string;
  value: string;
  keywords: string[];
};

export const useHelpSearch = (sections: HelpSection[]) => {
  const [openSections, setOpenSections] = useState<string[]>([]);

  const search = (query: string) => {
    const lower = query.toLowerCase();

    const match = sections.find(section =>
      section.keywords.some(k => lower.includes(k))
    );

    if (!match) return;

    setOpenSections(prev =>
      prev.includes(match.value) ? prev : [...prev, match.value]
    );

    setTimeout(() => {
      document
        .getElementById(match.id)
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
    }, 120);
  };

  return {
    openSections,
    setOpenSections,
    search
  };
};