package com.github.khangnt.ymusic.data.inject;

import javax.inject.Singleton;

import dagger.Component;

/**
 * Created by Khang NT on 1/4/17.
 * Email: khang.neon.1997@gmail.com
 */
@Singleton
@Component(modules = {ContextModule.class})
public interface ComponentInjector extends AppGraph{
}
