//
//  P24ProtocolHandler.h
//  P24Example
//
//  Created by Arkadiusz Macudziński on 29.08.2016.
//  Copyright © 2016 Facebook. All rights reserved.
//

#import <React/RCTBridgeModule.h>
#import "P24.h"
#import "P24LibModule.h"

@interface P24ProtocolHandler : NSObject<P24TransferDelegate>

@property (strong) RCTResponseSenderBlock rctCallback;



@end
