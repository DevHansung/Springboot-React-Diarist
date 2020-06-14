package com.hansung.web.dao;

import java.util.Collection;

import javax.transaction.Transactional;

import com.hansung.web.vo.BoardScrap;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface BoardScrapDao extends JpaRepository<BoardScrap, Integer>{
    @Modifying(clearAutomatically = true)
    @Transactional
    @Query(value="Delete from board_scrap where username=?1", nativeQuery=true)
    void deleteScrap(String username);

    @Query(value="Select * from board_scrap where username=?1", nativeQuery=true)
    Collection<BoardScrap> getScrapByUsername(String username);
    
    @Query(value="Select * from board_scrap where boid=?1 and username=?2", nativeQuery=true)
    BoardScrap getScrapByBoid(int boid, String username);
    
    @Query(value="Select bsid from board_scrap where boid=?1 and username=?2", nativeQuery=true)
    int getScrapIdByBoid(int boid, String username);
    
    @Query(value="Select username from board_scrap where boid=?1 and username=?2", nativeQuery=true)
    String getScrapUsernameByBoid(int boid, String username);

    @Query(value="Select * from board_scrap where boid=?1 and username=?2", nativeQuery=true)
    Collection<BoardScrap> getScrapById(int boid, String username);
}