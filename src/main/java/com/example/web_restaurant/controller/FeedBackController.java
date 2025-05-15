package com.example.web_restaurant.controller;

import com.example.web_restaurant.dto.request.ApiResponse;
import com.example.web_restaurant.dto.request.FeedBackCreationRequest;
import com.example.web_restaurant.dto.request.FeedBackUpdateRequest;
import com.example.web_restaurant.dto.response.FeedBackResponse;
import com.example.web_restaurant.service.FeedBackService;
import com.example.web_restaurant.service.ReplyService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/feedbacks")
@Slf4j
@FieldDefaults( level = AccessLevel.PRIVATE, makeFinal = true)
public class FeedBackController {
    FeedBackService feedBackService;
    ReplyService replyService;

    @PostMapping
    public ApiResponse<FeedBackResponse> createFeedBack(@RequestBody @Valid FeedBackCreationRequest request) {
        return ApiResponse.<FeedBackResponse>builder()
                .result(feedBackService.createFeedBack(request))
                .build();
    }

    @GetMapping
    public ApiResponse<List<FeedBackResponse>> getAllFeedBacks() {
        return ApiResponse.<List<FeedBackResponse>>builder()
                .result(feedBackService.getAllFeedBacks())
                .build();
    }

    @GetMapping("/{userId}")
    public ApiResponse<List<FeedBackResponse>> getAllFeedBacksByUserId(@PathVariable("userId") String userId) {
        return ApiResponse.<List<FeedBackResponse>>builder()
                .result(feedBackService.getAllFeedBacksByUserId(userId))
                .build();
    }

    @GetMapping("/{feedBackId}")
    public ApiResponse<FeedBackResponse> getFeedBackById(@PathVariable("feedBackId") String feedBackId) {
        return ApiResponse.<FeedBackResponse>builder()
                .result(feedBackService.getFeedBackById(feedBackId))
                .build();
    }

    @PutMapping("/{feedBackId}")
    public ApiResponse<FeedBackResponse> updateFeedBack(
            @RequestBody @Valid FeedBackUpdateRequest request, @
            PathVariable("feedBackId") String feedBackId) {
        return ApiResponse.<FeedBackResponse>builder()
                .result(feedBackService.updateFeedBack(feedBackId, request))
                .build();
    }

    @DeleteMapping("/{feedBackId}")
    public ApiResponse<String> deleteFeedBack(@PathVariable("feedBackId") String feedBackId) {
        feedBackService.deleteFeedBack(feedBackId);
        return ApiResponse.<String>builder()
                .result("FeedBack has deleted successfully")
                .build();
    }
}
