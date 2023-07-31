import { SectionContent, SectionProps, SectionTypes } from '../interfaces/sectionInterfaces';
import { DBSpeaker, DBSpeakersKey } from '../interfaces/dbInterfaces';
import { EditorOfImage, NewImgBoxFileUpload } from '../smallComponents/FileUploads';
import { EditText, SaveTextsButton, handleStateTextChange } from '../smallComponents/TextEdits';
import { useState } from 'react';

export function SpeakersComponent(props: SectionProps): JSX.Element {
   const { data, adminEditor } = props;
   const { sectionName, sectionID, sectionOrder } = data;
   const DBSpeakers = props.data.content as DBSpeakersKey;
   const [title, setTitle] = useState(DBSpeakers.title);

   console.log(Object.values(DBSpeakers));
   if (DBSpeakers && Object.keys(DBSpeakers).length > 0 && DBSpeakers.items) {
      let items = DBSpeakers.items;
      let arrayOfSpeakers: JSX.Element[] = [];
      Object.values(items).forEach((speaker, i) => {
         arrayOfSpeakers.push(
            <OneSpeaker
               sectionID={sectionID}
               sectionName={sectionName}
               adminEditor={adminEditor}
               speaker={speaker}
               key={i}
            />
         );
      });
      return (
         <>
            {adminEditor ? (
               <>
                  <EditText
                     type={'header'}
                     initText={title ? title : ''}
                     onChange={(event: any) => handleStateTextChange(setTitle, event)}
                  />
                  <SaveTextsButton refBelowWebsiteID={`homepageContent/${sectionID}/content/`} data={{ title: title }} />
               </>
            ) : (
               <h1>{title}</h1>
            )}
            {arrayOfSpeakers}
            {adminEditor ? <NewImgBoxFileUpload sectionID={sectionID} cardOrderNr={0} sectionName={sectionName} /> : null}
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
      return <NewImgBoxFileUpload sectionID={sectionID} cardOrderNr={0} sectionName={sectionName} />;
   }
}
export function OneSpeaker({
   adminEditor,
   speaker,
   sectionID,
   sectionName,
}: {
   sectionID: string;
   sectionName: SectionTypes;
   adminEditor: boolean;
   speaker: DBSpeaker;
}): JSX.Element {
   const { image, id } = speaker;
   const [title, setTitle] = useState(speaker.title);
   const [titleDescription, setTitleDescription] = useState(speaker.titleDescription);
   const [fullName, setFullName] = useState(speaker.fullName);
   const [description, setDescription] = useState(speaker.description);
   const [pitch, setPitch] = useState(speaker.pitch);

   return (
      <div className="speaker">
         {adminEditor ? (
            <>
               <EditText
                  type={'header'}
                  initText={title}
                  onChange={(event: any) => handleStateTextChange(setTitle, event)}
               />
               <EditText
                  type={'description'}
                  initText={titleDescription}
                  onChange={(event: any) => handleStateTextChange(setTitleDescription, event)}
               />
               <SaveTextsButton
                  refBelowWebsiteID={`homepageContent/${sectionID}/content/items/${id}`}
                  data={{ title: title, titleDescription: titleDescription }}
               />
               <EditorOfImage sectionID={sectionID} cardOrderNr={0} sectionName={sectionName} image={image} />
               <EditText
                  type={'description'}
                  initText={fullName}
                  onChange={(event: any) => handleStateTextChange(setFullName, event)}
               />
               <EditText
                  type={'description'}
                  initText={description}
                  onChange={(event: any) => handleStateTextChange(setDescription, event)}
               />
               <EditText
                  type={'description'}
                  initText={pitch}
                  onChange={(event: any) => handleStateTextChange(setPitch, event)}
               />
               <SaveTextsButton
                  refBelowWebsiteID={`homepageContent/${sectionID}/content/items/${id}/`}
                  data={{ pitch: pitch, description: description, fullName: fullName }}
               />
            </>
         ) : (
            <>
               <h1 className="speaker-description">{title}</h1>
               <h2 className="speaker-description">{titleDescription}</h2>
               <img className="speaker-image" src={image} />
               <h2 className="speaker-description">{fullName}</h2>
               <h2 className="speaker-description">{description}</h2>
               <h2 className="speaker-description">{pitch}</h2>
            </>
         )}
      </div>
   );
}
