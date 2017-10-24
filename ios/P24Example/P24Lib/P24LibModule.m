//
//  P24LibModule.m
//  P24Example
//
//  Created by Arkadiusz Macudziński on 29.08.2016.
//  Copyright © 2016 Facebook. All rights reserved.
//

#import "P24LibModule.h"

@implementation P24LibModule

P24* p24;
P24ProtocolHandler* p24Handler;


RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(startTrnRequestWithParams:(NSDictionary*)params callback:(RCTResponseSenderBlock)callback)
{
  
  if (p24Handler) {
    return;
  }
  
  p24Handler = [P24ProtocolHandler new];
  p24Handler.rctCallback = callback;
  P24TrnRequestParams* trnParams = [[P24TrnRequestParams alloc] initWithToken:params[@"token"]];
  trnParams.sandbox = params[@"isSandbox"];
  trnParams.settings = [P24LibModule settingsFromParams: params[@"settingsParams"]];
  
  dispatch_sync(dispatch_get_main_queue(), ^{
    [P24 startTrnRequest:trnParams inViewController:[P24LibModule rootViewController] delegate:p24Handler];
  });

}

RCT_EXPORT_METHOD(startTrnDirectWithParams:(NSDictionary*)params callback:(RCTResponseSenderBlock)callback)
{
  
  if (p24Handler) {
    return;
  }
  
  p24Handler = [P24ProtocolHandler new];
  p24Handler.rctCallback = callback;
  
  P24TransactionParams* trasaction = [P24LibModule transactionParams:params[@"transactionParams"]];
  
  P24TrnDirectParams* trnParams = [[P24TrnDirectParams alloc] initWithTransactionParams:trasaction];
  trnParams.sandbox = params[@"isSandbox"];
  trnParams.settings = [P24LibModule settingsFromParams: params[@"settingsParams"]];
  
  dispatch_sync(dispatch_get_main_queue(), ^{
    [P24 startTrnDirect:trnParams inViewController:[P24LibModule rootViewController] delegate:p24Handler];
  });
  
}

RCT_EXPORT_METHOD(startExpressWithParams:(NSDictionary*)params callback:(RCTResponseSenderBlock)callback)
{
  
  if (p24Handler) {
    return;
  }
  
  p24Handler = [P24ProtocolHandler new];
  p24Handler.rctCallback = callback;
  
  P24ExpressParams* express = [[P24ExpressParams alloc] initWithUrl:params[@"url"]];
  express.settings = [P24LibModule settingsFromParams: params[@"settingsParams"]];
  
  dispatch_sync(dispatch_get_main_queue(), ^{
    [P24 startExpress:express inViewController:[P24LibModule rootViewController] delegate:p24Handler];
  });
  
}

+ (P24TransactionParams*) transactionParams: (NSDictionary*) params {
  P24TransactionParams* transaction = [P24TransactionParams new];
  transaction.merchantId = [params[@"merchantId"] intValue];
  transaction.crc = params[@"crc"];
  transaction.sessionId = params[@"sessionId"];
  transaction.address = params[@"address"];
  transaction.amount = [params[@"amount"] intValue];
  transaction.city = params[@"city"];
  transaction.zip = params[@"zip"];
  transaction.client = params[@"client"];
  transaction.country = params[@"country"];
  transaction.language = params[@"language"];
  transaction.currency = params[@"currency"];
  transaction.email = params[@"email"];
  transaction.phone = params[@"phone"];
  transaction.desc = params[@"description"];
  
  if ([params valueForKey:@"passageCart"] != nil) {
    [self setPassageCart:transaction params:params];
  }
  
  return transaction;
}

+ (void) setPassageCart: (P24TransactionParams*) transaction params: (NSDictionary*) params {
  P24PassageCart* passageCart = [P24PassageCart new];
  
  NSArray *items = [params valueForKeyPath:@"passageCart"];
  
  for (int i = 0; i < [items count]; i++) {
    NSDictionary *element = [items objectAtIndex:i];
    
    P24PassageItem* item = [[P24PassageItem alloc] initWithName:[element valueForKey:@"name"]];
    item.desc = [element valueForKey:@"description"];
    item.quantity = [[element valueForKey:@"quantity"] intValue];
    item.price = [[element valueForKey:@"price"] intValue];
    item.number = [[element valueForKey:@"number"] intValue];
    item.targetAmount = [[element valueForKey:@"targetAmount"] intValue];
    item.targetPosId = [[element valueForKey:@"targetPosId"] intValue];
    
    [passageCart addItem:item];
  }
  
  transaction.amount = [[params valueForKey:@"amount"] intValue];
  transaction.passageCart = passageCart;
  
}

+ (void) paymentClosed {
  p24Handler = nil;
  p24 = nil;
}

+ (P24SettingsParams*) settingsFromParams: (NSDictionary*) dictionary {
  P24SettingsParams* settings = [P24SettingsParams new];
  settings.saveBankCredentials = dictionary[@"saveBankCredentials"];
  settings.enableBanksRwd = dictionary[@"enableBanksRwd"];
  return settings;
}

+ (UIViewController*) rootViewController {
  return [[[[UIApplication sharedApplication] delegate] window]rootViewController];
}
@end
