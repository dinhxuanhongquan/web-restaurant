package com.example.web_restaurant.repository;

import com.example.web_restaurant.entity.Reply;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ReplyRepository extends JpaRepository<Reply, String> {
    Boolean existsByReplyId(String replyId);


    Optional<Reply> findByReplyId(String replyId);
    Optional<Reply> findAllByFeedBackId(String feedBackId);

}
