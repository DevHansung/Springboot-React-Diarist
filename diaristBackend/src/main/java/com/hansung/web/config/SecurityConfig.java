package com.hansung.web.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.BeanIds;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.hansung.web.security.CustomUserDetailsService;
import com.hansung.web.security.JwtAuthenticationEntryPoint;
import com.hansung.web.security.JwtAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity( // 각종 보안 어노테이션 사용
		securedEnabled = true,
		jsr250Enabled = true,
		prePostEnabled = true
)

public class SecurityConfig extends WebSecurityConfigurerAdapter {

	// user, role 인증을 위해 users detail 가져오기 위함
	@Autowired
	CustomUserDetailsService customUserDetailService;

	// resource에 인증되지 않은 접근 발생시 401 error
	@Autowired
	private JwtAuthenticationEntryPoint unauthorizedHandler;

	// 아래 필터를 통과시키면 jwt토큰에 포함되어있는 userId를 기반으로 권한 등의 정보를 찾아 가져옴
	@Bean
	public JwtAuthenticationFilter JwtAuthenticationFilter() {
		return new JwtAuthenticationFilter();
	}

	// 인증 객체 생성
	// userRepository를 통해 저장된 인증정보를 검색한 후 존재하지 않는다면 exception 반환, 존재한다면 UserDetails 객체 반환
	@Override
	public void configure(AuthenticationManagerBuilder authenticationManagerBuilder) throws Exception {
		authenticationManagerBuilder 
				.userDetailsService(customUserDetailService).passwordEncoder(passwordEncoder()); // 패스워드 암호화
	}

	// 인증을 시도해서 성공하면 authentication 객체 반환, 실패 시 exception 반환
	@Bean(BeanIds.AUTHENTICATION_MANAGER)
	@Override
	public AuthenticationManager authenticationManagerBean() throws Exception {
		return super.authenticationManagerBean();
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http.cors() // Cross Origin Resource Sharing
				.and().csrf().disable() // rest api이므로 csrf 보안이 필요 없으므로 disable 처리
				.exceptionHandling()
				.authenticationEntryPoint(unauthorizedHandler)
				.and().sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS) // jwt token방식 사용으로 세션은 생성안함																									 
				.and().authorizeRequests() // 리퀘스트에 대한 사용권한 체크
				.antMatchers("/", "/favicon.ico", "/**/*.png", "/**/*.gif", "/**/*.svg", "/**/*.jpg", "/**/*.html",
						"/**/*.css", "/**/*.js")
				.permitAll().antMatchers("/api/user/**") // api/user 로 시작하는 경로 누구나 접근가능
				.permitAll().antMatchers("/api/user/checkUsernameAvailability", "/api/user/checkEmailAvailability")
				.permitAll().antMatchers("/api/board/**").permitAll().antMatchers("/api/user/refresh").permitAll()
				.antMatchers("/api/event").permitAll().antMatchers("/api/eventdetail/**").permitAll().anyRequest()
				// 위 경로 누구나 접근가능
				.authenticated(); // 나머지 요청은 모두 인증된 회원만 접근가능

		http.addFilterBefore(JwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);

	}
}