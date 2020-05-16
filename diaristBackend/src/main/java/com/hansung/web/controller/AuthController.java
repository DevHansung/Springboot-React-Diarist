package com.hansung.web.controller;

import java.net.URI;
import java.util.Map;
import java.util.Set;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.hansung.web.dao.BlacklistTokenDao;
import com.hansung.web.dao.RoleDao;
import com.hansung.web.dao.UserDao;
import com.hansung.web.dto.ApiResponse;
import com.hansung.web.dto.JwtAuthenticationResponse;
import com.hansung.web.dto.LoginRequest;
import com.hansung.web.dto.SignUpRequest;
import com.hansung.web.security.CustomUserDetailsService;
import com.hansung.web.security.JwtTokenProvider;
import com.hansung.web.service.RefreshTokenService;
import com.hansung.web.vo.BlacklistToken;
import com.hansung.web.vo.RefreshToken;
import com.hansung.web.vo.Role;
import com.hansung.web.vo.RoleName;
import com.hansung.web.vo.User;

import io.jsonwebtoken.ExpiredJwtException;

@RestController
@RequestMapping("/api/user") // 회원과 관련된 컨트롤러
public class AuthController {

	@Autowired
	AuthenticationManager authenticationManager;

	@Autowired
	UserDao userDao;

	@Autowired
	RoleDao roleDao;

	@Autowired
	PasswordEncoder passwordEncoder;

	@Autowired
	BlacklistTokenDao blacklistTokenDao;

	@Autowired
	JwtTokenProvider tokenProvider;

	@Autowired
	RefreshTokenService refreshTokenService;

	@Autowired
	CustomUserDetailsService customUserDetailsService;

	// 회원가입
	@PostMapping("/register")
	public ResponseEntity<?> registerUser(@Valid @RequestBody SignUpRequest signUpRequest) {
		if (userDao.existsByUsername(signUpRequest.getUsername())) {
			return ResponseEntity.badRequest().body(new ApiResponse(false, "Username is already taken!"));
		}		
		if (userDao.existsByEmail(signUpRequest.getEmail())) {
			return ResponseEntity.badRequest().body(new ApiResponse(false, "Email Address already in use!"));
		}			
		User user = new User(signUpRequest.getName(), signUpRequest.getUsername(), signUpRequest.getEmail(),
				signUpRequest.getPassword());
		user.setPassword(passwordEncoder.encode(user.getPassword()));
		if (signUpRequest.getUsername().equals("ADMIN")) {
			Set<Role> userRole = roleDao.findByName(RoleName.ROLE_TOPADMIN);
			user.setRoles(userRole);
		}
		else if(!signUpRequest.getUsername().equals("ADMIN")) {
			Set<Role> userRole = roleDao.findByName(RoleName.ROLE_USER);
			user.setRoles(userRole);
		}
		User result = userDao.save(user);
		URI location = ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/users/{username}")
				.buildAndExpand(result.getUsername()).toUri();
		return ResponseEntity.created(location).body(new ApiResponse(true, "User registered successfully"));
	}

	// 로그인
	@PostMapping("/login")
	public ResponseEntity<?> loginUser(@Valid @RequestBody LoginRequest loginRequest, RefreshToken refreshToken) {
		String usernameFromDb = null;
		Authentication authentication = authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

		SecurityContextHolder.getContext().setAuthentication(authentication);

		User user = userDao.findByUsername(loginRequest.getUsername()).get();
		// 계정 비활성화시 로그인x(1 equals 비활성화, 0 equals 활성화)
		if (user.getEnabled() == 1) {
			return ResponseEntity.badRequest().body(new ApiResponse(false, "Login error, user disabled"));
		}
		// jwtToken생성
		String jwtRefreshToken = tokenProvider.generateRefreshToken(loginRequest.getUsername());
		String jwtAccessToken = tokenProvider.generateToken(loginRequest.getUsername());
		
		if (refreshTokenService.findByusername(loginRequest.getUsername()) != null) {
			RefreshToken result = refreshTokenService.findByusername(loginRequest.getUsername());
			usernameFromDb = result.getUsername();
			if (loginRequest.getUsername().equals(usernameFromDb)) {
				refreshTokenService.deleteRefreshToken(loginRequest.getUsername());
			}
		}
		// username, refreshToken을  DB 테이블에 넣는다
		refreshToken.setUsername(loginRequest.getUsername());
		refreshToken.setRefreshToken(jwtRefreshToken);
		refreshTokenService.addRefreshToken(refreshToken);
		return ResponseEntity.ok(new JwtAuthenticationResponse(jwtAccessToken, jwtRefreshToken));
	}

	// 로그아웃
	@PostMapping(path = "/logout")
	public ResponseEntity<?> logoutUser(@RequestBody Map<String, String> params) {
		String username = null;
		String refreshToken = params.get("refreshToken");
		Long userId = null;

		if (refreshToken != null) {
			try {
				// refreshToken에서 회원 기본키(id)추출, 추출한 id->userdetail->username 정보 get
				userId = tokenProvider.getUserIdFromJWT(refreshToken); 
				UserDetails userDetails = customUserDetailsService.loadUserById(userId);
				username = userDetails.getUsername();
				// 리프레시토큰 블랙리스트 테이블에 insert
				BlacklistToken blacklistToken = new BlacklistToken();
				blacklistToken.setRefreshToken(refreshToken);
				blacklistToken.setUsername(username);
				blacklistTokenDao.save(blacklistToken);
				// 위의 과정중 문제가 생기더라도 로그아웃은 일단 성공해야한다.
			} catch (IllegalArgumentException e) {
				return ResponseEntity.ok().body(new ApiResponse(true, "successfully"));
			} catch (ExpiredJwtException e) {
				return ResponseEntity.ok().body(new ApiResponse(true, "successfully"));
			}
			// 리프레시토큰이 리프레시토큰 테이블에 있다면 삭제
			if (refreshTokenService.findByusername(username) != null) {
				refreshTokenService.deleteRefreshToken(username);
			}

			return ResponseEntity.ok().body(new ApiResponse(true, "successfully"));
		}
		return ResponseEntity.ok().body(new ApiResponse(true, "successfully"));
	}

	// 회원 탈퇴
	@DeleteMapping(path = "/deleteuser")
	public ResponseEntity<?> deleteUser(@Valid @RequestBody LoginRequest loginRequest) {
		try {
			Authentication authentication = authenticationManager.authenticate(
					new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
			SecurityContextHolder.getContext().setAuthentication(authentication);

			User user = userDao.findByUsername(loginRequest.getUsername()).get();
			userDao.delete(user);
			System.out.println(loginRequest);

			return ResponseEntity.ok().body(new ApiResponse(true, "successfully"));
		} catch (Exception e) {
			System.out.println(loginRequest);
			return ResponseEntity.badRequest().body(new ApiResponse(false, "error"));
		}
	}

	// RefreshToken을 이용하여 AccessTokenToken 재발급
	// 재발급 과정에서 생기는 모든 error는 프론트단에서 즉시 로그아웃 처리됨
	@PostMapping(path = "/refresh")
	public ResponseEntity<?> requestForNewAccessToken(@RequestBody Map<String, String> m) {
		String refreshToken = null;
		String refreshTokenFromDb = null;
		String username = null;
		Long userId = null;
		try {
			refreshToken = m.get("refreshToken");
			try {
				// jwt토큰 유효성 검사 및 회원 기본키(id)추출, 추출한 id->userdetail->username 정보 get
				userId = tokenProvider.getUserIdFromJWT(refreshToken);  
				UserDetails userDetails = customUserDetailsService.loadUserById(userId); 
				username = userDetails.getUsername();
			} catch (IllegalArgumentException e) {
				return ResponseEntity.badRequest().body(new ApiResponse(false, "error"));
			} catch (ExpiredJwtException e) {
				return ResponseEntity.badRequest().body(new ApiResponse(false, "error"));
			}
			if (refreshToken != null) {
				try {
					RefreshToken enabledToken = refreshTokenService.findByusername(username);
					BlacklistToken blackToken = blacklistTokenDao.findByRefreshToken(refreshToken);
					if (enabledToken != null && blackToken == null) {
						// refreshTokenFromDb객체에 현재 사용중인 refreshToken값 담아줌
						refreshTokenFromDb = enabledToken.getRefreshToken();
						// 파라미터값으로 넘어온 토큰과 db에서 조회한 토큰이 일치하는지 재 확인, 유효성검사
						if (refreshToken.equals(refreshTokenFromDb) && !tokenProvider.isTokenExpired(refreshToken)) {
							// 엑세스 토큰의 재발급 경로는 이부분 뿐이다. 다른 경우는 전부 error(로그아웃)처리
							String newAccessToken = tokenProvider.generateToken(username);
							return ResponseEntity.ok(new JwtAuthenticationResponse(newAccessToken, refreshToken));
						} else {
							return ResponseEntity.badRequest().body(new ApiResponse(false, "error"));
						}
					} else {
						return ResponseEntity.badRequest().body(new ApiResponse(false, "error"));
					}
				} catch (IllegalArgumentException e) {
					return ResponseEntity.badRequest().body(new ApiResponse(false, "error"));

				} catch (ExpiredJwtException e) {
					return ResponseEntity.badRequest().body(new ApiResponse(false, "error"));
				}
			} else { 
				return ResponseEntity.badRequest().body(new ApiResponse(false, "error"));
			}
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(new ApiResponse(false, "error"));
		}
	}
}