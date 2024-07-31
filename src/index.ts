import HarmonyMarker, { TextMarkOptions, ImageMarkOptions } from './index.harmony'
import Marker from 'react-native-image-marker';
import { Platform } from 'react-native';
interface ImageMarker {
    markText(options: TextMarkOptions): Promise<string>
    markImage(options: ImageMarkOptions): Promise<string>
}
const isIosAndroid = Platform.OS === 'ios' || Platform.OS === 'android';
const exportMarker: ImageMarker = isIosAndroid ? Marker : HarmonyMarker

export default exportMarker;
