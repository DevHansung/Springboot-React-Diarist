package com.hansung.web.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hansung.web.dao.RefreshTokenDao;
import com.hansung.web.vo.RefreshToken;

@Service
public class RefreshTokenService {
	@Autowired
	private RefreshTokenDao refreshTokenRepository;

	public List< RefreshToken> getRefreshTokens() {
		return (List< RefreshToken>) refreshTokenRepository.findAll();
	}

	public RefreshToken findByusername(String username) {
		return refreshTokenRepository.findByusername(username);
	}

	public RefreshToken addRefreshToken(RefreshToken refreshToken) {
		return refreshTokenRepository.save(refreshToken);
	}

	public Boolean deleteRefreshToken(String username) {
		final  RefreshToken fetchedToken = refreshTokenRepository.findByusername(username);
		if (fetchedToken == null) {
			return false;
		} else {
			refreshTokenRepository.delete(fetchedToken);
			return true;
		}
	}
}
