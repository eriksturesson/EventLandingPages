import { useDbContent } from '../contexts/DBContentContext';
import { LoadingSpinner } from './Loading';
import NavWrapper from './NavWrapper';
import { SectionLoader } from './SectionLoader';

function testonload() {
   alert('testar onload i html-filen, då ska denna funktion köras');
}

const Home = (): JSX.Element => {
   const { homepageContent, isLoading } = useDbContent();
   if (isLoading) return <LoadingSpinner />;
   return (
      <>
         <NavWrapper isAdmin={false} />
         <SectionLoader adminEditor={false} data={homepageContent} />
      </>
   );
};

export default Home;
