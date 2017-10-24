package com.p24example;

import android.app.Activity;
import android.content.Intent;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;

import pl.przelewy24.p24lib.settings.SettingsParams;
import pl.przelewy24.p24lib.transfer.TransferActivity;
import pl.przelewy24.p24lib.transfer.TransferResult;
import pl.przelewy24.p24lib.transfer.direct.TransactionParams;
import pl.przelewy24.p24lib.transfer.direct.TrnDirectParams;
import pl.przelewy24.p24lib.transfer.express.ExpressParams;
import pl.przelewy24.p24lib.transfer.passage.PassageCart;
import pl.przelewy24.p24lib.transfer.passage.PassageItem;
import pl.przelewy24.p24lib.transfer.request.TrnRequestParams;

import static android.app.Activity.RESULT_OK;


/**
 * Created by arekm on 29.08.2016.
 */
public class P24LibModule extends ReactContextBaseJavaModule implements ActivityEventListener {

    private static final int P24_ACTIVITY_CODE = 1001;
    private Promise promise;


    public P24LibModule(ReactApplicationContext reactContext) {
        super(reactContext);

        reactContext.addActivityEventListener(this);
    }

    @Override
    public String getName() {
        return "P24LibModule";
    }

    @ReactMethod
    public void startTrnRequest(ReadableMap trnRequestParams, Promise promise) {
        this.promise = promise;

        TrnRequestParams params = TrnRequestParams.create(trnRequestParams.getString("token"))
                .setSandbox(trnRequestParams.getBoolean("isSandbox"))
                .setSettingsParams(getSettingsParams(trnRequestParams.getMap("settingsParams")));

        Intent intent = TransferActivity.getIntentForTrnRequest(getCurrentActivity(), params);
        getCurrentActivity().startActivityForResult(intent, P24_ACTIVITY_CODE);
    }

    @ReactMethod
    public void startTrnDirect(ReadableMap trnDirectParams, Promise promise) {
        this.promise = promise;

        TrnDirectParams params = TrnDirectParams.create(getPaymentParams(trnDirectParams.getMap("transactionParams")))
                .setSandbox(trnDirectParams.getBoolean("isSandbox"))
                .setSettingsParams(getSettingsParams(trnDirectParams.getMap("settingsParams")));

        Intent intent = TransferActivity.getIntentForTrnDirect(getCurrentActivity(), params);
        getCurrentActivity().startActivityForResult(intent, P24_ACTIVITY_CODE);
    }

    @ReactMethod
    public void startExpress(ReadableMap expressParams, Promise promise) {
        this.promise = promise;

        ExpressParams params = ExpressParams.create(expressParams.getString("url"))
                .setSettingsParams(getSettingsParams(expressParams.getMap("settingsParams")));

        Intent intent = TransferActivity.getIntentForExpress(getCurrentActivity(), params);
        getCurrentActivity().startActivityForResult(intent, P24_ACTIVITY_CODE);
    }

    private TransactionParams getPaymentParams(ReadableMap map) {
        TransactionParams.Builder builder = new TransactionParams.Builder()
                .merchantId(map.getInt("merchantId"))
                .crc(map.getString("crc"))
                .sessionId(map.getString("sessionId"))
                .amount(map.getInt("amount"))
                .currency(map.getString("currency"))
                .description(map.getString("description"))
                .email(map.getString("email"))
                .country(map.getString("country"))
                .client(map.getString("client"))
                .address(map.getString("address"))
                .zip(map.getString("zip"))
                .city(map.getString("city"))
                .phone(map.getString("phone"))
                .language(map.getString("language"));

//                optional
//                .urlStatus(map.getString("urlStatus"))
//                .method(map.getInt("method"))
//                .timeLimit(map.getInt("timeLimit"))
//                .channel(map.getInt("channel"))
//                .transferLabel(map.getString("transferLabel")")
//                .shipping(map.getInt("shipping"))

        if (map.hasKey("passageCart")) {

            ReadableArray items = map.getArray("passageCart");
            PassageCart passageCart = PassageCart.create();

            for (int i = 0; i < items.size(); i++) {
                ReadableMap item = items.getMap(i);
                PassageItem.Builder itemBuilder = new PassageItem.Builder();

                itemBuilder.name(item.getString("name"));
                itemBuilder.description(item.getString("description"));
                itemBuilder.number(item.getInt("number"));
                itemBuilder.price(item.getInt("price"));
                itemBuilder.quantity(item.getInt("quantity"));
                itemBuilder.targetAmount(item.getInt("targetAmount"));
                itemBuilder.targetPosId(item.getInt("targetPosId"));

                passageCart.addItem(itemBuilder.build());
            }

            builder.amount(map.getInt("amount"));
            builder.passageCart(passageCart);
        }

        return builder.build();
    }

    private SettingsParams getSettingsParams(ReadableMap map) {
        SettingsParams settingsParams = new SettingsParams();
        settingsParams.setSaveBankCredentials(map.getBoolean("saveBankCredentials"));
        settingsParams.setReadSmsPasswords(map.getBoolean("readSmsPasswords"));
        settingsParams.setEnableBanksRwd(map.getBoolean("enableBanksRwd"));
        settingsParams.setBanksRwdConfigUrl(map.getString("banksRwdConfigUrl"));
        return settingsParams;
    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        if (requestCode == P24_ACTIVITY_CODE && promise != null) {
            WritableMap map = Arguments.createMap();

            if (resultCode == RESULT_OK) {
                TransferResult result = TransferActivity.parseResult(data);

                if (result.isSuccess()) {
                    map.putBoolean("isSuccess", true);
                } else {
                    map.putString("errorCode", result.getErrorCode());
                }
            } else {
                map.putBoolean("isCanceled", true);
            }

            promise.resolve(map);
        }
    }

    @Override
    public void onNewIntent(Intent intent) {

    }
}
