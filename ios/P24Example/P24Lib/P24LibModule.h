//
//  P24LibModule.h
//  P24Example
//
//  Created by Arkadiusz Macudziński on 29.08.2016.
//  Copyright © 2016 Facebook. All rights reserved.
//

#import <React/RCTBridgeModule.h>
#import "P24.h"
#import "P24ProtocolHandler.h"

@interface P24LibModule : NSObject<RCTBridgeModule>

+ (void) paymentClosed;

@end
