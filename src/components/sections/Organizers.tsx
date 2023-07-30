import { DBOrganizersKey, OrganizerObject } from '../interfaces/dbInterfaces';
import { SectionProps } from '../interfaces/sectionInterfaces';

export function OneOrganizer({ organizer }: { organizer: OrganizerObject }): JSX.Element {
   return <img className="organizer-logo" src={organizer?.logo} />;
}

export function OrganizersComponent(props: SectionProps): JSX.Element {
   const { data, adminEditor } = props;
   const { sectionName, sectionID, sectionOrder, createdAt, updatedAt } = data;
   const content = data.content as DBOrganizersKey;
   const organizers = content.items;
   const title = content.title;

   if (organizers && Object.keys(organizers).length > 0) {
      let arrayOfOrganizers: JSX.Element[] = [];
      for (let organizer of Object.keys(organizers)) {
         let organizerObject: OrganizerObject = organizers[organizer];
         arrayOfOrganizers.push(<OneOrganizer organizer={organizerObject} />);
      }

      return (
         <>
            <h1>{title}</h1>
            <div className="sponsor-logos-row">{arrayOfOrganizers}</div>
         </>
      );
   } else {
      return <></>;
   }
}
