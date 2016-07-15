import { loadFeaturesFromContext, loadLibrariesFromContext } from 'tangkwa'

export const features = loadFeaturesFromContext(require.context('./features', true, /\.feature$/))
export const libraries = loadLibrariesFromContext(require.context('./libraries', false, /\.js$/))
