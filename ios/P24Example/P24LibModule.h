//
//  P24LibModule.h
//  P24Example
//
//  Created by Marek Latuszek on 26/09/2019.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import "P24.h"
#import "P24ProtocolHandler.h"

@interface P24LibModule : NSObject <RCTBridgeModule>

+ (void) paymentClosed;

@end

