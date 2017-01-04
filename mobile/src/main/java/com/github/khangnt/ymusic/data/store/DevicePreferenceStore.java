package com.github.khangnt.ymusic.data.store;

import android.content.Context;
import android.support.annotation.NonNull;

import net.grandcentrix.tray.TrayPreferences;
import net.grandcentrix.tray.core.TrayStorage;

/**
 * Created by Khang NT on 1/4/17.
 * Email: khang.neon.1997@gmail.com
 */
public class DevicePreferenceStore extends TrayPreferences {
    private static final String TAG = "DevicePreferenceStore";

    public DevicePreferenceStore(@NonNull Context context) {
        super(context, TAG, 1, TrayStorage.Type.DEVICE);
    }

}