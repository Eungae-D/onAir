package com.b302.zizon.config;

import com.b302.zizon.domain.user.service.UserService;
import com.b302.zizon.util.jwt.JwtFilter;
import com.b302.zizon.util.kakaoAPI.service.OAuthSuccessHandler;
import com.b302.zizon.util.kakaoAPI.service.OAuthFailHandler;
import com.b302.zizon.util.kakaoAPI.service.PrincipalOauth2UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@EnableWebSecurity // 이거 설정해놓으면 시큐리티가 모든 요청을 막아버림.
@Configuration
// 변경 전에는 WebSecurityConfigurerAdapter 이거 상속받았는데
// 이제는 상속받지 않고 사용함.
public class SecurityConfig{

    private UserService userService;
    @Value("${jwt.secret}")
    private String secretKey;
    private PrincipalOauth2UserService principalOauth2UserService;

    @Autowired
    public SecurityConfig(UserService userService, PrincipalOauth2UserService principalOauth2UserService) {
        this.userService = userService;
        this.principalOauth2UserService = principalOauth2UserService;
    }

    // Single SecurityFilterChain that supports both standard and OAuth2 login
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // common settings
                .httpBasic().disable()
                .csrf().disable()
                .cors().and()
                .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                // jwt filter
                .addFilterBefore(new JwtFilter(userService, secretKey), UsernamePasswordAuthenticationFilter.class)
                // request authorization
                .authorizeRequests()
                .antMatchers("/**").permitAll() // 회원가입과 로그인은 언제나 가능
                .and()
                // oauth2 login
                .oauth2Login()
                .successHandler(new OAuthSuccessHandler())
                .failureHandler(new OAuthFailHandler())
                .userInfoEndpoint().userService(principalOauth2UserService)
                .and();

        return http.build();
    }

}