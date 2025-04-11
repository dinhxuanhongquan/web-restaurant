import React, { useState, useEffect } from 'react';
import './FoodDetail.css';

const FoodDetail = ({ setIsLoginOpen, foodId, onClose, isAdmin = false, user = null }) => {
    const [food, setFood] = useState(null);
    const [loading, setLoading] = useState(true);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [reviews, setReviews] = useState([]);
    const [replyText, setReplyText] = useState({});
    

    // Fetch food data and reviews
    useEffect(() => {
        // In a real application, you would fetch data from an API
        // For now, we'll simulate with setTimeout and mock data
        setTimeout(() => {
            const mockFood = {
                id: foodId,
                name: 'Spaghetti Carbonara',
                description: 'Món mì Ý truyền thống với thịt xông khói, trứng, phô mai Pecorino Romano và nhiều hạt tiêu đen.',
                price: '149.000 VNĐ',
                image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
                ingredients: ['Mì Spaghetti', 'Thịt xông khói', 'Trứng', 'Phô mai Pecorino Romano', 'Tiêu đen', 'Tỏi'],
                nutritionalInfo: {
                    calories: 670,
                    protein: '27g',
                    carbs: '83g',
                    fat: '22g'
                },
                averageRating: 4.7,
                totalReviews: 128
            };

            const mockReviews = [
                {
                    id: 1,
                    userId: 'user123',
                    username: 'NguyenVanA',
                    rating: 5,
                    text: 'Món ăn tuyệt vời! Vị béo ngậy của sốt carbonara kết hợp hoàn hảo với thịt xông khói giòn.',
                    date: '2023-05-15T14:32:00',
                    likes: 12,
                    reply: {
                        text: 'Cảm ơn bạn đã đánh giá! Chúng tôi rất vui khi bạn thích món ăn của chúng tôi.',
                        date: '2023-05-16T10:15:00',
                        by: 'Admin'
                    }
                },
                {
                    id: 2,
                    userId: 'user456',
                    username: 'TranThiB',
                    rating: 4,
                    text: 'Phần ăn lớn và rất ngon. Phô mai thơm phức. Chỉ tiếc là hơi mặn một chút.',
                    date: '2023-05-10T19:45:00',
                    likes: 5,
                    reply: null
                },
                {
                    id: 3,
                    userId: 'user789',
                    username: 'LeDinhC',
                    rating: 5,
                    text: 'Mình ăn nhiều nhà hàng Ý rồi nhưng món carbonara ở đây là ngon nhất. Sẽ quay lại!',
                    date: '2023-04-28T12:15:00',
                    likes: 8,
                    reply: {
                        text: 'Cảm ơn bạn đã ủng hộ! Chúng tôi luôn cố gắng mang đến hương vị Ý đích thực.',
                        date: '2023-04-29T09:30:00',
                        by: 'Admin'
                    }
                }
            ];

            setFood(mockFood);
            setReviews(mockReviews);
            setLoading(false);
        }, 1000);
    }, [foodId]);

    const handleRatingClick = (rate) => {
        setRating(rate);
    };

    const handleLogin = () => {
        // Chuyen trang dang nhap
        setIsLoginOpen(true);

    };

    const handleSubmitReview = (e) => {
        e.preventDefault();
        
        if (!user) {
            alert('Vui lòng đăng nhập để đánh giá món ăn');
            return;
        }
        
        if (rating === 0) {
            alert('Vui lòng chọn số sao đánh giá');
            return;
        }
        
        // Create new review
        const newReview = {
            id: Date.now(),
            userId: user.id || 'tempUser',
            username: user.username || 'Khách',
            rating,
            text: reviewText,
            date: new Date().toISOString(),
            likes: 0,
            reply: null
        };
        
        setReviews([newReview, ...reviews]);
        setRating(0);
        setReviewText('');
        
        // Update average rating
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0) + rating;
        const avgRating = totalRating / (reviews.length + 1);
        setFood({
            ...food,
            averageRating: parseFloat(avgRating.toFixed(1)),
            totalReviews: reviews.length + 1
        });
    };

    const handleReply = (reviewId) => {
        if (!replyText[reviewId]?.trim()) {
            alert('Vui lòng nhập nội dung phản hồi');
            return;
        }
        
        // Add admin reply
        const updatedReviews = reviews.map(review => {
            if (review.id === reviewId) {
                return {
                    ...review,
                    reply: {
                        text: replyText[reviewId],
                        date: new Date().toISOString(),
                        by: 'Admin'
                    }
                };
            }
            return review;
        });
        
        setReviews(updatedReviews);
        setReplyText({
            ...replyText,
            [reviewId]: ''
        });
    };

    const handleLikeReview = (reviewId) => {
        if (!user) {
            alert('Vui lòng đăng nhập để thích đánh giá');
            return;
        }
        
        const updatedReviews = reviews.map(review => {
            if (review.id === reviewId) {
                return {
                    ...review,
                    likes: review.likes + 1
                };
            }
            return review;
        });
        
        setReviews(updatedReviews);
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('vi-VN', options);
    };

    if (loading) {
        return (
            <div className="food-detail-overlay">
                <div className="food-detail-container">
                    <div className="food-detail-loading">Đang tải...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="food-detail-overlay" onClick={onClose}>
            <div className="food-detail-container" onClick={(e) => e.stopPropagation()}>
                <div className="food-detail-header">
                    <h2>{food.name}</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>
                
                <div className="food-detail-content">
                    <div className="food-main-info">
                        <div className="food-image">
                            <img src={food.image} alt={food.name} />
                        </div>
                        <div className="food-info">
                            <div className="food-rating">
                                <div className="stars">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <span 
                                            key={star} 
                                            className={star <= food.averageRating ? 'star filled' : 'star'}
                                        >★</span>
                                    ))}
                                </div>
                                <span className="rating-value">{food.averageRating.toFixed(1)}</span>
                                <span className="review-count">({food.totalReviews} đánh giá)</span>
                            </div>
                            
                            <div className="food-price">{food.price}</div>
                            <div className="food-description">{food.description}</div>
                            
                            <div className="food-ingredients">
                                <h3>Nguyên liệu:</h3>
                                <ul>
                                    {food.ingredients.map((ingredient, index) => (
                                        <li key={index}>{ingredient}</li>
                                    ))}
                                </ul>
                            </div>
                            
                            <div className="food-nutrition">
                                <h3>Thông tin dinh dưỡng:</h3>
                                <div className="nutrition-info">
                                    <div className="nutrition-item">
                                        <span>Calo:</span>
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
                                        <span>Chất béo:</span>
                                        <span>{food.nutritionalInfo.fat}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="food-reviews-section">
                        <h3>Đánh giá và phản hồi</h3>
                        
                        {user ? (
                            <div className="add-review">
                                <h4>Thêm đánh giá của bạn</h4>
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
                                        <span>{rating ? `${rating}/5` : 'Chọn đánh giá'}</span>
                                    </div>
                                    
                                    <div className="review-input">
                                        <textarea 
                                            placeholder="Chia sẻ trải nghiệm của bạn về món ăn này..."
                                            value={reviewText}
                                            onChange={(e) => setReviewText(e.target.value)}
                                            required
                                        ></textarea>
                                    </div>
                                    
                                    <button type="submit" className="submit-review-btn">
                                        Gửi đánh giá
                                    </button>
                                </form>
                            </div>
                        ) : (
                            <div className="login-prompt">
                                <div className="login-btn" onClick={handleLogin}>
                                     Đăng nhập
                                </div>
                            </div>
                        )}
                        
                        <div className="reviews-list">
                            <h4>Tất cả đánh giá ({reviews.length})</h4>
                            
                            {reviews.length > 0 ? (
                                reviews.map(review => (
                                    <div className="review-item" key={review.id}>
                                        <div className="review-header">
                                            <div className="review-user">{review.username}</div>
                                            <div className="review-date">{formatDate(review.date)}</div>
                                        </div>
                                        
                                        <div className="review-rating">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <span 
                                                    key={star} 
                                                    className={star <= review.rating ? 'star filled' : 'star'}
                                                >★</span>
                                            ))}
                                        </div>
                                        
                                        <div className="review-text">{review.text}</div>
                                        
                                        <div className="review-actions">
                                            <button 
                                                className="like-btn"
                                                onClick={() => handleLikeReview(review.id)}
                                            >
                                                <i className="fa fa-thumbs-up"></i> {review.likes}
                                            </button>
                                        </div>
                                        
                                        {review.reply && (
                                            <div className="review-reply">
                                                <div className="reply-header">
                                                    <strong>{review.reply.by}</strong>
                                                    <span className="reply-date">{formatDate(review.reply.date)}</span>
                                                </div>
                                                <div className="reply-text">{review.reply.text}</div>
                                            </div>
                                        )}
                                        
                                        {isAdmin && !review.reply && (
                                            <div className="admin-reply-form">
                                                <textarea 
                                                    placeholder="Viết phản hồi của admin..."
                                                    value={replyText[review.id] || ''}
                                                    onChange={(e) => setReplyText({
                                                        ...replyText,
                                                        [review.id]: e.target.value
                                                    })}
                                                ></textarea>
                                                <button 
                                                    onClick={() => handleReply(review.id)} 
                                                    className="reply-btn"
                                                    disabled={!replyText[review.id]}
                                                >
                                                    Gửi phản hồi
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="no-reviews">Chưa có đánh giá nào cho món ăn này</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FoodDetail;