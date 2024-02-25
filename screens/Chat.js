import React, {useCallback, useLayoutEffect, useState} from 'react';
import {Button, TouchableOpacity} from 'react-native';
import {GiftedChat} from 'react-native-gifted-chat';
import {addDoc, collection, onSnapshot, orderBy, query} from 'firebase/firestore';
import {signOut} from 'firebase/auth';
import {auth, database} from '../config/firebase';
import {useNavigation} from '@react-navigation/native';
import {AntDesign} from '@expo/vector-icons';
import colors from '../colors';
import * as ImagePicker from "expo-image-picker";
import {Image} from "react-native";



export default function Chat() {

    const [messages, setMessages] = useState([]);
    const navigation = useNavigation();
    const [image, setImage] = useState(null);

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

  const onSignOut = () => {
      signOut(auth).catch(error => console.log('Error logging out: ', error));
    };

    useLayoutEffect(() => {
        navigation.setOptions({
          headerRight: () => (
            <TouchableOpacity
              style={{
                marginRight: 10
              }}
              onPress={onSignOut}
            >
              <AntDesign name="logout" size={24} color={colors.gray} style={{marginRight: 10}}/>
            </TouchableOpacity>
          )
        });
      }, [navigation]);

    useLayoutEffect(() => {

        const collectionRef = collection(database, 'chats');
        const q = query(collectionRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, querySnapshot => {
        console.log('querySnapshot unsusbscribe');
          setMessages(
            querySnapshot.docs.map(doc => ({
              _id: doc.data()._id,
              createdAt: doc.data().createdAt.toDate(),
              text: doc.data().text,
              user: doc.data().user
            }))
          );
        });
    return unsubscribe;
      }, []);

    const onSend = useCallback((messages = []) => {
        setMessages(previousMessages =>
          GiftedChat.append(previousMessages, messages)
        );
        // setMessages([...messages, ...messages]);
        const {_id, createdAt, text, user} = messages[0];
        addDoc(collection(database, 'chats'), {
          _id,
          createdAt,
          text,
          user
        });
      }, []);

      return (

          <>
              <Button title="Pick an image from camera roll" onPress={pickImage} />
              {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
              <GiftedChat
                  messages={messages}
                  showAvatarForEveryMessage={false}
                  showUserAvatar={false}
                  onSend={(messages) => onSend(messages)}
                  messagesContainerStyle={{
                      backgroundColor: '#fff',
                  }}
                  textInputStyle={{
                      backgroundColor: '#fff',
                      borderRadius: 20,
                  }}
                  user={{
                      _id: auth?.currentUser?.email,
                      avatar: 'https://i.pravatar.cc/300',
                  }}
              />
          </>

)
}

