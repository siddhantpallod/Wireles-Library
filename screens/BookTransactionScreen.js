import * as React from 'react';
import {Text,View,TouchableOpacity, StyleSheet,Image,ToastAndroid,KeyboardAvoidingView,Alert,TextInput} from 'react-native';
import {BarCodeScanner} from 'expo-barcode-scanner';
import * as Permissions from 'expo-permissions';
import db from '../config';



export default class BookTransactionScreen extends React.Component{
   
    constructor(){
        super();
        this.state = {
            hasCameraPermissions : null,
            scanned : false,
            scannedData : '',
            buttonState : 'normal',
            scannedBookId : '',
            scannedStudentId : ''
        }
    }

    getCameraPermission = async (id) => {
        const {status} = await Permissions.askAsync(Permissions.CAMERA)
        this.setState({
            hasCameraPermissions : status === 'granted',
            buttonState : id,
            scanned : false
        }) 

    }   

    handleBarCodeScanned = async ({type,data}) => {
        const {buttonState} = this.state
        if(buttonState === 'bookid'){

            this.setState({
                scanned : true,
                scannedBookId : data,
                buttonState : 'normal'
            })
    }
    else if (buttonState === 'studentid'){
        this.setState({
            scannedStudentId : data,
            scanned : true,
            buttonState : 'normal'
        })
    }
        
    }

    initiateBookIssue = async() => {
        db.collection('transaction')
        .add({
            studentId : this.state.scannedStudentId,
            bookId : this.state.scannedBookId,
            date : firebase.firestore.Timestamp.now().toDate(),
            transactionType : 'issued'
        })
        db.collection('books').doc(this.state.scannedBookId)
        .update({
            bookAvailability : false
        })

        db.collection('students').doc(this.state.scannedStudentId)
        .update({
            noOfBooksIssued : firebase.firestore.FieldValue().increment(1),
        })

        this.setState({
            scannedBookId : '',
            scannedStudentId : ''
        })
    }

    initateBookReturn = async () => {
        db.collection('transaction')
        .add({
            studentId : this.state.scannedStudentId,
            bookId : this.state.scannedBookId,
            date : firebase.firestore.Timestamp.now().toDate(),
            transactionType : 'returned'
        })

        db.collection('books').doc(this.state.scannedBookId)
        .update({
            bookAvailability : true
        })

        db.collection('students').doc(this.state.scannedStudentId)
        .update({
            noOfBooksIssued : firebase.firestore.FieldValue().increment(-1),
        })
        
        this.setState({
            scannedBookId : '',
            scannedStudentId : ''
        })
    }

    checkBookEligibility = async () => {
        const bookRef = await db.collection('books').where('bookId', '===', this.state.scannedBookId).get()
        var transactionType = ''

        if(bookRef.docs.length === 0){
            transactionType = false
        }
        else{
            bookRef.docs.map(doc => {
                var book = doc.data()
            if (book.bookAvailability) {
                transactionType = 'Issue'
            } else {
                transactionType = 'Return' 
            }
            })
        }
        return transactionType
        
    }

    checkStudentEligibilityForBookIssue = async () => {
        const studentRef = await db.collection('students').where('studentId', '===', this,state.scannedStudentId).get()
        var isStudentEligible = ''

        if(studentRef.docs.length === 0){
            this.setState({
                scannedStudentId : '',
                scannedBookId : ''
            })
            isStudentEligible = false;
            Alert.alert("The student id does not exist in the database")
        }
        else{
             studentRef.docs.map(doc => {
                 var student = doc.data()
                 if(students.noOfBooksIssued < 2){
                     isStudentEligible = true
                 }
                 else{
                     isStudentEligible = false;
                     Alert.alert("Student has already issued two books")
                     this.setState({
                         scannedBookId : '',
                         scannedStudentId : ''
                     })
                 }
             })
        }

        return isStudentEligible
    }

    checkStudentEligibiltyForReturn = async () => {
        const transactionRef = await db.collection('transaction').where('bookId', "===", this.state.scannedBookId).limit(1).get()
        var isStudentEligible = ''
        
        transactionRef.docs.map(doc => {
            var lastTransaction = doc.data

            if(lastTransaction.studentId === this.state.scannedStudentId){
                isStudentEligible = true
            }
            else{
                isStudentEligible = false
                Alert.alert("This student has not issued the book");
                this.setState({
                    scannedBookId : '',
                    scannedStudentId : ''
                })
            }
        })
        return isStudentEligible
    }


    handleTransaction = async () => {
        var transactionType = await this.checkBookEligibility()

        if(transactionType === false){
         Alert.alert("This book does not exists in the database")
         this.setState({
             scannedBookId : '',
             scannedStudentId : ''
         })   
        } else if(transactionType === "Issue"){
            var isStudentEligible = await this.checkStudentEligibilityForBookIssue()
            if(isStudentEligible === true){
                this.initiateBookIssue()
                Alert.alert("Book issued to the student")
            }
        } else {
            var isStudentEligible = await this.checkStudentEligibiltyForReturn()
            if(isStudentEligible === true){
                this.initateBookReturn()
                Alert.alert("Book returned to the library")
            }
        }
    }

   
    render(){
        const hasCameraPermissions = this.state.hasCameraPermissions
        const scanned = this.state.scanned
        const buttonState = this.state.buttonState 

        if(buttonState !== 'normal' && hasCameraPermissions){
            return(
                <BarCodeScanner
                    style = {StyleSheet.absoluteFillObject}
                    onBarCodeScanned = {scanned ? undefined : this.handleBarCodeScanned}
                />

                
            )
        }
        else if (buttonState === 'normal'){
        return(
            <KeyboardAvoidingView style = {styles.container}
            behavior = 'padding'enabled
            >
                <View>
                    <Image
                    style = {{
                        width : 150,
                        height : 150,
                        marginLeft : 50
                    }}
                    source = {require('../assets/booklogo.jpg')}
                    />
                    <Text style = {{
                        textAlign : 'center',
                        fontSize : 25,
                        marginRight : 100
                    }}> E-Library </Text>
                </View>
                <View style = {styles.inputView}>
                    <TextInput
                    style = {styles.inputBox}
                        placeholder = 'Book Id'
                        onChangeText = {text => {
                            this.setState({
                                scannedBookId : text
                            })
                        }}
                        value = {this.state.scannedBookId}
                    />
                
                <TouchableOpacity style = {styles.scanButton}
                 onPress = { () => {
                     this.getCameraPermission('bookid')
                 }}
               >

                    <Text style = {styles.buttonText} > Scan </Text>
                </TouchableOpacity>
            </View>
            <View style = {styles.inputView}>
                <TextInput
                style = {styles.inputBox}
                    placeholder = 'Student Id'
                    onChangeText = {text => {
                        this.setState({
                            scannedStudentId : text
                        })
                    }}
                    value = {this.state.scannedStudentId}
                />
                <TouchableOpacity style = {styles.scanButton}
                onPress = { () => {
                    this.getCameraPermission('studentid')
                }}
                >
                    <Text style = {styles.buttonText}> Scan </Text>
                </TouchableOpacity>

            </View>
                <TouchableOpacity style = {styles.submitButton}
                onPress = {async()=>{
                    var transactionMessage = await this.handleTransaction()
                    this.setState({
                        scannedBookId : '',
                        scannedStudentId : ''
                    })
                
                }}

                >
                    <Text style = {styles.buttonText}> Submit </Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
            

            )
        }
    }
}

const styles = StyleSheet.create({
    container : {
        alignSelf : 'center',
        justifyContent : 'center',
        flex : 1
    },

    displayText : {
        fontSize : 20,
        textDecorationLine : 'underline'
    },

    scanButton : {
        backgroundColor : 'blue',
        margin : 20,
        borderWidth : 3,
        borderRadius : 30
    },
    buttonText : {
        color : 'white',
        fontSize : 20,
        alignSelf : 'center'
    },

    inputBox : {
        width : 200,
        height : 50,
        borderWidth : 2,
        fontSize : 20,
        alignSelf : 'center'
    },

    inputView : {
        flexDirection : 'row',
        margin : 20
    },

    submitButton : {
        backgroundColor : 'blue',
        margin : 20,
        borderWidth : 3,
        borderRadius : 30,
        width : 250,
        height : 30
    },
    
})