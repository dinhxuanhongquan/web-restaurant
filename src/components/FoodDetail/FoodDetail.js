import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FoodDetail.css';

const FoodDetail = ({ setIsLoginOpen, foodId, onClose, isAdmin = false, user = null }) => {
    const [food, setFood] = useState(null);
    const [loading, setLoading] = useState(true);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [reviews, setReviews] = useState([]);
    const [replyText, setReplyText] = useState({});
    const [error, setError] = useState(null);

    // Fetch food data
    useEffect(() => {
        const fetchFoodDetails = async () => {
            try {
                const dishId = foodId || localStorage.getItem('foodId');
                if (!dishId) {
                    setError('No dish ID found');
                    return;
                }
                const response = await axios.get(`http://localhost:8000/restaurant/dishes/${foodId}`);
                if (response.data?.result) {
                    setFood(response.data.result);
                } else {
                    setError('Could not load dish details');
                }
            } catch (error) {
                console.error('Error fetching dish details:', error);
                setError('Failed to load dish details');
            } finally {
                // Continue with feedback loading even if dish fails
                fetchFeedback();
            }
        };

        const fetchFeedback = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/restaurant/feedbacks/dish/${foodId}`);
                if (response.data?.result) {
                    // For each feedback, fetch the replies
                    const feedbacksWithReplies = await Promise.all(
                        response.data.result.map(async (feedback) => {
                            try {
                                const replyResponse = await axios.get(
                                    `http://localhost:8000/restaurant/replies/feedback/${feedback.feedBackId}`
                                );
                                
                                // If there are replies, attach them to the feedback
                                if (replyResponse.data?.result && replyResponse.data.result.length > 0) {
                                    return {
                                        ...feedback,
                                        replies: replyResponse.data.result
                                    };
                                }
                                return feedback;
                            } catch (error) {
                                console.error(`Error fetching replies for feedback ${feedback.feedBackId}:`, error);
                                return feedback; // Return feedback without replies if error
                            }
                        })
                    );
                    setReviews(feedbacksWithReplies);
                }
            } catch (error) {
                console.error('Error fetching feedback:', error);
                setError((prevError) => prevError || 'Failed to load reviews');
            } finally {
                setLoading(false);
            }
        };

        // Start the data loading process
        fetchFoodDetails();
    }, [foodId]);

    const calculateAverageRating = (reviewsList) => {
        if (!reviewsList || reviewsList.length === 0) return 0;
        const sum = reviewsList.reduce((total, review) => total + review.rating, 0);
        return sum / reviewsList.length;
    };

    const handleRatingClick = (rate) => {
        setRating(rate);
    };

    const handleLogin = () => {
        setIsLoginOpen(true);
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        
        if (!user) {
            alert('Please log in to review this dish');
            return;
        }
        
        if (rating === 0) {
            alert('Please select a rating');
            return;
        }
        
        try {
            const token = localStorage.getItem('token');
            const reviewData = {
                feedBackContent: reviewText,
                rating: rating,
                dishId: foodId
            };
            
            const response = await axios.post(
                `http://localhost:8000/restaurant/feedbacks`,
                reviewData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            if (response.data?.result) {
                // Add the new review to the list
                const newReview = response.data.result;
                setReviews([newReview, ...reviews]);
                setRating(0);
                setReviewText('');
                
                // Update the UI to reflect the new review
                const avgRating = calculateAverageRating([...reviews, newReview]);
                setFood({
                    ...food,
                    averageRating: avgRating,
                    totalReviews: reviews.length + 1
                });
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('Failed to submit review. Please try again.');
        }
    };

    const handleReply = async (feedbackId) => {
        console.log("FeedbackId received:", feedbackId); // Debug log
        
        // Validate feedbackId isn't null
        if (!feedbackId) {
            alert('Error: Missing feedback ID');
            return;
        }
        
        if (!replyText[feedbackId]?.trim()) {
            alert('Please enter a reply');
            return;
        }
        
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('You need to be logged in to reply');
                return;
            }
            
            // Make sure the data structure matches what the backend expects
            const replyData = {
                replyContent: replyText[feedbackId],
                feedbackId: feedbackId // Make sure this matches the backend field name
            };
            
            console.log("Sending reply data:", replyData); // Debug log
            
            const response = await axios.post(
                `http://localhost:8000/restaurant/replies`,
                replyData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            console.log("Reply response:", response.data); // Debug log
            
            if (response.data?.result) {
                // Update the reviews with the new reply
                const updatedReviews = reviews.map(review => {
                    if (review.feedBackId === feedbackId) {
                        return {
                            ...review,
                            replies: [...(review.replies || []), response.data.result]
                        };
                    }
                    return review;
                });
                
                setReviews(updatedReviews);
                setReplyText({
                    ...replyText,
                    [feedbackId]: ''
                });
                
                // Success message
                alert('Reply submitted successfully!');
            }
        } catch (error) {
            console.error('Error submitting reply:', error);
            
            // More detailed error logging
            if (error.response) {
                console.error('Response data:', error.response.data);
                console.error('Response status:', error.response.status);
                alert(`Error: ${error.response.data.message || 'Failed to submit reply'}`);
            } else {
                alert('Failed to submit reply. Please try again.');
            }
        }
    };

    const handleLikeReview = (reviewId) => {
        if (!user) {
            alert('Please log in to like reviews');
            return;
        }
        
        // This would be implemented with an API call in a real app
        const updatedReviews = reviews.map(review => {
            if (review.feedBackId === reviewId) {
                return {
                    ...review,
                    likes: (review.likes || 0) + 1
                };
            }
            return review;
        });
        
        setReviews(updatedReviews);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('vi-VN', options);
    };

    if (loading) {
        return (
            <div className="food-detail-overlay">
                <div className="food-detail-container">
                    <div className="food-detail-loading">Loading...</div>
                </div>
            </div>
        );
    }

    if (error || !food) {
        return (
            <div className="food-detail-overlay">
                <div className="food-detail-container">
                    <div className="food-detail-error">
                        <h3>Error loading dish details</h3>
                        <p>{error}</p>
                        <button onClick={onClose}>Close</button>
                    </div>
                </div>
            </div>
        );
    }

    // Calculate average rating and total reviews
    const averageRating = calculateAverageRating(reviews) || food.averageRating || 0;
    const totalReviews = reviews.length;

    return (
        <div className="food-detail-overlay" onClick={onClose}>
            <div className="food-detail-container" onClick={(e) => e.stopPropagation()}>
                <div className="food-detail-header">
                    <h2>{food.dishName}</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>
                
                <div className="food-detail-content">
                    <div className="food-main-info">
                        <div className="food-image">
                            <img src={food.dishImage || 'https://via.placeholder.com/150'} alt={food.dishName} />
                        </div>
                        <div className="food-info">
                            <div className="food-rating">
                                <div className="stars">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <span 
                                            key={star} 
                                            className={star <= averageRating ? 'star filled' : 'star'}
                                        >★</span>
                                    ))}
                                </div>
                                <span className="rating-value">{averageRating.toFixed(1)}</span>
                                <span className="review-count">({totalReviews} reviews)</span>
                            </div>
                            
                            <div className="food-price">{food.dishPrice} VNĐ</div>
                            <div className="food-description">{food.dishDescription}</div>
                            
                            {food.ingredients && (
                                <div className="food-ingredients">
                                    <h3>Ingredients:</h3>
                                    <ul>
                                        {food.ingredients.map((ingredient, index) => (
                                            <li key={index}>{ingredient}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            
                            {food.nutritionalInfo && (
                                <div className="food-nutrition">
                                    <h3>Nutritional Information:</h3>
                                    <div className="nutrition-info">
                                        <div className="nutrition-item">
                                            <span>Calories:</span>
                                            <span>{food.nutritionalInfo.calories}</span>
                                        </div>
                                        <div className="nutrition-item">
                                            <span>Protein:</span>
                                            <span>{food.nutritionalInfo.protein}</span>
                                        </div>
                                        <div className="nutrition-item">
                                            <span>Carbs:</span>
                                            <span>{food.nutritionalInfo.carbs}</span>
                                        </div>
                                        <div className="nutrition-item">
                                            <span>Fat:</span>
                                            <span>{food.nutritionalInfo.fat}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div className="food-reviews-section">
                        <h3>Reviews and Feedback</h3>
                        
                        {user ? (
                            <div className="add-review">
                                <h4>Add Your Review</h4>
                                <form onSubmit={handleSubmitReview}>
                                    <div className="rating-input">
                                        <div className="stars-input">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <span 
                                                    key={star}
                                                    className={`star ${star <= (hoverRating || rating) ? 'filled' : ''}`}
                                                    onClick={() => handleRatingClick(star)}
                                                    onMouseEnter={() => setHoverRating(star)}
                                                    onMouseLeave={() => setHoverRating(0)}
                                                >★</span>
                                            ))}
                                        </div>
                                        <span>{rating ? `${rating}/5` : 'Choose a rating'}</span>
                                    </div>
                                    
                                    <div className="review-input">
                                        <textarea 
                                            placeholder="Share your experience with this dish..."
                                            value={reviewText}
                                            onChange={(e) => setReviewText(e.target.value)}
                                            required
                                        ></textarea>
                                    </div>
                                    
                                    <button type="submit" className="submit-review-btn">
                                        Submit Review
                                    </button>
                                </form>
                            </div>
                        ) : (
                            <div className="login-prompt">
                                <p>Please log in to leave a review</p>
                                <button className="login-btn" onClick={handleLogin}>
                                    Log In
                                </button>
                            </div>
                        )}
                        
                        <div className="reviews-list">
                            <h4>All Reviews ({reviews.length})</h4>
                            
                            {reviews.length > 0 ? (
                                reviews.map(review => (
                                    <div className="review-item" key={review.feedBackId}>
                                        <div className="review-header">
                                            <div className="review-user">{review.user?.firstName + " " + review.user?.lastName || "Anonymous"}</div>
                                            <div className="review-date">{formatDate(review.feedBackTime)}</div>
                                        </div>
                                        
                                        <div className="review-rating">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <span 
                                                    key={star} 
                                                    className={star <= review.rating ? 'star filled' : 'star'}
                                                >★</span>
                                            ))}
                                        </div>
                                        <div className="review-text">{review.feedBackContent}</div>
                                        
                                        <div className="review-actions">
                                            <button 
                                                className="like-btn"
                                                onClick={() => handleLikeReview(review.feedBackId)}
                                            >
                                                <i className="fa fa-thumbs-up"></i> {review.likes || 0}
                                            </button>
                                        </div>
                                        
                                        {review.replies && review.replies.map(reply => (
                                            <div className="review-reply" key={reply.replyId}>
                                                <div className="reply-header">
                                                    <strong>{reply.user?.username || "Admin"}</strong>
                                                    <span className="reply-date">{formatDate(reply.replyTime)}</span>
                                                </div>
                                                <div className="reply-text">{reply.replyContent}</div>
                                            </div>
                                        ))}
                                        
                                        {isAdmin && (!review.replies || review.replies.length === 0) && (
                                            <div className="admin-reply-form">
                                                <textarea 
                                                    placeholder="Write an admin response..."
                                                    value={replyText[review.feedBackId] || ''}
                                                    onChange={(e) => setReplyText({
                                                        ...replyText,
                                                        [review.feedBackId]: e.target.value
                                                    })}
                                                ></textarea>
                                                <button 
                                                    onClick={() => {
                                                        console.log("Reply button clicked, feedBackId:", review.feedBackId);
                                                        handleReply(review.feedBackId);
                                                    }} 
                                                    className="reply-btn"
                                                    disabled={!replyText[review.feedBackId] || !review.feedBackId}
                                                >
                                                    Send Reply
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="no-reviews">No reviews for this dish yet</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FoodDetail;