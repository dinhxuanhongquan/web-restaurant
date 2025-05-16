package com.example.web_restaurant.mapper;

import com.example.web_restaurant.dto.request.ReplyCreationRequest;
import com.example.web_restaurant.dto.request.ReplyUpdateRequest;
import com.example.web_restaurant.dto.response.ReplyResponse;
import com.example.web_restaurant.entity.Reply;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring", uses = {UserMapper.class, FeedBackMapper.class})
public interface ReplyMapper {
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "feedBack", ignore = true)
    @Mapping(target = "replyTime", ignore = true)
    Reply toReply(ReplyCreationRequest request);

    @Mapping(target = "user", source = "user")
    @Mapping(target = "feedBack", source = "feedBack")
    ReplyResponse toReplyResponse(Reply reply);

    @Mapping(target = "user", ignore = true)
    @Mapping(target = "feedBack", ignore = true)
    @Mapping(target = "replyTime", ignore = true)
    void updateReply(@MappingTarget Reply reply, ReplyUpdateRequest request);
}
