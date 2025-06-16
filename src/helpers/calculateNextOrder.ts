import { SectionContent } from '../interfaces/sectionInterfaces';

export function calculateNextOrder(data: SectionContent[], currentOrder: number): number {
   const index = data.findIndex((s) => s.sectionOrder === currentOrder);
   const next = data[index + 1];

   if (next) {
      return (currentOrder + next.sectionOrder) / 2;
   } else {
      return currentOrder + 1; // Still allows appending
   }
}
