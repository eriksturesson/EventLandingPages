import { useDbContent } from '../contexts/DBContentContext';
import { LoadingSpinner } from './Loading';
import NavWrapper from './NavWrapper';
import { SectionLoader } from './SectionLoader';

const CustomPage = ({ pageID }: { pageID: string }): JSX.Element => {
   const { customPageMetaData, customPages, isLoading } = useDbContent();
   const page = customPageMetaData.find((p) => p.pageID === pageID);
   const pageContent = customPages[pageID];

   if (!page) return <div>Sidan hittades inte</div>;
   if (isLoading) return <LoadingSpinner />;
   return (
      <>
         <NavWrapper isAdmin={false} />
         <SectionLoader adminEditor={false} data={pageContent} pageID={pageID} />
      </>
   );
};

export default CustomPage;
