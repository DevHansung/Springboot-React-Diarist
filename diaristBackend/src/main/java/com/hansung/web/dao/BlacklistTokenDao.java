package com.hansung.web.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hansung.web.vo.BlacklistToken;

@Repository
public interface BlacklistTokenDao extends JpaRepository<BlacklistToken, Long>{
	BlacklistToken findByRefreshToken(String refreshToken);
}
