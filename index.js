/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import CameraApp from './Camera';
import ImageApp from './Image';
import {name as appName} from './app.json';

//AppRegistry.registerComponent(appName, () => App);
//AppRegistry.registerComponent(appName, () => CameraApp);
AppRegistry.registerComponent(appName, () => ImageApp);
