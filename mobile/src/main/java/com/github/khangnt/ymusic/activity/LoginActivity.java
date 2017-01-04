package com.github.khangnt.ymusic.activity;

import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v7.app.AppCompatActivity;

import com.github.khangnt.ymusic.R;

/**
 * Created by Khang NT on 1/4/17.
 * Email: khang.neon.1997@gmail.com
 */
public class LoginActivity extends AppCompatActivity {

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);
    }


    //    @Override
//    protected void onCreate(@Nullable Bundle savedInstanceState) {
//        super.onCreate(savedInstanceState);
//        if (FirebaseAuth.getInstance().getCurrentUser() != null) {
//            nextActivity();
//            return;
//        }
//        MainApplication.getYMusicComponent(this).inject(this);
//        setContentView(R.layout.activity_start_up);
//
//        enableLoginButton = true;
//
//        if (savedInstanceState != null) {
//            enableLoginButton = savedInstanceState.getBoolean(ENABLE_LOGIN_BUTTON, true);
//            if (sLoginFlow != null && !enableLoginButton)
//                loginSubscription = sLoginFlow.observeOn(AndroidSchedulers.mainThread()).subscribe(this);
//        } else {
//            sLoginFlow = null;
//        }
//
//        buildGoogleApiClient();
//
//        loginButton = findViewById(R.id.sign_in_button);
//        loadingIndicator = findViewById(R.id.loading_indicator);
//
//        loginButton.setOnClickListener(this);
//
//        updateUiState();
//    }
//
//    private void updateUiState() {
//        loginButton.setVisibility(enableLoginButton ? View.VISIBLE : View.GONE);
//        loadingIndicator.setVisibility(enableLoginButton ? View.GONE : View.VISIBLE);
//    }
//
//    private void nextActivity() {
//        Intent intent = new Intent(this, ExploreActivity.class);
//        startActivity(intent);
//        finish();
//    }
//
//    @Override
//    public void onClick(View view) {
//        enableLoginButton = false;
//        updateUiState();
//        int googlePlayServiceState = GoogleApiAvailability.getInstance().isGooglePlayServicesAvailable(this);
//        if (googlePlayServiceState == ConnectionResult.SUCCESS) {
//            Intent signInIntent = Auth.GoogleSignInApi.getSignInIntent(googleApiClient);
//            startActivityForResult(signInIntent, RC_SIGN_IN);
//        } else {
//            GoogleApiAvailability.getInstance().getErrorDialog(this, googlePlayServiceState, 0).show();
//        }
//    }
//
//    private void buildGoogleApiClient() {
//        GoogleSignInOptions gso = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
//                .requestScopes(new Scope(YouTubeScopes.YOUTUBE), new Scope(Scopes.PROFILE))
//                .requestProfile()
//                .requestEmail()
//                .requestIdToken(getString(R.string.default_web_client_id))
//                .requestServerAuthCode(getString(R.string.default_web_client_id), true)
//                .build();
//
//        googleApiClient = new GoogleApiClient.Builder(this)
//                .enableAutoManage(this, connectionResult -> Timber.d("Google api connect failed: " + connectionResult.getErrorMessage()))
//                .addApi(Auth.GOOGLE_SIGN_IN_API, gso)
//                .build();
//    }
//
//    @Override
//    protected void onSaveInstanceState(Bundle outState) {
//        super.onSaveInstanceState(outState);
//        outState.putBoolean(ENABLE_LOGIN_BUTTON, loginButton.isClickable());
//    }
//
//    @Override
//    protected void onDestroy() {
//        super.onDestroy();
//        if (loginSubscription != null && !loginSubscription.isUnsubscribed())
//            loginSubscription.unsubscribe();
//        loginSubscription = null;
//    }
//
//    @Override
//    public void onActivityResult(int requestCode, int resultCode, Intent data) {
//        super.onActivityResult(requestCode, resultCode, data);
//        if (requestCode == RC_SIGN_IN) {
//            GoogleSignInResult result = Auth.GoogleSignInApi.getSignInResultFromIntent(data);
//            if (result.isSuccess() && result.getSignInAccount() != null) {
//                GoogleSignInAccount signInAccount = result.getSignInAccount();
//                sLoginFlow = getLoginFlow(signInAccount.getId(), signInAccount.getIdToken(), signInAccount.getServerAuthCode())
//                        .cache()
//                        .subscribeOn(Schedulers.newThread())
//                        .observeOn(AndroidSchedulers.mainThread());
//                loginSubscription = sLoginFlow.subscribe(this);
//            } else {
//                Timber.e("Google sign in failed: %s", result.getStatus().getStatusMessage());
//            }
//        }
//    }
//
//    private Observable<AuthResponse> getLoginFlow(String uid, String idToken, String authCode) {
//        return apiService.auth(uid, idToken, authCode)
//                .flatMap(authResponse -> Observable.create(subscriber -> {
//                    FirebaseAuth.getInstance().signInWithCredential(GoogleAuthProvider.getCredential(idToken, null))
//                            .addOnCompleteListener(task -> {
//                                Timber.i("Firebase auth complete: " + task.isSuccessful());
//                                if (task.isSuccessful())
//                                    subscriber.onNext(authResponse);
//                                else {
//                                    Timber.e(task.getException(), "FireBase auth failed.");
//                                    subscriber.onError(task.getException());
//                                }
//                            });
//                }), throwable -> {
//                    Timber.e(throwable, "Login flow step 1 failed.");
//                    return Observable.error(throwable);
//                }, Observable::<AuthResponse>empty);
//    }
//
//    @Override
//    public void onCompleted() {
//        enableLoginButton = true;
//        updateUiState();
//        Timber.d("Login flow completed.");
//    }
//
//    @Override
//    public void onError(Throwable e) {
//        enableLoginButton = true;
//        updateUiState();
//        Timber.e(e, "Login flow failed.");
//        Toast toast = Toast.makeText(this, R.string.login_error_toast, Toast.LENGTH_LONG);
//        toast.setGravity(Gravity.CENTER, 0, 0);
//        toast.show();
//    }
//
//    @Override
//    public void onNext(AuthResponse aBoolean) {
//        Toast.makeText(this, "Login success", Toast.LENGTH_SHORT).show();
//        nextActivity();
//    }
}
