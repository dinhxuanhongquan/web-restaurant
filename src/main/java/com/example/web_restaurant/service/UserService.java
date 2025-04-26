package com.example.web_restaurant.service;

import com.example.web_restaurant.constant.PredefinedRole;
import com.example.web_restaurant.dto.request.UserCreationRequest;
import com.example.web_restaurant.dto.request.UserUpdateRequest;
import com.example.web_restaurant.dto.response.UserResponse;
import com.example.web_restaurant.entity.*;
import com.example.web_restaurant.exception.AppException;
import com.example.web_restaurant.exception.ErrorCode;
import com.example.web_restaurant.mapper.UserMapper;
import com.example.web_restaurant.repository.*;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserService {
    UserRepository userRepository;
    RoleRepository roleRepository;
    FeedBackRepository feedBackRepository;
    ReplyRepository replyRepository;
    BookingRepository bookingRepository;
    UserMapper userMapper;
    PasswordEncoder passwordEncoder;


    public UserResponse createUser(UserCreationRequest request) {
        User user = userMapper.toUser(request);
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        HashSet<Role> roles = new HashSet<>();
        HashSet<FeedBack> feedBacks = new HashSet<>();
        HashSet<Reply> replies = new HashSet<>();
        HashSet<Booking> bookings = new HashSet<>();

        roleRepository.findById(PredefinedRole.EMPLOYEE_ROLE).ifPresent(roles::add);
        feedBackRepository.findById(request.getFeedBacks().toString()).ifPresent(feedBacks::add);
        replyRepository.findById(request.getReplies().toString()).ifPresent(replies::add);
        bookingRepository.findById(request.getBookings().toString()).ifPresent(bookings::add);

        user.setRoles(roles);
        user.setFeedBacks(feedBacks);
        user.setReplies(replies);
        user.setBookings(bookings);

        try{
            user = userRepository.save(user);

        } catch (DataIntegrityViolationException exception){
            throw new AppException(ErrorCode.USER_EXISTED);
        }
        return userMapper.toUserResponse(user);
    }

    public UserResponse getInfo(){
        var context = SecurityContextHolder.getContext();

        String name = context.getAuthentication().getName();

        User user = userRepository.findByUsername(name).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        return userMapper.toUserResponse(user);
    }

    @PreAuthorize("hasRole('ADMIN')")
    public List<UserResponse> getAllUsers(){
        return userRepository.findAll().stream().map(userMapper::toUserResponse).toList();
    }

    @PostAuthorize("returnObject.username == authentication.name")
    public UserResponse getUserById(String userId) {
        return userMapper.toUserResponse(
                userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED))
        );
    }

    @PostAuthorize("returnObject.username == authentication.name")
    public UserResponse update(String userId, UserUpdateRequest request) {
        User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        userMapper.updateUser(user, request);
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        var roles = roleRepository.findAllById(request.getRoles());
        var feedBacks = feedBackRepository.findAllById(request.getFeedBacks());
        var replies = replyRepository.findAllById(request.getReplies());
        var bookings = bookingRepository.findAllById(request.getBookings());

        user.setRoles(new HashSet<>(roles));
        user.setFeedBacks(new HashSet<>(feedBacks));
        user.setReplies(new HashSet<>(replies));
        user.setBookings(new HashSet<>(bookings));
        return userMapper.toUserResponse(
                userRepository.save(user)
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    public void deleteUser(String userId) {
        userRepository.deleteById(userId);
    }
}
