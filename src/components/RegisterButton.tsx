import { Box, Button, Divider, FormControl, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent, TextField, ThemeProvider } from "@mui/material";
import { DBWebsiteHomePageContentButton } from "./utilsAndInterfaces/interfaces";
import SaveIcon from '@mui/icons-material/Save';
import { ReactNode, useEffect, useRef, useState } from "react";
import { onValue, ref, set, update } from "firebase/database";
import { db } from "./utilsAndInterfaces/firebase";
import { initialState } from "./Home";
import { readAndWriteToFirebase } from "./utilsAndInterfaces/firebaseFunctions";
import { valueToPercent } from "@mui/base";
import { eriksTheme } from "./myColorTheme";
export let customColor: string = ""
export function RegisterButtonComponent({ buttonContent }: { buttonContent: DBWebsiteHomePageContentButton }): JSX.Element {

    let formLink = buttonContent && buttonContent.formLink ? buttonContent.formLink : "https://9c831b73.sibforms.com/serve/MUIEAL41dyIw4oNTgGbL1IM7tpycWXBQTiZ3tUsgtJcTF3Eur522V2Zw98_DWJZ30w2O3z-WpTN7mutUIspI7JTSJ9dBrIy9b9ZVnGyrHURAzGyhNMS34JH6xhdUlyWNQpU2sVbE9-xcdpzV5vuZlYtMa_IJw7U_3L96rZkcyDUsfiW4umx_iAGXTAKLnMWWT6SGWiJTLVrrLzqx";
    let buttonText = buttonContent && buttonContent.buttonText ? buttonContent.buttonText : "Anmälan";
    let buttonInfo = buttonContent && buttonContent.buttonInfo ? buttonContent.buttonInfo : "Du måste vara Rotarian eller gäst till en Rotarian för att anmäla dig.";
    let buttonColor = buttonContent && buttonContent.buttonColor ? buttonContent.buttonColor : "green";
    if (buttonColor === "green") buttonColor = "success";
    else if (buttonColor === "red") buttonColor = "error";
    else if (buttonColor === "blue") buttonColor = "neutral";
    else {
        console.error("Error: buttonColor is not supported. It is: " + buttonColor);
    }
    return (
        <Box textAlign="center" className="knapp-sektion">
            <div className="rotaryknapp">
                <ThemeProvider theme={eriksTheme}>
                    <Button color={buttonColor as any} href={formLink} variant="contained">{buttonText}</Button>
                </ThemeProvider>
            </div>
            <p>{buttonInfo}</p>
        </Box>
    )
}


async function saveButtonDataToDB(homepageButtonContent: DBWebsiteHomePageContentButton, websiteID: string): Promise<string> {
    if (!homepageButtonContent.buttonColor) homepageButtonContent.buttonColor = initialState.button.buttonColor;
    await readAndWriteToFirebase({ method: "update", ref: `websites/${websiteID}/homepageContent/button/`, data: homepageButtonContent })
    return `homePageContentButton saved to database`
}

function handleButtonColorChange(event: SelectChangeEvent<string>, websiteID: ReactNode): void {
    update(ref(db, `websites/${websiteID}/homepageContent/button/`), { buttonColor: event.target.value });
}

export function EditRegisterButtonComponent({ buttonContent, websiteID }: { buttonContent: DBWebsiteHomePageContentButton, websiteID: string }): JSX.Element {
    // Create state variables for each input field

    const [homepageButtonContent, setHomepageButtonContent] = useState<DBWebsiteHomePageContentButton>(buttonContent);
    //const [formLink, setFormLink] = useState(homepageButtonContent && homepageButtonContent.formLink ? homepageButtonContent.formLink : initialState.button.formLink);
    /*
     const [buttonText, setButtonText] = useState(homepageButtonContent && homepageButtonContent.buttonText ? homepageButtonContent.buttonText : initialState.button.buttonText);
     const [buttonInfo, setButtonInfo] = useState(homepageButtonContent && homepageButtonContent.buttonInfo ? homepageButtonContent.buttonInfo : initialState.button.buttonInfo);
     const [buttonColor, setButtonColor] = useState(homepageButtonContent && homepageButtonContent.buttonColor ? homepageButtonContent.buttonColor : initialState.button.buttonColor);
     //let databaseContent = document.getElementByClassName('DBContent');
     useEffect(() => {
         // READ DATA WHEN UPDATED TO UPDATE INDEX.HTML PROGRAM CONTENT
         let readButtonContentFromDatabaseToIndex = ref(db, `websites/${websiteID}/homepageContent/button`);
         onValue(readButtonContentFromDatabaseToIndex, (snapshot) => {
             let buttonContentFromDB: DBWebsiteHomePageContentButton = snapshot.val() ? snapshot.val() : "";
             setHomepageButtonContent(buttonContentFromDB)
         });
     }, [homepageButtonContent]);
 */
    //const [buttonFormData, setButtonFormData] = useState({ formLink: formLink, buttonText: buttonText, buttonInfo: buttonInfo, buttonColor: buttonColor })

    useEffect(() => {
        // READ DATA WHEN UPDATED TO UPDATE INDEX.HTML PROGRAM CONTENT
        let readButtonContentFromDatabase = ref(db, `websites/${websiteID}/homepageContent/button/`);
        onValue(readButtonContentFromDatabase, (snapshot) => {
            let buttonContentFromDB: DBWebsiteHomePageContentButton = snapshot.val() ? snapshot.val() : "";
            setHomepageButtonContent(buttonContentFromDB)
        });
    }, []);


    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setHomepageButtonContent({
            ...homepageButtonContent,
            [event.target.name]: event.target.value
        });
    };

    const handleSelectChange = (event: SelectChangeEvent<HTMLSelectElement>) => {
        setHomepageButtonContent({
            ...homepageButtonContent,
            [event.target.name]: event.target.value as string
        });
    };

    return (
        <>
            <Divider>Botton preview</Divider>
            <RegisterButtonComponent buttonContent={buttonContent} />
            <Divider sx={{ padding: 4 }}>Edit register/call to action Button</Divider>
            <Box sx={{ display: "inline-flex", minWidth: "10rem", flexDirection: "row", padding: "1rem" }} textAlign="center">
                <FormControl fullWidth>

                    <InputLabel id="demo-simple-select-label">Button Color</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        variant="filled"
                        name="buttonColor"
                        id="demo-simple-select"
                        value={homepageButtonContent && homepageButtonContent.buttonColor ? homepageButtonContent.buttonColor as any : "green"}
                        label="Button Color"
                        onChange={handleSelectChange}

                    >
                        <MenuItem value={'red'}>Red</MenuItem>
                        <MenuItem value={'blue'}>Blue</MenuItem>
                        <MenuItem value={'green'}>Green</MenuItem>
                    </Select>
                </FormControl>
            </Box >
            <Box
                sx={{ display: "inline-flex", flexDirection: "row", padding: "1rem" }}
                component="form"
                textAlign='center'
                noValidate
                autoComplete="off"

                //onSubmit={(e: React.FormEvent<HTMLFormElement>) => handleButtonChange(e, websiteID)}
                onSubmit={() => saveButtonDataToDB(homepageButtonContent, websiteID)}
            >

                <TextField
                    name="formLink"
                    id="formLinkField"
                    label="Link to form"
                    sx={{ padding: "1rem" }}
                    variant="filled"
                    InputLabelProps={{ shrink: true }}
                    value={homepageButtonContent.formLink}
                    //onChange={(e) => setFormLink(e.target.value)}
                    onChange={handleChange}
                /*
                onChange={(e) => setHomepageButtonContent({
                    ...homepageButtonContent,
                    formLink: e.target.value
                })
                }
                */
                />
                <TextField
                    name="buttonText"
                    id="buttonTextField"
                    label="Button text"
                    sx={{ padding: "1rem" }}
                    variant="filled"
                    InputLabelProps={{ shrink: true }}
                    value={homepageButtonContent.buttonText}
                    //onChange={(e) => setButtonText(e.target.value)}
                    onChange={handleChange}
                /*
                onChange={(e) => setHomepageButtonContent({
                    ...homepageButtonContent,
                    buttonText: e.target.value
                })
                }
                */
                />

                <TextField
                    name="buttonInfo"
                    id="buttonInfoField"
                    sx={{ padding: "1rem" }}
                    label="Button info"
                    variant="filled"
                    InputLabelProps={{ shrink: true }}
                    value={homepageButtonContent.buttonInfo}
                    //onChange={(e) => setButtonInfo(e.target.value)}
                    onChange={handleChange}
                /*
                onChange={(e) => setHomepageButtonContent({
                    ...homepageButtonContent,
                    buttonInfo: e.target.value
                })
                }
                */
                />
                <Button type="submit" variant="contained" endIcon={<SaveIcon />}>Save</Button>

            </Box>
        </>
    )
}

function REACT_EXAMPLEControlledComponent() {
    const [inputValue, setInputValue] = useState('');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    return (
        <form>
            <label>Input Value:
                <input type="text" value={inputValue} onChange={handleChange} />
            </label>
            <p>Input Value: {inputValue}</p>
        </form>
    )
};

