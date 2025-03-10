import React, { useState } from 'react';
import { MessageSquare, Star, Send, ThumbsUp } from 'lucide-react';

interface FeedbackFormData {
  rating: number;
  category: string;
  message: string;
  email: string;
}

const FeedbackScreen: React.FC = () => {
  const [formData, setFormData] = useState<FeedbackFormData>({
    rating: 0,
    category: '',
    message: '',
    email: ''
  });
  const [showConfirmation, setShowConfirmation] = useState(false);

  const categories = [
    'General Feedback',
    'Bug Report',
    'Feature Request',
    'User Experience',
    'Travel Experience',
    'Customer Support'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the feedback to your backend
    console.log('Feedback submitted:', formData);
    setShowConfirmation(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setShowConfirmation(false);
      setFormData({
        rating: 0,
        category: '',
        message: '',
        email: ''
      });
    }, 3000);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-8">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <MessageSquare className="text-purple-600" />
          Send us Feedback
        </h2>
        <p className="text-gray-600 mt-2">
          Your feedback helps us improve our services and provide a better travel experience.
        </p>
      </div>

      {showConfirmation ? (
        <div className="bg-green-50 p-6 rounded-xl text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ThumbsUp className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-green-800 mb-2">Thank You!</h3>
          <p className="text-green-600">
            Your feedback has been submitted successfully. We appreciate your input!
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-xl shadow-sm p-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How would you rate your experience?
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: star })}
                  className="focus:outline-none"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= formData.rating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Message
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
              placeholder="Tell us about your experience..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email (optional)
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
              placeholder="We'll contact you if you need a response"
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Send className="h-4 w-4" />
            Submit Feedback
          </button>
        </form>
      )}
    </div>
  );
};

export default FeedbackScreen;