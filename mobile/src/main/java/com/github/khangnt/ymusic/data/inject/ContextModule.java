package com.github.khangnt.ymusic.data.inject;

import android.content.Context;

import com.github.khangnt.ymusic.data.store.DevicePreferenceStore;
import com.github.khangnt.ymusic.data.store.UserPreferenceStore;

import javax.inject.Singleton;

import dagger.Module;
import dagger.Provides;

@Module
public class ContextModule {

    private Context mContext;

    public ContextModule(Context context) {
        mContext = context.getApplicationContext();
    }

    @Provides
    public Context provideContext() {
        return mContext;
    }

    @Provides
    @Singleton
    public UserPreferenceStore provideUserPrefsStore(Context context) {
        return new UserPreferenceStore(context);
    }

    public DevicePreferenceStore provideDevicePrefsStore(Context context) {
        return new DevicePreferenceStore(context);
    }
}
