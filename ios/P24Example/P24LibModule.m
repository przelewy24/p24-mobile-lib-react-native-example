//
//  P24LibModule.m
//  P24Example
//
//  Created by Marek Latuszek on 26/09/2019.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "P24LibModule.h"
#import <React/RCTLog.h>

@implementation P24LibModule

P24ProtocolHandler* p24Handler;


RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(setCertificatePinningEnabled:(NSNumber * _Nonnull) isEnabled)
{
    [P24SdkConfig setCertificatePinningEnabled:[isEnabled boolValue]];
}

RCT_EXPORT_METHOD(startTrnRequestWithParams:(NSDictionary*)params callback:(RCTResponseSenderBlock)callback)
{

    if (p24Handler) {
        return;
    }

    p24Handler = [P24ProtocolHandler new];
    p24Handler.rctCallback = callback;
    P24TrnRequestParams* trnParams = [[P24TrnRequestParams alloc] initWithToken:params[@"token"]];
    trnParams.sandbox = [params[@"isSandbox"] boolValue];

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
  
  P24TransactionParams* transaction = [P24LibModule transactionParams:params[@"transactionParams"]];
  
  P24TrnDirectParams* trnParams = [[P24TrnDirectParams alloc] initWithTransactionParams:transaction];
  trnParams.sandbox = [params[@"isSandbox"] boolValue];
  
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

    dispatch_sync(dispatch_get_main_queue(), ^{
        [P24 startExpress:express inViewController:[P24LibModule rootViewController] delegate:p24Handler];
    });

}

+ (P24TransactionParams*) transactionParams: (NSDictionary*) params {
    P24TransactionParams* transaction = [P24TransactionParams new];

    // required
    transaction.merchantId = [params[@"merchantId"] intValue];
    transaction.crc = params[@"crc"];
    transaction.sessionId = params[@"sessionId"];
    transaction.amount = [params[@"amount"] intValue];
    transaction.currency = params[@"currency"];
    transaction.desc = params[@"description"];
    transaction.email = params[@"email"];
    transaction.country = params[@"country"];

    // optional
    transaction.client = params[@"client"];
    transaction.address = params[@"address"];
    transaction.zip = params[@"zip"];
    transaction.city = params[@"city"];
    transaction.phone = params[@"phone"];
    transaction.language = params[@"language"];
    transaction.method = [params[@"method"] intValue];
    transaction.urlStatus = params[@"urlStatus"];
    transaction.timeLimit = [params[@"timeLimit"] intValue];
    transaction.channel = [params[@"channel"] intValue];
    transaction.shipping = [params[@"shipping"] intValue];
    transaction.transferLabel = params[@"transferLabel"];

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
}

+ (UIViewController*) rootViewController {
    return [[[[UIApplication sharedApplication] delegate] window]rootViewController];
}

@end
