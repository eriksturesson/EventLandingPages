import { useDbContent } from '../contexts/DBContentContext';
import { useSiteSettings } from '../contexts/SiteSettingsContext';
import { LoadingSpinner } from './Loading';
import NavWrapper from './NavWrapper';
import PageMeta from './PageMeta';
import { SectionLoader } from './SectionLoader';

function testonload() {
   alert('testar onload i html-filen, då ska denna funktion köras');
}

const Home = (): JSX.Element => {
   const { homepageContent, isLoading } = useDbContent();
   const { siteSettings } = useSiteSettings();
   siteSettings?.logoUrl;
   if (isLoading) return <LoadingSpinner />;
   return (
      <>
         <PageMeta
            title="Home"
            siteName={siteSettings?.siteName}
            imageUrl={siteSettings?.logoUrl}
            description={siteSettings?.siteDescription}
         />
         <NavWrapper isAdmin={false} />
         <SectionLoader adminEditor={false} data={homepageContent} pageID={null} />
      </>
   );
};

export default Home;
