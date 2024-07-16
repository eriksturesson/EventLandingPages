/// <reference types="vite/client" />
declare module '*.jpg' {
   const value: string;
   export default value;
}

declare module '*.JPG' {
   const value: string;
   export default value;
}

declare module '*.jpeg' {
   const value: string;
   export default value;
}

declare module '*.png' {
   const value: string;
   export default value;
}

declare module '*.svg' {
   const value: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
   export default value;
}

declare module '*.gif' {
   const value: string;
   export default value;
}

declare module '*.bmp' {
   const value: string;
   export default value;
}

declare module '*.tiff' {
   const value: string;
   export default value;
}
