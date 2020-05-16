package com.hansung.web.dao;

import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hansung.web.vo.Role;
import com.hansung.web.vo.RoleName;

@Repository
public interface RoleDao extends JpaRepository<Role, Long> {
    Set<Role> findByName(RoleName roleName);
}