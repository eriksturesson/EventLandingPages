import { useDbContent } from '../contexts/DBContentContext';
import { useSiteSettings } from '../contexts/SiteSettingsContext';
import { LoadingSpinner } from './Loading';
import NavWrapper from './NavWrapper';
import PageMeta from './PageMeta';
import { SectionLoader } from './SectionLoader';

const CustomPage = ({ pageID }: { pageID: string }): JSX.Element => {
   const { customPageMetaData, customPages, isLoading } = useDbContent();
   const { siteSettings } = useSiteSettings();
   const page = customPageMetaData.find((p) => p.pageID === pageID);
   const pageContent = customPages[pageID];

   if (!page) return <div>Sidan hittades inte</div>;
   if (isLoading) return <LoadingSpinner />;
   return (
      <>
         <PageMeta siteName={page.pageName} imageUrl={siteSettings?.logoUrl} description={siteSettings?.siteDescription} />
         <NavWrapper isAdmin={false} />
         <SectionLoader adminEditor={false} data={pageContent} pageID={pageID} />
      </>
   );
};

export default CustomPage;
