//
//  P24.h
//  Przelewy24
//
//  Created by Przelewy24 on 08.09.2017.
//  Copyright © 2017 PayPro. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

@interface P24 : NSObject

+ (NSString *) sdkVersion;

@end

@interface P24SdkConfig : NSObject

+ (BOOL) isCertificatePinningEnabled;
+ (void) setCertificatePinningEnabled: (BOOL) isEnabled;

@end



@interface P24PassageItem : NSObject

@property (nonatomic, copy) NSString* name;
@property (nonatomic, copy) NSString* desc;
@property (nonatomic, assign) int quantity;
@property (nonatomic, assign) int price;
@property (nonatomic, assign) int number;
@property (nonatomic, assign) int targetAmount;
@property (nonatomic, assign) int targetPosId;

- (instancetype) initWithName: (NSString*) name;

@end

@interface P24PassageCart : NSObject

@property (nonatomic, strong, readonly) NSArray* items;

- (void) addItem: (P24PassageItem*) item;

@end

@interface P24TransactionParams : NSObject

//required
@property (nonatomic, assign) int merchantId;
@property (nonatomic, copy) NSString *crc;
@property (nonatomic, copy) NSString *sessionId;
@property (nonatomic, assign) int amount;
@property (nonatomic, copy) NSString *currency;
@property (nonatomic, copy) NSString *desc;
@property (nonatomic, copy) NSString *email;
@property (nonatomic, copy) NSString *country;

//optional
@property (nonatomic, copy) NSString *client;
@property (nonatomic, copy) NSString *address;
@property (nonatomic, copy) NSString *zip;
@property (nonatomic, copy) NSString *city;
@property (nonatomic, copy) NSString *phone;
@property (nonatomic, copy) NSString *language;
@property (nonatomic, assign) int method;
@property (nonatomic, copy) NSString *urlStatus;
@property (nonatomic, assign) int timeLimit;
@property (nonatomic, assign) int channel;
@property (nonatomic, assign) int shipping;
@property (nonatomic, copy) NSString *transferLabel;
@property (nonatomic, strong) P24PassageCart* passageCart;

@end

@interface P24TrnRequestParams: NSObject

@property (nonatomic, copy) NSString *token;
@property (nonatomic, assign, readwrite) BOOL sandbox;

- (instancetype)initWithToken:(NSString *)token;

@end

@interface P24TrnDirectParams: NSObject

@property (nonatomic, strong) P24TransactionParams *transactionParams;
@property (nonatomic, assign, readwrite) BOOL sandbox;

- (instancetype)initWithTransactionParams:(P24TransactionParams *)transactionParams;

@end

@interface P24ExpressParams: NSObject

@property (nonatomic, copy) NSString *url;

- (instancetype)initWithUrl:(NSString *)url;

@end

@protocol P24TransferDelegate <NSObject>

@required

- (void)p24TransferOnSuccess;
- (void)p24TransferOnCanceled;
- (void)p24TransferOnError: (NSString*) errorCode;

@end

@interface P24 (Secure)

+ (void)startTrnRequest:(P24TrnRequestParams *)params inViewController:(UIViewController *)parent delegate:(id<P24TransferDelegate>) delegate;

+ (void)startTrnDirect:(P24TrnDirectParams *)params inViewController:(UIViewController *)parent delegate:(id<P24TransferDelegate>) delegate;

+ (void)startExpress:(P24ExpressParams *)params inViewController:(UIViewController *)parent delegate:(id<P24TransferDelegate>) delegate;

@end
