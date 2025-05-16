package com.example.web_restaurant.controller;

import com.example.web_restaurant.dto.request.ApiResponse;
import com.example.web_restaurant.dto.request.ReplyCreationRequest;
import com.example.web_restaurant.dto.request.ReplyUpdateRequest;
import com.example.web_restaurant.dto.response.ReplyResponse;
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
@RequestMapping("/replies")
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ReplyController {
    ReplyService replyService;

    @PostMapping
    public ApiResponse<ReplyResponse> replyFeedBack(@RequestBody ReplyCreationRequest request) {
        return ApiResponse.<ReplyResponse>builder()
                .result(replyService.createReply(request))
                .build();
    }

    @GetMapping
    public ApiResponse<List<ReplyResponse>> getAllReplies() {
        return ApiResponse.<List<ReplyResponse>>builder()
                .result(replyService.getAllReplies())
                .build();
    }

    @GetMapping("/feedback/{feedBackId}")
    public ApiResponse<List<ReplyResponse>> getAllReplies(@PathVariable("feedBackId") String feedBackId) {
        return ApiResponse.<List<ReplyResponse>>builder()
                .result(replyService.getAllRepliesByFeedBack(feedBackId))
                .build();
    }

    @GetMapping("/user")
    public ApiResponse<List<ReplyResponse>> getAllRepliesByUser() {
        return ApiResponse.<List<ReplyResponse>>builder()
                .result(replyService.getAllRepliesByUser())
                .build();
    }


    @GetMapping("/{replyId}")
    public ApiResponse<ReplyResponse> getReplyById(@PathVariable("replyId") String replyId) {
        return ApiResponse.<ReplyResponse>builder()
                .result(replyService.getReplyById(replyId))
                .build();
    }

    @PutMapping("/{replyId}")
    public ApiResponse<ReplyResponse> updateReply(
            @RequestBody @Valid ReplyUpdateRequest request,
            @PathVariable("replyId") String replyId) {
        return ApiResponse.<ReplyResponse>builder()
                .result(replyService.updateReply(replyId, request))
                .build();
    }

    @DeleteMapping("/{replyId}")
    public ApiResponse<String> deleteReply(@PathVariable("replyId") String replyId) {
        replyService.deleteReply(replyId);
        return ApiResponse.<String>builder()
                .result("Reply deleted successfully")
                .build();
    }

}
