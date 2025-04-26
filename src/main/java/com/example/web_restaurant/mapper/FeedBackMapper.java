package com.example.web_restaurant.mapper;

import com.example.web_restaurant.dto.request.FeedBackCreationRequest;
import com.example.web_restaurant.dto.request.FeedBackUpdateRequest;
import com.example.web_restaurant.dto.response.FeedBackResponse;
import com.example.web_restaurant.entity.FeedBack;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {UserMapper.class, ReplyMappper.class})
public interface FeedBackMapper {
    FeedBack toFeedBack(FeedBackCreationRequest request);

    FeedBackResponse toFeedBackResponse(FeedBack feedBack);

    @Mapping(target = "userId", ignore = true)
    @Mapping(target = "replies", ignore = true)
    void updateFeedback(FeedBack feedBack, FeedBackUpdateRequest request);

}
