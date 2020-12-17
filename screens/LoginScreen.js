import * as React from 'react';
import {Text,View,TouchableOpacity, StyleSheet,TextInput,KeyboardAvoidingView,Image,Alert} from 'react-native';
export default class LoginScreen extends React.Component {
   
   constructor(){
       super();
       this.state = {
           email : '',
           password : ''
       }
   }

   login = async(email,password) => {
        if(email && password){
            try{
            const response = await firebase.auth().signInWithEmailAndPassword(email,password)
            if(response){
                this.props.navigation.navigate('Transaction')
            }
            }
            catch(error){
                switch(error.code){
                    case 'auth/user-not-found' : 
                    Alert.alert("User doesn't exist")
                    console.log("User doesn't exist")
                    break;
                    case 'auth/invalid-email' :
                    Alert.alert("Invalid email or password")
                    console.log("Invalid email or password")
                    break;
                    default:
                    break;
                }
            }
        }
             else {
                Alert.alert("Please enter email and password")
                console.log("Please enter email and password")
            }
        
    
   }
   
    render(){
        return(
        <KeyboardAvoidingView style = {{
            alignItems : 'center',
            marginTop : 30
        }}>
            
            <View>
            <Image
                    style = {{
                        width : 150,
                        height : 150,
                        marginLeft : 50
                    }}
                    source = {require('../assets/booklogo.jpg')}
                    />
                    </View>
                    <View>

                <TextInput
                    style = {{
                     width : 250,
                     height : 50,
                     borderWidth : 2,
                     fontSize : 20   
                }}
                    placeholder = "email"
                    keyboardType = 'email-address'
                    onChangeText = {(text) => {
                        this.setState({
                            email : text 
                        })
                    }}
                />

                
                <TextInput
                style = {{
                    width : 250,
                    height : 50,
                    borderWidth : 2,
                    fontSize : 20   
               }}
                    secureTextEntry = {true}
                    placeholder = "password"
                    onChangeText = {(text) => {
                        this.setState({
                            password : text 
                        })
                    }}
                />
                </View>
                <View>
                    <TouchableOpacity style = {{
                        backgroundColor : 'blue',
                        height : 50,
                        width : 100,
                        borderWidth : 2
                    }}
                    onPress = {()=> {
                        this.login(this.state.email,this.state.password)
                    }}>
                        <Text style = {{
                            color : 'white',
                            textAlign : 'center'
                        }}> Login </Text>
                    </TouchableOpacity>
                </View>
        </KeyboardAvoidingView>
        )
    }
}