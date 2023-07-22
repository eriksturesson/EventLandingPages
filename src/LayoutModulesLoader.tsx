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

// Object for mapping each component in the JSX
const modules: {
   [component: string]: ({ content }: { content: Content }) => JSX.Element;
} = {
   DummyComponent1: DummyComponent1,
   DummyComponent2: DummyComponent2,
};

export function LayoutModulesLoader(props: { contentData: ContentData }) {
   return (
      <>
         {props.contentData.layoutItems.map((module, i) => {
            const Component = modules[module.name];

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
}
