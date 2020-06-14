package com.hansung.web.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.hansung.web.dao.FollowDao;
import com.hansung.web.dao.UserDao;
import com.hansung.web.dto.ApiResponse;
import com.hansung.web.vo.Follow;
import com.hansung.web.vo.User;

@RestController
@RequestMapping("/api") // 게시판 관련 컨트롤러
public class FollowController {

	@Autowired
	private FollowDao followDao;

	@Autowired
	private UserDao userDao;

	// 팔로우 여부 확인
	@RequestMapping(value = "/follow/{username}/{followname}", method = RequestMethod.GET)
	public ResponseEntity<?> findFollowByUser(@PathVariable("username") String username,
			@PathVariable("followname") String followname) {
		return ResponseEntity.ok().body(followDao.findFollowByUsername(username, followname));
	}
	
	// 구독자 목록
	@RequestMapping(value = "/follows/{username}", method = RequestMethod.GET)
	public ResponseEntity<?> getFollowByUser(@PathVariable("username") String username) {
		return ResponseEntity.ok().body(followDao.findByUsername(username));
	}
	
	// 팔로우 등록
	@RequestMapping(value = "/follow", method = RequestMethod.POST)
	public ResponseEntity<?> createFollow(@RequestBody Map<String, Object> param) {
		String username = (String) param.get("username");
		String followname = (String) param.get("followname");
		User user = userDao.findUserByUsername(followname);
		Follow follow = new Follow(username, followname);
		follow.setUser(user);
		user.getFollows().add(follow);
		userDao.save(user);
		return ResponseEntity.ok().body(followDao.findFollowByUsername(username, followname));
	}

	// 언팔로우
	@RequestMapping(value = "/follow/{followid}", method = RequestMethod.DELETE)
	public ResponseEntity<?> deleteFollow(@PathVariable("followid") int followid) {
		followDao.deleteById(followid);
		return ResponseEntity.ok().body(new ApiResponse(true, "successfully"));
	}

}
