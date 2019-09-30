/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component }  from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  Switch,
  NativeModules,
  Platform
} from 'react-native';

var P24LibModule = NativeModules.P24LibModule;

var testMerchantID = 64195;
var testCrcSandbox = "d27e4cb580e9bbfe";
var testCrcSecure = "b36147eeac447028";
var sandboxEnabled = false;
var certificatePinningEnabled = true;
var inputValue = 'E5CA68A4A0-A7E322-473964-C0D39A715A';
var platformOfDevice = Platform.OS;
var isPlatformSupport = false;

isPlatformSupport = checkPlatform(platformOfDevice)
setupCertificatePinning();

function checkPlatform(platform){
  (platform == "ios" || platform == "android") ? true : false;
}

function setupCertificatePinning() {
  P24LibModule.setCertificatePinningEnabled(certificatePinningEnabled);
}

function setSandboxEnabled(isEnabled) {
  sandboxEnabled = isEnabled;
}

function setInputValue(text) {
  inputValue = text;
}

function getTestTransactionParams() {
  return {
    merchantId : testMerchantID,
    crc : getCrc(),
    sessionId : getUUID(),
    amount : 1,
    currency : "PLN",
    description : "test payment description",
    email : "test@test.pl",
    country : "PL",
    client : "John Smith",
    address : "Test street",
    zip : "60-600",
    city : "Poznań",
    phone : "1246423234",
    language : "pl"
  };
}

function getPassageTestTransactionParams() {
  var transactionParams = getTestTransactionParams();
  var amount = 0;
  var passageCart = [];

  for (var i = 0; i < 10; i++) {
      var price = 2 * (100 + i);
      var item = {
        name : "Product name " + i,
        description : "Product description " + i,
        number : i,
        quantity : 2,
        price : price / 2,
        targetAmount : price,
        targetPosId : i / 2 == 1 ? 51986 : 51987
      };

      amount += item["price"];
      passageCart.push(item);
  }

  transactionParams["amount"] = amount;
  transactionParams["passageCart"] = passageCart;
  return transactionParams;
}

function getCrc() {
	return  sandboxEnabled ? testCrcSandbox : testCrcSecure;
}

function getUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

let doTrnRequest;
let doTrnDirect;
let doExpress;
let doPassage;

switch(Platform.OS){
  case "android":
    doTrnRequest = async function () {
      var trnRequestParams = {
        token : inputValue,
        isSandbox : sandboxEnabled
      };
    
      var {
        isSuccess,
        isCanceled,
        errorCode
      } = await P24LibModule.startTrnRequest(trnRequestParams);
    
      if (isSuccess) {
        console.log("Transfer success");
      } else if(isCanceled) {
        console.log("Transfer canceled");
      } else {
        console.log("Transfer error. Code: " + errorCode);
      }
    }

  doTrnDirect = async function () {
      var trnDirectParams = {
        transactionParams : getTestTransactionParams(),
        isSandbox : sandboxEnabled
      };
    
      var {
        isSuccess,
        isCanceled,
        errorCode
      } = await P24LibModule.startTrnDirect(trnDirectParams);
    
      if (isSuccess) {
        console.log("Transfer success");
      } else if(isCanceled) {
        console.log("Transfer canceled");
      } else {
        console.log("Transfer error. Code: " + errorCode);
      }
    }
    
  doExpress = async function () {
      var expressParams = {
        url : inputValue
      };
    
      var {
        isSuccess,
        isCanceled,
        errorCode
      } = await P24LibModule.startExpress(expressParams);
    
      if (isSuccess) {
        console.log("Transfer success");
      } else if(isCanceled) {
        console.log("Transfer canceled");
      } else {
        console.log("Transfer error. Code: " + errorCode);
      }
    }
    
  doPassage = async function () {
      var trnDirectParams = {
        transactionParams : getPassageTestTransactionParams(),
        isSandbox : sandboxEnabled
      };
    
      var {
        isSuccess,
        isCanceled,
        errorCode
      } = await P24LibModule.startTrnDirect(trnDirectParams);
    
      if (isSuccess) {
        console.log("Transfer success");
      } else if(isCanceled) {
        console.log("Transfer canceled");
      } else {
        console.log("Transfer error. Code: " + errorCode);
      }
    }
   
  
  break;

  case "ios":
  doTrnRequest = async function() {
        var trnRequestParams = {
          token : inputValue,
          isSandbox : sandboxEnabled
        };
      
        P24LibModule.startTrnRequestWithParams(
          trnRequestParams,
          (success, cancel, error) => {
            if (success) {
              console.log("Transfer success");
            } else if(cancel) {
              console.log("Transfer canceled");
            } else {
              console.log("Transfer error. Code: " + error);
            }
          }
        );
      }
      
  doTrnDirect = async function () {
        var trnDirectParams = {
          transactionParams : getTestTransactionParams(),
          isSandbox : sandboxEnabled
        };
      
        P24LibModule.startTrnDirectWithParams(trnDirectParams,
          (success, cancel, error) => {
            if (success) {
              console.log("Transfer success");
            } else if(cancel) {
              console.log("Transfer canceled");
            } else {
              console.log("Transfer error. Code: " + error);
            }
          });
      
      }
      
  doExpress = async function () {
        var expressParams = {
          url : inputValue
        };
      
        P24LibModule.startExpressWithParams(expressParams,
          (success, cancel, error) => {
          if (success) {
            console.log("Transfer success");
          } else if(cancel) {
            console.log("Transfer canceled");
          } else {
            console.log("Transfer error. Code: " + error);
          }
        });
      }
      
  doPassage = async function() {
        var trnDirectParams = {
          transactionParams : getPassageTestTransactionParams(),
          isSandbox : sandboxEnabled
        };
      
        P24LibModule.startTrnDirectWithParams(trnDirectParams,
          (success, cancel, error) => {
          if (success) {
            console.log("Transfer success");
          } else if(cancel) {
            console.log("Transfer canceled");
          } else {
            console.log("Transfer error. Code: " + error);
          }
        });
      }
      
  break;

  default:
  }  

const App = () => {
  return (
    <>
     <P24Example/>
    </>
  );
};

export class SandboxSwitch extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      value: sandboxEnabled
    };
  }

  render() {
    return (
      <View style={styles.buttonContainer}>
        <Text style={styles.instructions}>
          Sandbox
        </Text>
        <Switch
          title="Sandbox"
          value={this.state.value}
          onValueChange={(value) => {
            this.setState({ value });
            setSandboxEnabled(value);
          }}
        />
        <Text style={styles.instructions}>
          {'\n'}
        </Text>
      </View>
    );
  }
};

export class TrnRequestButton extends Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <View style={styles.buttonContainer}>
        <Button
          title="Transfer trnRequest"
          styleDisabled={{ color: 'red' }}
          onPress={doTrnRequest}>
        </Button>
      </View>
    );
  }
};

export class TrnDirectButton extends Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <View style={styles.buttonContainer}>
        <Button
          title="Transfer trnDirect"
          styleDisabled={{ color: 'red' }}
          onPress={doTrnDirect}>
        </Button>
      </View>
    );

  }
};

export class ExpressButton extends Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <View style={styles.buttonContainer}>
        <Button
          title="Transfer express"
          styleDisabled={{ color: 'red' }}
          onPress={doExpress}>
        </Button>
      </View>
    );

  }
};

export class PassageButton extends Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <View style={styles.buttonContainer}>
        <Button
          title="Transfer passage"
          styleDisabled={{ color: 'red' }}
          onPress={doPassage}>
        </Button>
      </View>
    );

  }
};

export class TokenInput extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      value: inputValue
    };
  }

  render() {
    return (
      <View>
        <Text style={styles.instructions}>
          {'\n'}
          Transaction token/url:
      </Text>
        <TextInput
          style={{ width: 300, height: 40, borderBottomWidth: 0.5 }}
          value={this.state.value}
          onChangeText={(value) => {
            this.setState({ value });
            setInputValue(value);
          }}
        />
      </View>
    );
  }
}

class P24Example extends Component {
  

  render() {

    if (isPlatformSupport) {
      return (
        <View style={styles.container}>
        <Text style={styles.instructions}>
          Unfortunately, your OS don't supported by our example. Please, open example using ios or android system.
      </Text>
      
      </View>
      );
    }

    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Przelewy24 Mobile Library Example!
      </Text>
        <Text style={styles.instructions}>
          To get started, press any button below
      </Text>

        <Text>
          {'\n'}
          {'\n'}
          {'\n'}
          {'\n'}
        </Text>
        <SandboxSwitch />
        <TrnRequestButton />
        <TrnDirectButton />
        <ExpressButton />
        <PassageButton />
        <TokenInput />
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

export default App;
