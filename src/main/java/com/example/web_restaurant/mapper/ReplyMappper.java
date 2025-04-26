package com.example.web_restaurant.mapper;

import com.example.web_restaurant.dto.request.ReplyCreationRequest;
import com.example.web_restaurant.dto.request.ReplyUpdateRequest;
import com.example.web_restaurant.dto.response.ReplyResponse;
import com.example.web_restaurant.entity.Reply;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ReplyMappper {
    Reply toReply(ReplyCreationRequest request);

    ReplyResponse toReplyResponse(Reply reply);

    void updateReply(Reply reply, ReplyUpdateRequest request);
}
