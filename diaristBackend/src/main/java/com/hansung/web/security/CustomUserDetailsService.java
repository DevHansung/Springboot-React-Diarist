package com.hansung.web.security;

import com.hansung.web.dao.UserDao;
import com.hansung.web.vo.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service //Repository를 통해 db에서 데이터를 가져온 후 컨트롤러에게 전달해주는 클래스
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    UserDao userRepository;

    @Override
    @Transactional //트랜잭션 정상 여부에 따라 Commit, Rollback
    public UserPrincipal loadUserByUsername(String username)
            throws UsernameNotFoundException {
        // username으로 로그인 하게 한다
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> 
                        new UsernameNotFoundException("User not found with username or email : " + username)
        );
        return UserPrincipal.create(user);
    }

    // This method is used by JWTAuthenticationFilter
    @Transactional
    public UserDetails loadUserById(Long id) {
        User user = userRepository.findById(id).orElseThrow(
            () -> new UsernameNotFoundException("User not found with id : " + id)
        );
        return UserPrincipal.create(user);
    }
}