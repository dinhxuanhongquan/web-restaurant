package com.example.web_restaurant.service;

import com.example.web_restaurant.dto.request.FeedBackCreationRequest;
import com.example.web_restaurant.dto.request.FeedBackUpdateRequest;
import com.example.web_restaurant.dto.response.FeedBackResponse;
import com.example.web_restaurant.entity.FeedBack;
import com.example.web_restaurant.entity.Reply;
import com.example.web_restaurant.entity.User;
import com.example.web_restaurant.exception.AppException;
import com.example.web_restaurant.exception.ErrorCode;
import com.example.web_restaurant.mapper.FeedBackMapper;
import com.example.web_restaurant.repository.FeedBackRepository;
import com.example.web_restaurant.repository.ReplyRepository;
import com.example.web_restaurant.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;

@RequiredArgsConstructor
@Slf4j
@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FeedBackService {
    FeedBackRepository feedBackRepository;
    UserRepository userRepository;
    ReplyRepository replyRepository;
    FeedBackMapper feedBackMapper;

    public FeedBackResponse createFeedBack(FeedBackCreationRequest request){
        // Get user from the token
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        User user = userRepository.findByUsername(username).orElseThrow(
                () -> new AppException(ErrorCode.USER_NOT_EXISTED)
        );

        FeedBack feedBack = feedBackMapper.toFeedBack(request);

        feedBack.setUser(user);
        try {
            feedBack = feedBackRepository.save(feedBack);
        } catch (DataIntegrityViolationException e) {
            throw new AppException(ErrorCode.FEEDBACK_NOT_CREATED);
        }
        return feedBackMapper.toFeedBackResponse(feedBack);
    }

    public List<FeedBackResponse> getAllFeedBacks(){
        return feedBackRepository.findAll()
                .stream()
                .map(feedBackMapper::toFeedBackResponse)
                .toList();
    }

    public List<FeedBackResponse> getAllFeedBacksByUserId(String userId) {
        return feedBackRepository.findAllByUser_UserId(userId)
                .stream()
                .map(feedBackMapper::toFeedBackResponse)
                .toList();
    }

    public FeedBackResponse getFeedBackById(String feedBackId) {
        return feedBackMapper.toFeedBackResponse(
                feedBackRepository.findById(feedBackId).orElseThrow(
                        () -> new AppException(ErrorCode.FEEDBACK_NOT_EXISTED)
                )
        );
    }

    public FeedBackResponse updateFeedBack(String feedBackId, FeedBackUpdateRequest request) {
        FeedBack feedBack = feedBackRepository.findById(feedBackId).orElseThrow(
                () -> new AppException(ErrorCode.FEEDBACK_NOT_EXISTED)
        );
        feedBackMapper.updateFeedback(feedBack, request);

        return feedBackMapper.toFeedBackResponse(feedBackRepository.save(feedBack));
    }

    public void deleteFeedBack(String feedBackId) {
        FeedBack feedBack = feedBackRepository.findById(feedBackId).orElseThrow(
                () -> new AppException(ErrorCode.FEEDBACK_NOT_EXISTED)
        );
        feedBackRepository.delete(feedBack);
    }

//    Pagination and Sorting
    public List<FeedBackResponse> getFeedBacksWithSorting(String field) {
        return feedBackRepository.findAll(Sort.by(Sort.Direction.ASC, field))
                .stream()
                .map(feedBackMapper::toFeedBackResponse)
                .toList();
    }

    public List<FeedBackResponse> getFeedBacksWithPagination(int offset, int pageSize){
        Page<FeedBack> feedBacks = feedBackRepository.findAll(PageRequest.of(offset, pageSize));
        return feedBacks.stream()
                .map(feedBackMapper::toFeedBackResponse)
                .toList();
    }

    public List<FeedBackResponse> getFeedBacksWithPaginationAndSorting(int offset, int pageSize, String field) {
        Page<FeedBack> feedBacks = feedBackRepository.findAll(PageRequest.of(offset, pageSize).withSort(Sort.by(field)));
        return feedBacks.stream()
                .map(feedBackMapper::toFeedBackResponse)
                .toList();
    }
}
