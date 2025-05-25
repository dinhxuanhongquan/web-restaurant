package com.example.web_restaurant.service;

import com.example.web_restaurant.dto.request.FeedBackCreationRequest;
import com.example.web_restaurant.dto.request.FeedBackUpdateRequest;
import com.example.web_restaurant.dto.response.FeedBackResponse;
import com.example.web_restaurant.entity.FeedBack;
import com.example.web_restaurant.entity.User;
import com.example.web_restaurant.exception.AppException;
import com.example.web_restaurant.exception.ErrorCode;
import com.example.web_restaurant.mapper.FeedBackMapper;
import com.example.web_restaurant.repository.DishRepository;
import com.example.web_restaurant.repository.FeedBackRepository;
import com.example.web_restaurant.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@RequiredArgsConstructor
@Slf4j
@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class FeedBackService {
    FeedBackRepository feedBackRepository;
    UserRepository userRepository;
    DishRepository dishRepository;
    FeedBackMapper feedBackMapper;

    @Transactional
    public FeedBackResponse createFeedBack(FeedBackCreationRequest request){
        FeedBack feedBack = feedBackMapper.toFeedBack(request);
        // Get user from the token
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User user = userRepository.findByUsername(username).orElseThrow(
                () -> new AppException(ErrorCode.USER_NOT_EXISTED)
        );

        feedBack.setDish(
                dishRepository.findById(request.getDishId()).orElseThrow(
                        () -> new AppException(ErrorCode.DISH_NOT_EXISTED)
                )
        );
        feedBack.setUser(user);
        feedBack.setFeedBackTime(LocalDateTime.now());
        try {
            feedBack = feedBackRepository.save(feedBack);
        } catch (DataIntegrityViolationException e) {
            throw new AppException(ErrorCode.FEEDBACK_NOT_CREATED);
        }
        return feedBackMapper.toFeedBackResponse(feedBack);
    }

    @Transactional(readOnly = true)
    @PreAuthorize("hasRole('ADMIN')")
    public List<FeedBackResponse> getAllFeedBacks(){
        return feedBackRepository.findAll()
                .stream()
                .map(feedBackMapper::toFeedBackResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<FeedBackResponse> getAllFeedBacksByUserId() {
        // Get user from the token
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User user = userRepository.findByUsername(username).orElseThrow(
                () -> new AppException(ErrorCode.USER_NOT_EXISTED)
        );
        return feedBackRepository.findAllByUser_UserId(user.getUserId())
                .stream()
                .map(feedBackMapper::toFeedBackResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public FeedBackResponse getFeedBackById(String feedBackId) {
        return feedBackMapper.toFeedBackResponse(
                feedBackRepository.findById(feedBackId).orElseThrow(
                        () -> new AppException(ErrorCode.FEEDBACK_NOT_EXISTED)
                )
        );
    }
    @Transactional(readOnly = true)
    public List<FeedBackResponse> getAllFeedBacksByDishId(String dishId) {
        return feedBackRepository.findAllByDish_DishId(dishId)
                .stream()
                .map(feedBackMapper::toFeedBackResponse)
                .toList();
    }

    @Transactional
    public FeedBackResponse updateFeedBack(String feedBackId, FeedBackUpdateRequest request) {
        FeedBack feedBack = feedBackRepository.findById(feedBackId).orElseThrow(
                () -> new AppException(ErrorCode.FEEDBACK_NOT_EXISTED)
        );
        feedBackMapper.updateFeedback(feedBack, request);
        feedBack.setDish(
                dishRepository.findById(request.getDishId()).orElseThrow(
                        () -> new AppException(ErrorCode.DISH_NOT_EXISTED)
                )
        );
        feedBack.setFeedBackTime(LocalDateTime.now());
        return feedBackMapper.toFeedBackResponse(feedBackRepository.save(feedBack));
    }

    @Transactional
    public void deleteFeedBack(String feedBackId) {
        FeedBack feedBack = feedBackRepository.findById(feedBackId).orElseThrow(
                () -> new AppException(ErrorCode.FEEDBACK_NOT_EXISTED)
        );
        // Set null to User before deleting
        feedBack.setUser(null);
        feedBack.setDish(null);
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
