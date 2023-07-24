import { DBWebsiteOneParticipant, DBWebsiteParticipantKey } from "./utilsAndInterfaces/interfaces";

export function OneParticipant({ oneParticipant }: { oneParticipant: DBWebsiteOneParticipant }): JSX.Element {
    return (
        <>
            <div className="participant-box">
                <img className="participant-image" src={oneParticipant.image} />
                <h2>{oneParticipant.name}</h2>
                <h3>{oneParticipant.title} @ {oneParticipant.organization}</h3>
            </div>
        </>
    )
}
export function ParticipantComponent({ participants }: { participants: DBWebsiteParticipantKey }): JSX.Element {
    if (participants && Object.keys(participants).length > 0) {
        let allParticipants: JSX.Element[] = []
        for (let participant of Object.keys(participants)) {
            let participantObject = participants[participant]
            if (participantObject !== participants.title) {
                allParticipants.push(
                    <OneParticipant oneParticipant={participantObject as DBWebsiteOneParticipant} />
                )
            }
        }

        return (
            <>
                <h1>{participants?.title}</h1>
                <div className="wrapper-participants">
                    {allParticipants}
                </div>
            </>
        )
    } else {
        return (
            <></>
        )
    }
}