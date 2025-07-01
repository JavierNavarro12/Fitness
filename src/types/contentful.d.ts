declare module 'contentful' {
  export function createClient(config: {
    space: string;
    accessToken: string;
    environment: string;
  }): any;
}

declare module '@contentful/rich-text-react-renderer' {
  export function documentToReactComponents(
    document: any,
    options?: any
  ): React.ReactElement;
}
