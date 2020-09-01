import React from 'react';
import {StyleSheet, Text, View, Button, Image} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import {fetch} from '@tensorflow/tfjs-react-native';
import {decodeJpeg} from '@tensorflow/tfjs-react-native';
import * as RNFS from 'react-native-fs';
import {decode} from 'base64-arraybuffer';

export default class ImageApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isTfReady: false,
      filePath: {},
      modelLoading: false,
      predict: [],
      model: undefined,
    };
  }
  chooseFile = () => {
    var options = {
      title: 'Select Image',
      customButtons: [
        {name: 'customOptionKey', title: 'Choose Photo from Custom Option'},
      ],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        let source = response;
        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };
        this.setState({
          filePath: source,
        });
      }
    });
  };

  async detectImage() {
    await tf.ready();
    this.setState({
      isTfReady: true,
      predict: [],
    });

    const response_b64 = await RNFS.readFile(this.state.filePath.uri, 'base64');
    const response = decode(response_b64);
    const imageTensor = decodeJpeg(new Uint8Array(response));
    //const model = await mobilenet.load();
    const m = await this.loadModel();
    const prediction = m.classify(imageTensor);
    return prediction;
  }

  async loadModel() {
    this.setState({modelLoading: true});
    if (this.state.model === undefined) {
      const m = await mobilenet.load();
      this.setState({modelLoading: false});
      this.setState({model: m});
      console.log('loaded model remote...');
      return m;
    } else {
      console.log('loaded model local...');
      return this.state.model;
    }
  }

  render() {
    let tfText = 'false';
    if (this.state.isTfReady) {
      // eslint-disable-next-line no-unused-vars
      tfText = 'true';
    }
    let modelLoadingText = 'false';
    if (this.state.modelLoading) {
      modelLoadingText = 'true';
    }

    let predictionList = this.state.predict.map(function (data) {
      return (
        <View key={data.className}>
          <Text>{data.className}</Text>
          <Text>{data.probability}</Text>
        </View>
      );
    });
    return (
      <View style={styles.container}>
        <View style={styles.container}>
          {/*<Image
          source={{ uri: this.state.filePath.path}}
          style={{width: 100, height: 100}} />*/}
          {/* <Image
            source={{
              uri: 'data:image/jpeg;base64,' + this.state.filePath.data,
            }}
            style={{width: 100, height: 100}}
          /> */}
          <Image
            source={{uri: this.state.filePath.uri}}
            style={{width: 250, height: 250}}
            //onLoad={() => alert('ONload....')}
            onLoadEnd={() =>
              this.detectImage().then((res) => {
                console.log(res);
                  this.setState({predict: res});
              })
            }
          />
          <Text>The TF is ready: {tfText}</Text>
          <Text style={{alignItems: 'center'}}>{this.state.filePath.uri}</Text>
          <Text>The Model is loading: {modelLoadingText}</Text>
          <Button title="Choose File" onPress={this.chooseFile.bind(this)} />
          <View>{predictionList}</View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
