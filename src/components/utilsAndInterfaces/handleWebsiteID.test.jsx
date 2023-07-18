import { handleWebSiteID } from './handleWebsiteID';
test('See that I will create and/or get a websiteID', () => {
    return handleWebSiteID().then((data) => {
        expect(typeof data).toBe("string");


    });
});
