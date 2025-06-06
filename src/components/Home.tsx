import NavWrapper from './NavWrapper';
import { SectionLoader } from './SectionLoader';
import { SectionContent } from './interfaces/sectionInterfaces';

function testonload() {
   alert('testar onload i html-filen, då ska denna funktion köras');
}

const Home = ({ homepageContent }: { homepageContent: SectionContent[] }): JSX.Element => {
   return (
      <>
         <NavWrapper isAdmin={false} />
         <SectionLoader adminEditor={false} data={homepageContent} />
      </>
   );
};

export default Home;
