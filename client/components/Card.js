import React from 'react';
import { StyleSheet, Text, Button, Alert, TouchableOpacity, View, StatusBar, DatePickerIOS } from 'react-native';

import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements'

import { StackNavigator } from 'react-navigation';
import button from '../assets/buttons/buttons';
import colors from '../config/colors';
import fonts from '../config/fonts';
import {CreditCardInput} from '../react-native-credit-card-input-0.3.3/src';

export default class Card extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      name: "",
      email: "",
      zip: '',
      form: {
        values: {
          number: "",
          expire: "",
          cvc: "",
          name:"",
          postalCode: "",
          email: "",
        },
        valid: false,
      },
    };
  }

  static navigationOptions = {header:null}
  addAmount = ()=>{
    this.props.navigation.navigate('Amount')
  }

  onChange = (form) => {
   this.setState({form: form});
 }



  handleClick = () =>{
    var stripe_url = 'https://api.stripe.com/v1/'
    var secret_key = 'pk_test_zNnQiNYcPwaufUQMAWaN6fbC'
    var cardDetails = {
      "card[number]":this.state.form.values.number,
      "card[exp_month]":this.state.form.values.expiry.substring(0,2),
      "card[exp_year]":this.state.form.values.expiry.substring(3,5),
      "card[cvc]":this.state.form.values.cvc,
      "card[address_zip]":this.state.form.values.postalCode
    }
    console.log('CARD DETAILS', cardDetails);
    var formBody = [];
    for (var property in cardDetails) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(cardDetails[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    fetch(stripe_url + 'tokens', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer ' + 'pk_test_zNnQiNYcPwaufUQMAWaN6fbC'
      },
      body: formBody
    }).then(result=>result.json()).then(result=>{
      let obj = {
        id: result.id,
        firstName: this.state.form.values.name,
        lastName: this.state.form.values.name,
        email: this.state.form.values.email,
        amount: this.props.navigation.state.params.donation
      }
      console.log('SENDING OBJECT: ', obj)
      fetch('https://reality-garage-server.herokuapp.com/', {
          method: 'post',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(obj)
        }).then(result=>result.json()).then(result=>{
          console.log(result)})
    })
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <StatusBar hidden={true} />
        <View>
          <View style = {styles.container1}>
            <CreditCardInput onChange={this.onChange} />
          </View>
          <View style={styles.container2}>
            <TouchableOpacity disabled={!this.state.form.valid} onPress = {() => {
              navigate('Thanks', {name: this.state.form.values.name})
              this.handleClick()
            }}>

              <Text style={button}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.darkgray,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  container1: {
    flex:1,
  },
  container2: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subcontainer1: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  greeting:{
    fontSize: 40,
    fontFamily: fonts.MontserratThin,
    color: colors.white,
    margin: 20,
  },
  buttonText: {
    fontSize: 20,
    fontFamily: fonts.MontserratThin,
    color: colors.yellow,
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: colors.yellow,
    padding: 12,
    borderRadius: 25,
  },
  footer: {
    fontSize: 15,
    fontFamily: fonts.MontserratThin,
    color: colors.white,
    paddingBottom: 10,
  },
  garage: {
    fontFamily: fonts.MontserratLight,
  }
});
