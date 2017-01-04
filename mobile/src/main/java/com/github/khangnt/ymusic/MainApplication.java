package com.github.khangnt.ymusic;

import android.app.Application;
import android.content.Context;
import android.os.StrictMode;
import android.support.v4.app.Fragment;

import com.bumptech.glide.Glide;
import com.github.khangnt.ymusic.data.inject.AppGraph;
import com.github.khangnt.ymusic.data.inject.ComponentInjector;
import com.github.khangnt.ymusic.data.inject.ContextModule;
import com.github.khangnt.ymusic.data.inject.DaggerComponentInjector;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;

import java.util.List;

import timber.log.Timber;

/**
 * Created by Khang NT on 1/3/17.
 * Email: khang.neon.1997@gmail.com
 */
public class MainApplication extends Application {
    private static final String TAG = "MainApplication";
    private ComponentInjector componentInjector;

    @Override
    public void onCreate() {
        setupStrictMode();
        super.onCreate();

        componentInjector = DaggerComponentInjector.builder()
                .contextModule(new ContextModule(this))
                .build();

        setupTimber();
        setUpFirebase();
    }

    private void setupStrictMode() {
        if (BuildConfig.DEBUG) {
            StrictMode.setThreadPolicy(new StrictMode.ThreadPolicy.Builder()
                    .detectDiskReads()
                    .detectDiskWrites()
                    .detectAll()
                    .penaltyLog()
                    .build());
            StrictMode.setVmPolicy(new StrictMode.VmPolicy.Builder()
                    .detectLeakedSqlLiteObjects()
                    .detectLeakedClosableObjects()
                    .penaltyLog()
                    .build());
        }
    }

    private void setupTimber() {
        if (BuildConfig.DEBUG) {
            Timber.plant(new Timber.DebugTree());
        }
    }

    @Override
    public void onTrimMemory(int level) {
        super.onTrimMemory(level);
        Glide.with(this).onTrimMemory(level);
    }

    private void setUpFirebase() {
        List<FirebaseApp> apps = FirebaseApp.getApps(this);
        if (apps.isEmpty() || FirebaseApp.getInstance() == null) {
            FirebaseOptions options = FirebaseOptions.fromResource(this);
            FirebaseApp.initializeApp(this, options);
        }
    }

    public static AppGraph getComponentInjector(Context context) {
        return ((MainApplication) context.getApplicationContext()).componentInjector;
    }

    public static AppGraph getComponentInjector(Fragment fragment) {
        return getComponentInjector(fragment.getContext());
    }
}
