package com.example.web_restaurant.mapper;

import com.example.web_restaurant.dto.request.FeedBackCreationRequest;
import com.example.web_restaurant.dto.request.FeedBackUpdateRequest;
import com.example.web_restaurant.dto.response.FeedBackResponse;
import com.example.web_restaurant.entity.FeedBack;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring", uses = {UserMapper.class})
public interface FeedBackMapper {
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "dish", ignore = true)
    @Mapping(target = "feedBackTime", ignore = true)
    FeedBack toFeedBack(FeedBackCreationRequest request);

    @Mapping(target = "user", source = "user")
    @Mapping(target = "dish", source = "dish")
    FeedBackResponse toFeedBackResponse(FeedBack feedBack);

    @Mapping(target = "user", ignore = true)
    @Mapping(target = "dish", ignore = true)
    @Mapping(target = "feedBackTime", ignore = true)
    void updateFeedback(@MappingTarget FeedBack feedBack, FeedBackUpdateRequest request);

}
