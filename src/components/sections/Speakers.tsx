import { SectionContent, SectionProps } from '../utils/sectionInterfaces';
import { DBSpeaker, DBSpeakersKey } from '../interfaces/dbInterfaces';

export function SpeakersComponent(props: SectionProps): JSX.Element {
   const DBSpeakers = props.data.content as DBSpeakersKey;
   console.log(Object.values(DBSpeakers));
   if (DBSpeakers && Object.keys(DBSpeakers).length > 0) {
      return (
         <>
            {Object.values(DBSpeakers).map((speaker, i) => {
               return <OneSpeaker speaker={speaker} key={i} />;
            })}
         </>
      );
      // above is refactoring of below in order to add a key prop to each OneSpeaker component
      /*       const allSpeakers: JSX.Element[] = [];
      for (let speaker of Object.keys(DBSpeakers)) {
         let speakerObject = DBSpeakers[speaker];
         allSpeakers.push(<OneSpeaker speaker={speakerObject} />);
      }
      return <>{allSpeakers}</>; */
   } else {
      return <></>;
   }
}
export function OneSpeaker({ speaker }: { speaker: DBSpeaker }): JSX.Element {
   return (
      <div className="speaker">
         <h1 className="speaker-description">{speaker?.speakerTitle}</h1>
         <h2 className="speaker-description">{speaker?.speakerTitleDescription}</h2>

         <img className="speaker-image" src={speaker?.speakerImage} />
         <br></br>
         <h1 className="speaker-description">{speaker?.speakerName}</h1>
         <h2 className="speaker-description">{speaker?.speakerDescription}</h2>
         <h3 className="speaker-description">{speaker?.speakerPitch}</h3>
      </div>
   );
}
