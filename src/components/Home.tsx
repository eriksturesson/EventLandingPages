import { SectionLoader } from '../SectionLoader';
import { SectionIDs } from './interfaces/sectionInterfaces';

function testonload() {
   alert('testar onload i html-filen, då ska denna funktion köras');
}

const Home = ({ homepageContent }: { homepageContent: SectionIDs }): JSX.Element => {
   return <SectionLoader adminEditor={false} data={homepageContent} />;
};

export default Home;
