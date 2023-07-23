import { DBWebsiteSpeaker, DBWebsiteSpeakersKey } from "./utilsAndInterfaces/interfaces"

export function SpeakersComponent({ DBSpeakers }: { DBSpeakers: DBWebsiteSpeakersKey }): JSX.Element {
    if (DBSpeakers && Object.keys(DBSpeakers).length > 0) {
        const allSpeakers: JSX.Element[] = []
        for (let speaker of Object.keys(DBSpeakers)) {
            let speakerObject = DBSpeakers[speaker]
            allSpeakers.push(
                <OneSpeaker speaker={speakerObject} />
            )
        }
        return (
            <>{allSpeakers}</>

        )
    } else {
        return (
            <></>
        )
    }
}
export function OneSpeaker({ speaker }: { speaker: DBWebsiteSpeaker }): JSX.Element {
    return (
        <div className="speaker">
            <h1 className="speaker-description">{speaker?.speakerTitle}</h1>
            <h2 className="speaker-description">{speaker?.speakerTitleDescription}</h2>

            <img className="visningsbild-talare" src={speaker?.speakerImage} />
            <br></br>
            <h1 className="speaker-description">{speaker?.speakerName}</h1>
            <h2 className="speaker-description">{speaker?.speakerDescription}</h2>
            <h3 className="speaker-description">{speaker?.speakerPitch}</h3>
        </div>

    )
}