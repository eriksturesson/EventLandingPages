import { SectionContent } from '../interfaces/sectionInterfaces';

export function normalizeOrders(data: SectionContent[]): SectionContent[] {
   if (!data || data.length === 0) return [];

   // Sortera först: om två har samma order, använd sectionID för stabil sortering
   const sorted = [...data].sort((a, b) => {
      const aOrder = typeof a.sectionOrder === 'number' && !isNaN(a.sectionOrder) ? a.sectionOrder : 0;
      const bOrder = typeof b.sectionOrder === 'number' && !isNaN(b.sectionOrder) ? b.sectionOrder : 0;

      const diff = aOrder - bOrder;
      if (diff !== 0) return diff;

      // Om samma order → använd sectionID för deterministisk sortering
      return a.sectionID.localeCompare(b.sectionID);
   });

   // Tilldela nya ordningar (1, 2, 3, ...)
   return sorted.map((section, index) => ({
      ...section,
      sectionOrder: index + 1,
   }));
}
