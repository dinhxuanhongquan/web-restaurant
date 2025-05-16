package com.example.web_restaurant.service;

import com.example.web_restaurant.dto.request.ReplyCreationRequest;
import com.example.web_restaurant.dto.request.ReplyUpdateRequest;
import com.example.web_restaurant.dto.response.ReplyResponse;
import com.example.web_restaurant.entity.Reply;
import com.example.web_restaurant.exception.AppException;
import com.example.web_restaurant.exception.ErrorCode;
import com.example.web_restaurant.mapper.ReplyMapper;
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
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults( level = AccessLevel.PRIVATE, makeFinal = true)
public class ReplyService {
    ReplyRepository replyRepository;
    ReplyMapper replyMapper;
    UserRepository userRepository;
    FeedBackRepository feedBackRepository;

    @Transactional
    public ReplyResponse createReply(ReplyCreationRequest request) {
        Reply reply = replyMapper.toReply(request);

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        reply.setUser(userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED)));

        reply.setFeedBack(feedBackRepository.findById(request.getFeedbackId())
                .orElseThrow(() -> new AppException(ErrorCode.FEEDBACK_NOT_EXISTED)));
        reply.setReplyTime(LocalDateTime.now());
        try {
            reply = replyRepository.save(reply);
        } catch (Exception exception) {
            throw new AppException(ErrorCode.REPLY_NOT_CREATED);
        }
        return replyMapper.toReplyResponse(reply);
    }

    @Transactional(readOnly = true)
    public ReplyResponse getReplyById(String replyId) {
        return replyMapper.toReplyResponse(
                replyRepository.findById(replyId)
                        .orElseThrow(() -> new AppException(ErrorCode.REPLY_NOT_EXISTED))
        );
    }

    @Transactional(readOnly = true)
    @PreAuthorize("hasRole('ADMIN')")
    public List<ReplyResponse> getAllReplies() {
        return replyRepository.findAll()
                .stream()
                .map(replyMapper::toReplyResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    @PreAuthorize("hasRole('ADMIN')")
    public List<ReplyResponse> getAllRepliesByFeedBack(String feedBackId) {
        return replyRepository.findAllByFeedBack_FeedBackId(feedBackId)
                .stream()
                .map(replyMapper::toReplyResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ReplyResponse> getAllRepliesByUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return replyRepository.findAllByUser_Username(username)
                .stream()
                .map(replyMapper::toReplyResponse)
                .toList();
    }

    @Transactional
    @PostAuthorize("returnObject.user.username == authentication.name or hasRole('ADMIN')")
    public ReplyResponse updateReply(String replyId, ReplyUpdateRequest request) {
        Reply reply = replyRepository.findById(replyId)
                .orElseThrow(() -> new AppException(ErrorCode.REPLY_NOT_EXISTED));
        replyMapper.updateReply(reply, request);
        reply.setFeedBack(
                feedBackRepository.findById(request.getFeedbackId())
                        .orElseThrow(() -> new AppException(ErrorCode.FEEDBACK_NOT_EXISTED))
        );
        reply.setReplyTime(LocalDateTime.now());
        try {
            reply = replyRepository.save(reply);
        } catch (Exception exception) {
            throw new AppException(ErrorCode.REPLY_NOT_UPDATED);
        }
        return replyMapper.toReplyResponse(reply);
    }

    @Transactional
    public void deleteReply(String replyId) {
        Reply reply = replyRepository.findById(replyId)
                .orElseThrow(() -> new AppException(ErrorCode.REPLY_NOT_EXISTED));
        try {
            reply.setUser(null);
            reply.setFeedBack(null);
            replyRepository.delete(reply);
        } catch (Exception exception) {
            throw new AppException(ErrorCode.REPLY_NOT_DELETED);
        }
    }

//    Sorting and Pagination
    public List<ReplyResponse> getRepliesWithSorting(String field) {
        return replyRepository.findAll(Sort.by(Sort.Direction.ASC, field))
                .stream()
                .map(replyMapper::toReplyResponse)
                .toList();
    }

    public List<ReplyResponse> getRepliesWithPagination(int offset, int pageSize) {
        Page<Reply> replies = replyRepository.findAll(PageRequest.of(offset, pageSize));
        return replies.stream()
                .map(replyMapper::toReplyResponse)
                .toList();
    }

    public List<ReplyResponse> getRepliesWithSortingAndPagination(int offset, int pageSize, String field) {
        Page<Reply> replies = replyRepository.findAll(PageRequest.of(offset, pageSize).withSort(Sort.by(field)));
        return replies.stream()
                .map(replyMapper::toReplyResponse)
                .toList();
    }
}

