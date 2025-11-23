'use client';

import CreativeEditor from '@cesdk/cesdk-js/react';

const config = {
  license: '', 
};


const init = async cesdk => {
  // do something with the instance of CreativeEditor SDK (e.g., populate
  // the asset library with default / demo asset sources)
  await Promise.all([
    cesdk.addDefaultAssetSources(),
    cesdk.addDemoAssetSources({
      sceneMode: 'Design',
      withUploadAssetSources: true,
    }),
  ]);

  // create a new design scene in the editor
  await cesdk.createDesignScene();
};

export default function CreativeEditorSDKComponent() {
  return (
    // The CreativeEditor wrapper component
    <CreativeEditor config={config} init={init} width="100vw" height="100vh" />
  );
}