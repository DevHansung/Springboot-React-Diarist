package com.hansung.web.security;

import java.util.Date;
import java.util.function.Function;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.SignatureException;
import io.jsonwebtoken.UnsupportedJwtException;

@Component
public class JwtTokenProvider {

    private static final Logger logger = LoggerFactory.getLogger(JwtTokenProvider.class);

    @Value("${app.jwtSecretKey}")
    private String jwtSecretKey;

    @Value("${app.jwtAccessToken}")
    private int jwtAccessToken;
    
    @Value("${app.jwtRefreshToken}")
    private int jwtRefreshToken;


    @Autowired
    CustomUserDetailsService customUserDetailsService;
    
    public String getUsernameFromToken(String token) {
        return getClaimFromToken(token, Claims::getSubject);
    }
    public Date getExpirationDateFromToken(String token) {
        return getClaimFromToken(token, Claims::getExpiration);
    }
    public <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = getAllClaimsFromToken(token);
        return claimsResolver.apply(claims);
    }
    private Claims getAllClaimsFromToken(String token) {
        return Jwts.parser().setSigningKey(jwtSecretKey).parseClaimsJws(token).getBody();
    }
    //check if the token has expired
    public Boolean isTokenExpired(String token) {
        final Date expiration = getExpirationDateFromToken(token);
        System.out.println(expiration);
        return expiration.before(new Date());
    }
    
    
    //JWT Access token 생성(발급)
    public String generateToken(String username) {
    	//메소드 인자값으로 넘겨받은username를 기반으로
    	//loadUserByUsername를 거쳐 회원정보를 얻은 뒤 최종적으로 userid를 구해서 넘겨줌
        UserPrincipal userPrincipal = customUserDetailsService.loadUserByUsername(username);
        Claims claims = Jwts.claims().setSubject(Long.toString(userPrincipal.getId())); 
        claims.put("username", username);
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtAccessToken * 1000);
        System.out.println("access");
        System.out.println(expiryDate);
        return Jwts.builder() //JWT생성 부분
                .setClaims(claims)
                .setIssuedAt(new Date())
                .setExpiration(expiryDate) //토큰 만료일(생성일자 + 유효기간 = 만료일자)
                .signWith(SignatureAlgorithm.HS512, jwtSecretKey) //인코딩 방식
                .compact();
    }

    //JWT Refresh token 생성(발급)
    public String generateRefreshToken(String username) {
        UserPrincipal userPrincipal = customUserDetailsService.loadUserByUsername(username);
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtRefreshToken * 1000);
        System.out.println(expiryDate);
        return Jwts.builder()
                .setSubject(Long.toString(userPrincipal.getId()))
                .setIssuedAt(new Date())
                .setExpiration(expiryDate)
                .signWith(SignatureAlgorithm.HS512, jwtSecretKey)
                .compact();
    }
    
    //토큰을 를 참조하여 userid를 가져옴
    public Long getUserIdFromJWT(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(jwtSecretKey)
                .parseClaimsJws(token)
                .getBody();
       	System.out.println(claims.getSubject());
        return Long.parseLong(claims.getSubject());
    }

    public boolean validateToken(String authToken) {
        try {
            Jwts.parser().setSigningKey(jwtSecretKey).parseClaimsJws(authToken);
            return true;
        } catch (SignatureException ex) {
            logger.error("Invalid JWT signature");
        } catch (MalformedJwtException ex) {
            logger.error("Invalid JWT token");
        } catch (ExpiredJwtException ex) {
            logger.error("Expired JWT token");
        } catch (UnsupportedJwtException ex) {
            logger.error("Unsupported JWT token");
        } catch (IllegalArgumentException ex) {
            logger.error("JWT claims string is empty.");
        }
        return false;
    }
}
