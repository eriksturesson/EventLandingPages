import { EventSchedule } from "./utilsAndInterfaces/interfaces";

export function ScheduleComponent({ schedule }: { schedule: EventSchedule }): JSX.Element {
    if (schedule && Object.keys(schedule).length > 0) {
        let arrayOfSchedule = []
        for (let eachTime of Object.keys(schedule)) {
            if (eachTime !== schedule.scheduleName) arrayOfSchedule.push(<h3>{schedule[eachTime]}</h3>)
        }
        return (
            <div className="schedule-box">
                <h1>{schedule?.scheduleName}</h1>
                <div className="schedule">
                    {arrayOfSchedule && arrayOfSchedule.length > 0 ? arrayOfSchedule :
                        <>
                            <h3><strong>18.00</strong> - Insläpp och fördrink</h3>
                            <h3><strong>18.30</strong> - Mingelmat och nätverkande</h3>
                            <h3><strong>19.00</strong> - Välkomna önskar QRIOS och Student Node</h3>
                            <h3><strong>19.05</strong> - Föreläsning</h3>
                            <h3><strong>19.30</strong> - Fortsatt mingel och kontaktskapande</h3>
                            <h3><strong>21.00</strong> - Kvällen avrundas</h3>
                        </>
                    }
                </div>
            </div>

        )
    } else {
        //Hardcoded
        return (
            <div className="schedule-box">
                <h1>Kvällens upplägg</h1>
                <div className="schedule">
                    <>
                        <h3><strong>18.00</strong> - Insläpp och fördrink</h3>
                        <h3><strong>18.30</strong> - Mingelmat och nätverkande</h3>
                        <h3><strong>19.00</strong> - Välkomna önskar QRIOS och Student Node</h3>
                        <h3><strong>19.05</strong> - Föreläsning</h3>
                        <h3><strong>19.30</strong> - Fortsatt mingel och kontaktskapande</h3>
                        <h3><strong>21.00</strong> - Kvällen avrundas</h3>
                    </>

                </div>
            </div>
        )
    }
}