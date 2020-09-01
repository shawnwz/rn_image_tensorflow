/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from 'react';
import * as tf from '@tensorflow/tfjs';
//import '@tensorflow/tfjs-react-native';
import * as mobilenet from '@tensorflow-models/mobilenet';
import {fetch} from '@tensorflow/tfjs-react-native';
import {decodeJpeg} from '@tensorflow/tfjs-react-native';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Image,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
//import { decodeJpeg } from '@tensorflow/tfjs-react-native';
import {CameraApp} from './Camera';

export class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isTfReady: false,
      predict: [],
    };
  }

  async componentDidMount() {
    await tf.ready();
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({
      isTfReady: true,
    });
    const model = await mobilenet.load();
    const image = require('./assets/images/2.jpeg');
    const imageAssetPath = Image.resolveAssetSource(image);
    const response = await fetch(imageAssetPath.uri, {}, {isBinary: true});
    const imageData = await response.arrayBuffer();
    const imageTensor = decodeJpeg(new Uint8Array(imageData));
    const prediction = await model.classify(imageTensor);
    console.log('xxxxxxxxxxxxxxxxx');
    this.setState({predict: prediction});
/*     if (this.state.predict.length > 0) {
      for (var x in this.state.predict) {
        console.log(x.toString);
      }
    } */
  }
  render() {
    let tfText = 'false';
    if (this.state.isTfReady) {
      // eslint-disable-next-line no-unused-vars
      tfText = 'true';
    }
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <View>
            <Text>你好</Text>
            <Text>TF状态: {tfText}</Text>
          </View>
          {this.predictionList()}
          {CameraApp}
        </SafeAreaView>
      </>
    );
  }

  predictionList() {
    this.state.predict.map((data) => {
      return (
        <View>
          <Text>{data.className}</Text>
        </View>
      );
    });
  }
}

/* const App: () => React$Node = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <Header />
          {global.HermesInternal == null ? null : (
            <View style={styles.engine}>
              <Text style={styles.footer}>Engine: Hermes</Text>
            </View>
          )}
          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Step One</Text>
              <Text style={styles.sectionDescription}>
                Edit <Text style={styles.highlight}>App.js</Text> to change this
                screen and then come back to see your edits.
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>See Your Changes</Text>
              <Text style={styles.sectionDescription}>
                <ReloadInstructions />
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Debug</Text>
              <Text style={styles.sectionDescription}>
                <DebugInstructions />
              </Text>
            </View>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Learn More</Text>
              <Text style={styles.sectionDescription}>
                Read the docs to discover what to do next:
              </Text>
            </View>
            <LearnMoreLinks />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}; */

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
