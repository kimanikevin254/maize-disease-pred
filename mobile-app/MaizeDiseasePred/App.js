import { View, Text, Button, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

import Icon from 'react-native-vector-icons/Feather'

import IconDel from 'react-native-vector-icons/MaterialIcons'

import IconSend from 'react-native-vector-icons/FontAwesome'

const options = {
    mediaType: 'photo',
    quality: 1,
    maxWidth: 256,
    maxHeight: 256,
    includeBase64: true,
  };

export const {height, width} = Dimensions.get('window');


const MainScreen = () => {
    const [img, setImg] = useState(null)
    const [uri, setUri] = useState(null)
    const [type, setType] = useState(null)
    const [fileName, setFileName] = useState(null)

    const [isLoading, setIsLoading] = useState(false)

    const [predictions, setPredictions] = useState(null)

    const openCamera = async() => {
        // launchCamera(options, async response => {
        //   if (response.didCancel) {
        //     console.log('User cancelled image picker');
        //   } else if (response.error) {
        //     console.log('ImagePicker Error: ', response.error);
        //   } else if (response.customButton) {
        //     console.log('User tapped custom button: ', response.customButton);
        //   } else {
        //     const uri = response.assets[0].uri
        //     const path = 'file://' + uri
            
        //     //updating state
        //     setImg(path)
        //     setUri(response.assets[0].uri)
        //     setType(response.assets[0].type)
        //     setFileName(response.assets[0].fileName)
        //   }
        // })
        alert('Camera not supported while testing on emulator')
    }

    const predict = async () => {
      setIsLoading(true)
      const formData = new FormData()
            formData.append('file', {
              uri: uri,
              type: type,
              name: fileName
            })

            let res = await fetch('<your-aws-ip>/predict', {
              method: 'post',
              body: formData,
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            })

            let resJson = await res.json()

            setPredictions(resJson)
            setIsLoading(false)
    }
 
    const uploadImg = async () => {
      setPredictions(null)
        launchImageLibrary(options, async response => {
            if (response.didCancel) {
              console.log('User cancelled image picker');
            } else if (response.error) {
              console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
              console.log('User tapped custom button: ', response.customButton);
            } else {
              const uri = response.assets[0].uri;
              const path = Platform.OS !== 'ios' ? uri : 'file://' + uri;
              
              //updating state
              setImg(path)
              setUri(response.assets[0].uri)
              setType(response.assets[0].type)
              setFileName(response.assets[0].fileName)
            }
          });
    }

    const clearImg = () => {
      setImg(null)
      setPredictions(null)
    }

  return (
    <View style={styles.cont}>
    <View style={styles.header}>
        <Text style={styles.headerText}>Maize Leaf Disease</Text>
        <Text style={styles.headerText}>Detection App</Text>
    </View>

    {
      img !== null && (
      <View style={styles.delBtn}>
        <IconDel name='delete' size={50} color='red' onPress={clearImg} />
      </View>
      )
    }

    {
      img !== null ? 
      (<Image source={{uri: img}} style={styles.imageStyle} />) : 
      (<Text style={styles.instrText}>Upload or Capture a Maize Leaf Image Using the Buttons Below</Text>)
    }

    {
      predictions === null ?

      img !== null && (
        <TouchableOpacity style={styles.sendBtn} onPress={predict}>
          <Text style={styles.sendTxt}>{isLoading ? 'PREDICTING...':'PREDICT'}</Text>
          {isLoading ? '' : <IconSend name='send' size={30} color='white' />}
        </TouchableOpacity>
        )

      :

      <View style={styles.resultsCont}>
        <Text style={styles.resultHeader}>Predicted Results</Text>

        <View style={styles.resultBody}>
          <Text style={styles.resultBodyText}>Disease: {predictions.class}</Text>
          <Text style={styles.resultBodyText}>Confidence: {(predictions.confidence.toFixed(2))*100}%</Text>
        </View>
      </View>
    }

    <View style={styles.btns}>
        <View style={styles.btn}>
          <TouchableOpacity onPress={openCamera}>
              <Icon name='camera' size={45} color='green' />
              <Text>Capture</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.btn}>
          <TouchableOpacity onPress={uploadImg}>
            <Icon name='upload' size={45} color='green' />
              <Text>Upload</Text>
          </TouchableOpacity>
        </View>
    </View>
    </View>
  )
}

const styles = StyleSheet.create({
    cont:{
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: 20
    },
    header: {
        alignItems: 'center'
    },
    headerText: {
        fontSize: 35,
        color: 'green',
        fontWeight: 'bold',
        fontFamily: 'Roboto-Medium'
    },
    imageStyle: {
        width: width / 1.5,
        height: width / 1.5,
        borderRadius: 20,
        borderWidth: 0.3,
        borderColor: '#FFF',
      },
      instrText:{
        textAlign: 'center',
        fontSize: 20,
        fontStyle: 'italic',
        fontWeight: '500',
        color: 'gray',
        fontFamily: 'Roboto-Medium'
      },
      btns: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignSelf: 'stretch'
      },
      btn: {
        paddingHorizontal: 30,
        paddingVertical: 10,
        backgroundColor: 'white',
        fontSize: 20,
        borderRadius: 20,
        color: 'white',
        borderColor: 'green',
        borderWidth: 2
      },
      delBtn: {
        position: 'absolute',
        right: 0,
        top: 160
      },
      sendBtn: {
        flexDirection:'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: 'green',
        borderRadius: 10
      },
      sendTxt: {
        fontSize: 25,
        marginRight: 10,
        color: 'white',
        fontFamily: 'Roboto-Medium'
      },
      resultsCont: {
        borderRadius: 20,
        color: 'white',
        borderColor: 'green',
        borderWidth: 2,
        paddingHorizontal: 25,
        paddingVertical: 5
      },
      resultHeader: {
        fontSize: 20,
        alignSelf: 'center',
        color: 'green',
        fontFamily: 'Roboto-Medium',
        fontWeight: 'bold',
        textDecorationLine: 'underline'
      },
      resultBodyText: {
        fontFamily: 'Roboto-Medium',
        fontSize: 18,
        color: 'green'
      }
})

export default MainScreen