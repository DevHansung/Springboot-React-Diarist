package com.hansung.web.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hansung.web.vo.RefreshToken;

@Repository
public interface RefreshTokenDao extends JpaRepository<RefreshToken, Long> {
	RefreshToken findByusername(String username);

	RefreshToken save(RefreshToken refreshToken);
}