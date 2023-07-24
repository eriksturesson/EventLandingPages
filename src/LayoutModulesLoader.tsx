import { DummyComponent1 } from './layoutModules/DummyComponent1';
import { DummyComponent2 } from './layoutModules/DummyComponent2';

// type & interface to be moved to separate file
type Content = string;

interface layoutItem {
   name: string;
   content: Content;
}

interface ContentData {
   layoutItems: Array<layoutItem>;
   pageId: string;
}

interface Props {
   contentData: ContentData;
}

interface Modules {
   [component: string]: React.FC<{ content: Content }>;
}

// Object for mapping each component in the JSX
const modules: Modules = {
   DummyComponent1: DummyComponent1,
   DummyComponent2: DummyComponent2,
};

export const LayoutModulesLoader: React.FC<Props> = function (props) {
   return (
      <>
         {props.contentData.layoutItems.map((module, i) => {
            const Component = modules[module.name];

            console.log(module);

            if (!Component) {
               console.error(
                  `Failed to render module ${module.name}. Check spelling.`
               );
               return null;
            }

            return (
               <Component
                  content={module.content}
                  key={`${module.name}-${i}`}
               />
            );
         })}
      </>
   );
};
