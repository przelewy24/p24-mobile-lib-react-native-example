//
//  P24ProtocolHandler.m
//  P24Example
//
//  Created by Arkadiusz Macudziński on 29.08.2016.
//  Copyright © 2016 Facebook. All rights reserved.
//

#import "P24ProtocolHandler.h"

@implementation P24ProtocolHandler

-(void)p24TransferOnCanceled {
  _rctCallback(@[@"", @"isCanceled", [NSNull null]]);
  [P24LibModule paymentClosed];
}

- (void)p24TransferOnSuccess {
  _rctCallback(@[@"isSuccess", [NSNull null], [NSNull null]]);
  [P24LibModule paymentClosed];
}

- (void)p24TransferOnError:(NSString *)errorCode {
  _rctCallback(@[[NSNull null], [NSNull null], errorCode ]);
  [P24LibModule paymentClosed];
}


@end
