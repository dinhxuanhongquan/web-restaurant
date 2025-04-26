package com.example.web_restaurant.service;

import com.example.web_restaurant.dto.request.ReplyCreationRequest;
import com.example.web_restaurant.dto.request.ReplyUpdateRequest;
import com.example.web_restaurant.dto.response.ReplyResponse;
import com.example.web_restaurant.entity.Reply;
import com.example.web_restaurant.exception.AppException;
import com.example.web_restaurant.exception.ErrorCode;
import com.example.web_restaurant.mapper.ReplyMappper;
import com.example.web_restaurant.repository.FeedBackRepository;
import com.example.web_restaurant.repository.ReplyRepository;
import com.example.web_restaurant.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults( level = AccessLevel.PRIVATE, makeFinal = true)
public class ReplyService {
    ReplyRepository replyRepository;
    ReplyMappper replyMappper;
    UserRepository userRepository;
    FeedBackRepository feedBackRepository;

    public ReplyResponse createReply(ReplyCreationRequest request) {
        Reply reply = replyMappper.toReply(request);
        reply.setUser(userRepository.findById(request.getUserId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED)));
        reply.setFeedBack(feedBackRepository.findById(request.getFeedbackId())
                .orElseThrow(() -> new AppException(ErrorCode.FEEDBACK_NOT_EXISTED)));

        try {
            reply = replyRepository.save(reply);
        } catch (Exception exception) {
            throw new AppException(ErrorCode.REPLY_NOT_CREATED);
        }
        return replyMappper.toReplyResponse(reply);
    }

    public ReplyResponse getReplyById(String replyId) {
        return replyMappper.toReplyResponse(
                replyRepository.findById(replyId)
                        .orElseThrow(() -> new AppException(ErrorCode.REPLY_NOT_EXISTED))
        );
    }
    public List<ReplyResponse> getAllReplies(String feedBackId) {
        return replyRepository.findAllByFeedBackId(feedBackId)
                .stream()
                .map(replyMappper::toReplyResponse)
                .toList();
    }

    public ReplyResponse updateReply(String replyId, ReplyUpdateRequest request) {
        Reply reply = replyRepository.findById(replyId)
                .orElseThrow(() -> new AppException(ErrorCode.REPLY_NOT_EXISTED));
        replyMappper.updateReply(reply, request);
        reply.setFeedBack(feedBackRepository.findById(request.getFeedbackId())
                .orElseThrow(() -> new AppException(ErrorCode.FEEDBACK_NOT_EXISTED)));
        reply.setUser(userRepository.findById(request.getUserId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED)));
        try {
            reply = replyRepository.save(reply);
        } catch (Exception exception) {
            throw new AppException(ErrorCode.REPLY_NOT_UPDATED);
        }
        return replyMappper.toReplyResponse(reply);
    }

    public void deleteReply(String replyId) {
        Reply reply = replyRepository.findById(replyId)
                .orElseThrow(() -> new AppException(ErrorCode.REPLY_NOT_EXISTED));
        try {
            replyRepository.delete(reply);
        } catch (Exception exception) {
            throw new AppException(ErrorCode.REPLY_NOT_DELETED);
        }
    }

//    Sorting and Pagination
    public List<ReplyResponse> getRepliesWithSorting(String field) {
        return replyRepository.findAll(Sort.by(Sort.Direction.ASC, field))
                .stream()
                .map(replyMappper::toReplyResponse)
                .toList();
    }

    public List<ReplyResponse> getRepliesWithPagination(int offset, int pageSize) {
        Page<Reply> replies = replyRepository.findAll(PageRequest.of(offset, pageSize));
        return replies.stream()
                .map(replyMappper::toReplyResponse)
                .toList();
    }

    public List<ReplyResponse> getRepliesWithSortingAndPagination(int offset, int pageSize, String field) {
        Page<Reply> replies = replyRepository.findAll(PageRequest.of(offset, pageSize).withSort(Sort.by(field)));
        return replies.stream()
                .map(replyMappper::toReplyResponse)
                .toList();
    }
}

