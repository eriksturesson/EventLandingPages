import { DBOrganizersKey, OrganizerObject } from '../interfaces/dbInterfaces';
import { SectionProps } from '../interfaces/sectionInterfaces';
export function OneOrganizer({ organizer }: { organizer: OrganizerObject }): JSX.Element {
   return <img className="organizer-logo" src={organizer?.logo} />;
}

export function OrganizersComponent(props: SectionProps): JSX.Element {
   const { data, adminEditor } = props;
   const content = data.content as DBOrganizersKey | undefined;
   const organizers: DBOrganizersKey | undefined = content;

   if (organizers && Object.keys(organizers).length > 0) {
      let arrayOfOrganizers: JSX.Element[] = [];
      for (let organizer of Object.keys(organizers)) {
         let organizerObject: OrganizerObject = organizers[organizer];
         arrayOfOrganizers.push(<OneOrganizer organizer={organizerObject} key={Math.random()} /*temporary fix*/ />);
      }

      return (
         <>
            <div className="sponsor-logos-row">{arrayOfOrganizers}</div>
         </>
      );
   } else {
      return <></>;
   }
}
