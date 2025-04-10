import { subscribers } from "../models/subscribers.js";

export const subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if email already exists
    const existingSubscriber = await subscribers.findOne({ email });
    if (existingSubscriber) {
      return res.status(400).json({
        success: false,
        message: 'This email is already subscribed'
      });
    }

    // Create new subscriber
    const subscriber = new subscribers({
      email
    });

    await subscriber.save();

    res.status(201).json({
      success: true,
      message: 'Successfully subscribed! We\'ll notify you when the site is ready.',
      data: {
        email: subscriber.email,
        subscribedAt: subscriber.subscribedAt
      }
    });
  } catch (error) {
    console.error('Subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while subscribing. Please try again.',
      error: error.message
    });
  }
}

export const getSubscribers = async (req, res) => {
  try {
    const subscribers = await subscribers.find();
    res.status(200).json({
      success: true,
      count: subscribers.length,
      data: subscribers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching subscribers',
      error: error.message
    });
  }
};

// Optional: Function to mark subscribers as notified
export const markAsNotified = async (req, res) => {
  try {
    const updated = await subscribers.updateMany(
      { isNotified: false },
      { isNotified: true }
    );
    res.status(200).json({
      success: true,
      message: 'Subscribers marked as notified',
      data: updated
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating subscribers',
      error: error.message
    });
  }
};