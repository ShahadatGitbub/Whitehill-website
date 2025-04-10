import Visitor from '../models/Visitor.js';

export const incrementVisitorCount = async (req, res) => {
  try {
    let visitorDoc = await Visitor.findOne();
    
    if (!visitorDoc) {
      visitorDoc = new Visitor({ count: 1 });
    } else {
      visitorDoc.count += 1;
      visitorDoc.lastUpdated = new Date();
    }

    await visitorDoc.save();

    res.status(200).json({
      success: true,
      count: visitorDoc.count
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error incrementing visitor count',
      error: error.message
    });
  }
};

export const getVisitorCount = async (req, res) => {
  try {
    const visitorDoc = await Visitor.findOne();
    const count = visitorDoc ? visitorDoc.count : 0;

    res.status(200).json({
      success: true,
      count
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching visitor count',
      error: error.message
    });
  }
};