package com.github.khangnt.ymusic.fragment;

import android.os.Bundle;
import android.support.annotation.Nullable;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import com.github.khangnt.ymusic.R;
import com.trello.rxlifecycle2.components.support.RxFragment;

/**
 * Created by Khang NT on 1/4/17.
 * Email: khang.neon.1997@gmail.com
 */
public class LoginFragment extends RxFragment {
    private static final String TAG = "LoginFragment";

    @Nullable
    @Override
    public View onCreateView(LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_login, container, false);

        return view;
    }
}
