import { useState } from 'react';
import { DBSpeaker, DBSpeakersKey } from '../interfaces/dbInterfaces';
import { SectionProps, SectionTypes } from '../interfaces/sectionInterfaces';
import { EditorOfImage, NewImgBoxFileUpload } from '../smallComponents/FileUploads';
import { EditText, SaveTextsButton, handleStateTextChange } from '../smallComponents/TextEdits';

export function SpeakersComponent(props: SectionProps): JSX.Element {
   const { data, adminEditor } = props;
   const { sectionName, sectionID } = data;
   const DBSpeakers = data.content as DBSpeakersKey | undefined;
   if (DBSpeakers && Object.keys(DBSpeakers).length > 0) {
      let arrayOfSpeakers: JSX.Element[] = [];
      Object.values(DBSpeakers).forEach((speaker, i) => {
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
            {arrayOfSpeakers}
            {adminEditor ? <NewImgBoxFileUpload sectionID={sectionID} order={0} sectionName={sectionName} /> : null}
         </>
      );
   } else {
      return <NewImgBoxFileUpload sectionID={sectionID} order={0} sectionName={sectionName} />;
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
                  value={title ? title : ''}
                  onChange={(event: any) => handleStateTextChange(setTitle, event)}
               />
               <EditText
                  type={'description'}
                  value={titleDescription ? titleDescription : ''}
                  onChange={(event: any) => handleStateTextChange(setTitleDescription, event)}
               />
               <SaveTextsButton
                  refBelowWebsiteID={`homepageContent/${sectionID}/content/${id}`}
                  data={{ title: title, titleDescription: titleDescription }}
               />
               <EditorOfImage sectionID={sectionID} order={0} sectionName={sectionName} image={image} />
               <EditText
                  type={'description'}
                  value={fullName ? fullName : ''}
                  onChange={(event: any) => handleStateTextChange(setFullName, event)}
               />
               <EditText
                  type={'description'}
                  value={description ? description : ''}
                  onChange={(event: any) => handleStateTextChange(setDescription, event)}
               />
               <EditText
                  type={'description'}
                  value={pitch ? pitch : ''}
                  onChange={(event: any) => handleStateTextChange(setPitch, event)}
               />
               <SaveTextsButton
                  refBelowWebsiteID={`homepageContent/${sectionID}/content/${id}/`}
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
