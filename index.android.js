/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  Switch,
  NativeModules
} from 'react-native';


var P24LibModule = NativeModules.P24LibModule;

var testMerchantID = 64195;
var testCrcSandbox = "d27e4cb580e9bbfe";
var testCrcSecure = "b36147eeac447028";
var sandboxEnabled = false;
var certificatePinningEnabled = true;
var inputValue = 'E5CA68A4A0-A7E322-473964-C0D39A715A';

setupCertificatePinning();

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
async function doTrnRequest() {
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

async function doTrnDirect() {
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

async function doExpress() {
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

async function doPassage() {
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

export class SandboxSwitch extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
          value: false
        };
    }

    render() {
      return (
        <View style={styles.switchContainer}>
          <Text>
            Sandbox
          </Text>
          <Switch
          value={ this.state.value }
          onValueChange={(value) => {
            this.setState({value});
            setSandboxEnabled(value);
          }}
          />
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
            styleDisabled={{color: 'red'}}
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
            styleDisabled={{color: 'red'}}
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
            styleDisabled={{color: 'red'}}
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
            styleDisabled={{color: 'red'}}
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
          style={{width: 300,height: 40}}
          value={this.state.value}
          onChangeText={(value) => {
            this.setState({value});
            setInputValue(value);
          }}
        />
      </View>
    );
  }
}

class P24Example extends Component {
  render() {
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
        <SandboxSwitch/>
        <TrnRequestButton/>
        <TrnDirectButton/>
        <ExpressButton/>
        <PassageButton/>
        <TokenInput/>
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
  buttonContainer: {
    paddingBottom: 10,
  },
  switchContainer: {
    paddingBottom: 20,
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

AppRegistry.registerComponent('P24Example', () => P24Example);
