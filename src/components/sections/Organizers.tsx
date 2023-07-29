import { DBOrganizersKey, OrganizerObject } from '../interfaces/dbInterfaces';

export function OneOrganizer({ organizer }: { organizer: OrganizerObject }): JSX.Element {
   return <img className="organizer-logo" src={organizer?.logo} />;
}

export function OrganizersComponent({ organizers }: { organizers: DBOrganizersKey }): JSX.Element {
   if (organizers && Object.keys(organizers).length > 0) {
      let arrayOfOrganizers: JSX.Element[] = [];
      for (let organizer of Object.keys(organizers)) {
         if (organizer !== organizers.title) {
            let organizerObject = organizers[organizer];
            arrayOfOrganizers.push(<OneOrganizer organizer={organizerObject as OrganizerObject} />);
         }
      }

      return (
         <>
            <h1>{organizers?.title}</h1>
            <div className="sponsor-logos-row">{arrayOfOrganizers}</div>
         </>
      );
   } else {
      return <></>;
   }
}
