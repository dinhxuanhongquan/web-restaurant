package com.example.web_restaurant.mapper;

import com.example.web_restaurant.dto.request.FeedBackCreationRequest;
import com.example.web_restaurant.dto.request.FeedBackUpdateRequest;
import com.example.web_restaurant.dto.response.FeedBackResponse;
import com.example.web_restaurant.entity.FeedBack;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface FeedBackMapper {
    FeedBack toFeedBack(FeedBackCreationRequest request);

    FeedBackResponse toFeedBackResponse(FeedBack feedBack);

    void updateFeedback(FeedBack feedBack, FeedBackUpdateRequest request);

}
