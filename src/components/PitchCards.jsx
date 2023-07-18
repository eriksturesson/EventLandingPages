import visningsbild1 from '../assets/DSC01125.JPG';
import visningsbild2 from '../assets/DSC01286.JPG';
import visningsbild3 from '../assets/DSC02755.JPG';
import { useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
export function PitchCardsComponent({ pitchCards, adminEdit }) {
    const [adminEditor, setadminEditor] = useState(adminEdit);
    let pitchCardsContent = [];
    // Sort the pitchCards array based on the "order" property
    if (pitchCards) {
        pitchCards.sort((a, b) => a.order - b.order);
        for (let i = 0; i < pitchCards.length; i++) {
            pitchCardsContent.push(<div className="eriks-container" id={"pitchOrder" + pitchCards[i].order}>
                    <div className="erik-1rem">
                        <img className="visningsbilder" alt="visningsbild1" src={pitchCards[i].image}/>
                        {adminEditor ? <PitchCardFileUpload /> : null}
                        {adminEditor ? <EditPitchardTitle initText={pitchCards[i].title}/> : <h1>{pitchCards[i].title}</h1>}
                        {adminEditor ? <EditPitchardDescription initText={pitchCards[i].description}/> : <p>{pitchCards[i].description}</p>}
                        {adminEditor ? <SaveTextsButton /> : null}
                    </div>
                </div>);
        }
        return (<Box className="wrapperOfImagesWithPitch">
                {pitchCardsContent}
            </Box>);
    }
    else {
        return (<Box className="wrapperOfImagesWithPitch">
                <div className="eriks-container">
                    <div className="erik-1rem">
                        <img className="visningsbilder" src={visningsbild1}/>
                        {adminEditor ? <PitchCardFileUpload /> : null}
                        {adminEditor ? <EditPitchardTitle initText={"About Rotary"}/> : <h1>About Rotary</h1>}
                        {adminEditor ? <EditPitchardDescription initText={"Rotary is a global network of 1.2 million neighbors, friends, leaders, and problem-solvers who see a world where people unite and take action to create lasting change – across the globe, in our communities, and in ourselves. Solving real problems takes real commitment and vision. For more than 110 years, Rotary's people of action have used their passion, energy, and intelligence to take action on sustainable projects. From literacy and peace to water and health, we are always working to better our world, and we stay committed to the end. Read more at <a href='https://www.rotary.org/en'>Rotary.org</a>."}/> : <><p>Rotary is a global network of 1.2 million neighbors, friends, leaders, and problem-solvers who see a world where people unite and take action to create lasting change – across the globe, in our communities, and in ourselves.</p> <p>Solving real problems takes real commitment and vision. For more than 110 years, Rotary's people of action have used their passion, energy, and intelligence to take action on sustainable projects. From literacy and peace to water and health, we are always working to better our world, and we stay committed to the end.</p> <p>Read more at <a href="https://www.rotary.org/en">Rotary.org</a>.</p></>}
                        {adminEditor ? <SaveTextsButton /> : null}
                    </div>
                </div>
                <div className="eriks-container">
                    <div className="erik-1rem">
                        <img className="visningsbilder" src={visningsbild2}/>
                        {adminEditor ? <PitchCardFileUpload /> : null}
                        {adminEditor ? <EditPitchardTitle initText={"Stockholm City Affärsnätverk"}/> : <h1>Stockholm City Affärsnätverk</h1>}
                        {adminEditor ? <EditPitchardDescription initText={"Rotaryklubbar består av Rotarianer som träffas generellt en gång i veckan för ett frukost-, lunch- eller middagsmöte. Affärsnätverket i Stockholm City är ett samarbete där 10 olika klubbar gått samman för att träffas med ett större fokus på att främja nätverket som finns för att hjälpa dagens yrkesverksamma att lyckas i karriären genom goda värderingar och värdefulla kontakter. Vi inspirerar, utbildar och uppdaterar också våra Rotarianer med spännande föreläsare i samband med lunchträffarna."}/> : <><p>Rotaryklubbar består av Rotarianer som träffas generellt en gång i veckan för ett frukost-, lunch- eller middagsmöte. Affärsnätverket i Stockholm City är ett samarbete där 10 olika klubbar gått samman för att träffas med ett större fokus på att främja nätverket som finns för att hjälpa dagens yrkesverksamma att lyckas i karriären genom goda värderingar och värdefulla kontakter. Vi inspirerar, utbildar och uppdaterar också våra Rotarianer med spännande föreläsare i samband med lunchträffarna.</p></>}
                        {adminEditor ? <SaveTextsButton /> : null}
                    </div>
                </div>

                <div className="eriks-container">
                    <div className="erik-1rem">
                        <img className="visningsbilder" src={visningsbild3}/>
                        {adminEditor ? <PitchCardFileUpload /> : null}
                        {adminEditor ? <EditPitchardTitle initText={"Hur går jag med i Rotary?"}/> : <h1>Hur går jag med i Rotary?</h1>}
                        {adminEditor ? <EditPitchardDescription initText={"När du följt med som gäst några gånger till en kontakt som bjudit in dig kanske du börjar fundera på om du vill gå med i Rotary? Då får du gärna besöka olika Rotaryklubbar, förslagsvis någon av oss 10 som arrangerar detta affärsnätverk. Man blir medlem genom att skicka in en ansökan till klubben man vill gå med i men man måste även i varje klubb vara gäst för att få komma. Det rekommenderas att man går flera gånger som gäst på samma klubb så att Rotarianerna får en bra känsla av vem gästen är innan en ansökan inkommer. Annars finns risk att det blir avslag på ansökan."}/> : <><p>När du följt med som gäst några gånger till en kontakt som bjudit in dig kanske du börjar fundera på om du vill gå med i Rotary? Då får du gärna besöka olika Rotaryklubbar, förslagsvis någon av oss 10 som arrangerar detta affärsnätverk. Man blir medlem genom att skicka in en ansökan till klubben man vill gå med i men man måste även i varje klubb vara gäst för att få komma. Det rekommenderas att man går flera gånger som gäst på samma klubb så att Rotarianerna får en bra känsla av vem gästen är innan en ansökan inkommer. Annars finns risk att det blir avslag på ansökan. </p></>}
                        {adminEditor ? <SaveTextsButton /> : null}
                    </div>
                </div>


            </Box>);
    }
}
export function PitchCardFileUpload() {
    return (<Box>
            <Button className="uploadImageButton" variant="contained" component="label">
                Upload new image
                <input hidden accept="image/*" multiple type="file"/>
            </Button>
        </Box>);
}
export function EditPitchardTitle({ initText }) {
    return (<Box style={{ paddingBottom: "2rem", width: "100%" }}>
            <TextField id="outlined-textarea" label="Header" placeholder="Placeholder" multiline defaultValue={initText} style={{ width: "100%" }} InputLabelProps={{ shrink: true }}/>
        </Box>);
}
export function EditPitchardDescription({ initText }) {
    return (<Box style={{ paddingBottom: "2rem", width: "100%" }}>
            <TextField id="outlined-multiline-static" label="Text content" multiline rows={10} defaultValue={initText} style={{ width: "100%" }} InputLabelProps={{ shrink: true }}/>
        </Box>);
}
export function SaveTextsButton() {
    return (<Box style={{ paddingBottom: "2rem", textAlign: "center", width: "100%" }}>
            <Button variant="contained" color="primary">
                Save texts
            </Button>
        </Box>);
}
