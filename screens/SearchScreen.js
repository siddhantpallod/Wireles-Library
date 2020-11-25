import * as React from 'react';
import {Text,View,FlatList,TouchableOpacity,StyleSheet,TextInput} from 'react-native';
import db from '../config';



export default class SearchScreen extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            allTransactions : [],
            lastVisibleTransaction : null,
            search : ''

        }
    }


    fetchMoreTransaction = async () => {
        var text = this.state.search 
        var enterText = text.split('').toUpperCase()
        if (enterText[0].toUpperCase() == 'B'){
            const transaction = await db.collection('transaction').where('bookId', '==', text).startAfter(this.state.lastVisibleTransaction).limit(10).get()
            transaction.docs.map((doc) => {
                this.setState({
                    allTransactions : [...this.state.allTransactions, doc.data()],
                    lastVisibleTransaction : doc
                })
            })

        } else if(enterText[0].toUpperCase() == 'S'){
            const transaction = await db.collection('transaction').where('studentId', '==', text ).startAfter(this.state.lastVisibleTransaction).limit(10).get()
            transaction.docs.map((doc) => {
                this.setState({
                    allTransactions : [...this.state.allTransactions, doc.data()],
                    lastVisibleTransaction : doc
                })
            })
        }

    }

    searchTransactions = async (text) => {
        var enterText = text.split("").toUpperCase()
        if (enterText[0].toUpperCase() == 'B'){
            const transaction = await db.collection('transaction').where('bookId', '==', text).get()
            transaction.docs.map((doc) => {
                this.setState({
                    allTransactions : [...this.state.allTransactions, doc.data()],
                    lastVisibleTransaction : doc
                })
            })

        } else if(enterText[0].toUpperCase() == 'S'){
            const transaction = await db.collection('transaction').where('studentId', '==', text ).get()
            transaction.docs.map((doc) => {
                this.setState({
                    allTransactions : [...this.state.allTransactions, doc.data()],
                    lastVisibleTransaction : doc
                })
            })
        }
    }

    render(){
        return(
            <View>
            <View>
            <TextInput
            style = {styles.searchBar}
            placeholder = 'Enter book id or student id'
            onChangeText = {(text)=> {
                this.setState({
                    search : text
                })
            }}
            />
            <TouchableOpacity style = {styles.searchButton}
            onPress = {() => {
                this.searchTransactions(this.state.search)
            }}
            >
                <Text> Search </Text>
            </TouchableOpacity>
            </View>
            <FlatList
                data = {this.state.allTransactions}
                    renderItem = {({item}) => (
                        <View>
                            <Text> {'Book Id : ' + item.bookId}  </Text>
                            <Text> {'Student Id : ' + item.studentId}  </Text>
                            <Text> {'Transaction Type : ' + item.transactionType} </Text>
                            <Text> {'Date : ' + item.date.toDate()}</Text>
                        </View>
                    )}  
            keyExtractor = {(item,index) => 
                index.toString()
            }
            onEndReached = {this.fetchMoreTransaction}
            onEndReachedThreshold = {0.7}
            />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    searchBar : {
        flexDirection : 'row',
        width : 'auto',
        height : 50,
        alignItems : 'center',
        backgroundColor : 'grey'
    },
    searchButton : {
        backgroundColor : 'blue',
        height : 50,
        width : 50,
        justifyContent : 'center'
    }
})