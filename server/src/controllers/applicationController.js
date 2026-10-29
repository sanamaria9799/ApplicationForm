const mongoose = require('mongoose');
const Application = require('../models/Application');
const { sampleApplications } = require('../seed/seedData');

// Fallback in-memory storage used when MongoDB Atlas is offline or not configured yet
let memoryStore = sampleApplications.map((item, idx) => ({
  _id: `mem_${idx + 1}`,
  ...item,
  applicationDate: new Date(item.applicationDate),
  createdAt: new Date(),
  updatedAt: new Date(),
}));

const isDbConnected = () => mongoose.connection.readyState === 1;

/**
 * @desc   Get all applications (with search, filter, sort)
 * @route  GET /api/applications
 */
const getApplications = async (req, res, next) => {
  try {
    const { search = '', status = '', jobType = '', sort = 'date_desc' } = req.query;

    if (isDbConnected()) {
      const query = {};

      if (status && status !== 'All') {
        query.status = status;
      }

      if (jobType && jobType !== 'All') {
        query.jobType = jobType;
      }

      if (search.trim()) {
        const searchRegex = new RegExp(search.trim(), 'i');
        query.$or = [
          { company: searchRegex },
          { jobTitle: searchRegex },
          { location: searchRegex },
          { notes: searchRegex },
        ];
      }

      let sortOptions = { applicationDate: -1 };
      if (sort === 'date_asc') sortOptions = { applicationDate: 1 };
      if (sort === 'company_asc') sortOptions = { company: 1 };
      if (sort === 'company_desc') sortOptions = { company: -1 };

      const applications = await Application.find(query).sort(sortOptions);

      return res.json({
        success: true,
        count: applications.length,
        data: applications,
        source: 'database',
      });
    }

    // In-memory fallback
    let results = [...memoryStore];

    if (status && status !== 'All') {
      results = results.filter((app) => app.status.toLowerCase() === status.toLowerCase());
    }

    if (jobType && jobType !== 'All') {
      results = results.filter((app) => app.jobType.toLowerCase() === jobType.toLowerCase());
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      results = results.filter(
        (app) =>
          app.company.toLowerCase().includes(q) ||
          app.jobTitle.toLowerCase().includes(q) ||
          app.location.toLowerCase().includes(q) ||
          (app.notes && app.notes.toLowerCase().includes(q))
      );
    }

    if (sort === 'date_desc') {
      results.sort((a, b) => new Date(b.applicationDate) - new Date(a.applicationDate));
    } else if (sort === 'date_asc') {
      results.sort((a, b) => new Date(a.applicationDate) - new Date(b.applicationDate));
    } else if (sort === 'company_asc') {
      results.sort((a, b) => a.company.localeCompare(b.company));
    } else if (sort === 'company_desc') {
      results.sort((a, b) => b.company.localeCompare(a.company));
    }

    return res.json({
      success: true,
      count: results.length,
      data: results,
      source: 'memory-fallback',
      notice: 'Operating in memory mode. Connect MongoDB Atlas via MONGODB_URI to persist permanently.',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get application dashboard statistics
 * @route  GET /api/applications/stats
 */
const getApplicationStats = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      const [total, statusCounts] = await Promise.all([
        Application.countDocuments(),
        Application.aggregate([
          {
            $group: {
              _id: '$status',
              count: { $sum: 1 },
            },
          },
        ]),
      ]);

      const counts = statusCounts.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {});

      const activeApplications = (counts['Applied'] || 0) + (counts['Reviewing'] || 0);
      const interviews = counts['Interview'] || 0;
      const offers = counts['Offer'] || 0;
      const rejected = counts['Rejected'] || 0;

      return res.json({
        success: true,
        stats: {
          totalApplications: total,
          activeApplications,
          interviews,
          offers,
          rejected,
          breakdown: counts,
        },
        source: 'database',
      });
    }

    // In-memory stats
    const total = memoryStore.length;
    const counts = memoryStore.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {});

    const activeApplications = (counts['Applied'] || 0) + (counts['Reviewing'] || 0);
    const interviews = counts['Interview'] || 0;
    const offers = counts['Offer'] || 0;
    const rejected = counts['Rejected'] || 0;

    return res.json({
      success: true,
      stats: {
        totalApplications: total,
        activeApplications,
        interviews,
        offers,
        rejected,
        breakdown: counts,
      },
      source: 'memory-fallback',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get single application by ID
 * @route  GET /api/applications/:id
 */
const getApplicationById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      const application = await Application.findById(id);
      if (!application) {
        return res.status(404).json({ success: false, message: 'Application not found' });
      }
      return res.json({ success: true, data: application });
    }

    const application = memoryStore.find((app) => app._id.toString() === id.toString());
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }
    return res.json({ success: true, data: application });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Create new application
 * @route  POST /api/applications
 */
const createApplication = async (req, res, next) => {
  try {
    const {
      company,
      jobTitle,
      location,
      applicationDate,
      status = 'Applied',
      jobType = 'Full-time',
      jobPostingUrl = '',
      notes = '',
    } = req.body;

    const newAppData = {
      company: company.trim(),
      jobTitle: jobTitle.trim(),
      location: location.trim(),
      applicationDate: applicationDate ? new Date(applicationDate) : new Date(),
      status,
      jobType,
      jobPostingUrl: jobPostingUrl.trim(),
      notes: notes.trim(),
    };

    if (isDbConnected()) {
      const application = await Application.create(newAppData);
      return res.status(201).json({
        success: true,
        message: 'Application created successfully',
        data: application,
      });
    }

    const createdMemoryApp = {
      _id: `mem_${Date.now()}`,
      ...newAppData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    memoryStore.unshift(createdMemoryApp);

    return res.status(201).json({
      success: true,
      message: 'Application created successfully (stored in memory)',
      data: createdMemoryApp,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Update existing application
 * @route  PUT /api/applications/:id
 */
const updateApplication = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      company,
      jobTitle,
      location,
      applicationDate,
      status,
      jobType,
      jobPostingUrl,
      notes,
    } = req.body;

    const updateFields = {};
    if (company !== undefined) updateFields.company = company.trim();
    if (jobTitle !== undefined) updateFields.jobTitle = jobTitle.trim();
    if (location !== undefined) updateFields.location = location.trim();
    if (applicationDate !== undefined) updateFields.applicationDate = new Date(applicationDate);
    if (status !== undefined) updateFields.status = status;
    if (jobType !== undefined) updateFields.jobType = jobType;
    if (jobPostingUrl !== undefined) updateFields.jobPostingUrl = jobPostingUrl.trim();
    if (notes !== undefined) updateFields.notes = notes.trim();

    if (isDbConnected()) {
      const updated = await Application.findByIdAndUpdate(
        id,
        { $set: updateFields },
        { new: true, runValidators: true }
      );

      if (!updated) {
        return res.status(404).json({ success: false, message: 'Application not found' });
      }

      return res.json({
        success: true,
        message: 'Application updated successfully',
        data: updated,
      });
    }

    const index = memoryStore.findIndex((app) => app._id.toString() === id.toString());
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    memoryStore[index] = {
      ...memoryStore[index],
      ...updateFields,
      updatedAt: new Date(),
    };

    return res.json({
      success: true,
      message: 'Application updated successfully (in memory)',
      data: memoryStore[index],
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Delete application
 * @route  DELETE /api/applications/:id
 */
const deleteApplication = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      const deleted = await Application.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Application not found' });
      }
      return res.json({
        success: true,
        message: 'Application deleted successfully',
        data: { id: deleted._id },
      });
    }

    const index = memoryStore.findIndex((app) => app._id.toString() === id.toString());
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    const removed = memoryStore.splice(index, 1)[0];
    return res.json({
      success: true,
      message: 'Application deleted successfully',
      data: { id: removed._id },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Seed or reset sample data
 * @route  POST /api/applications/seed
 */
const seedApplications = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      await Application.deleteMany({});
      const inserted = await Application.insertMany(sampleApplications);
      return res.json({
        success: true,
        message: `Successfully seeded ${inserted.length} applications into MongoDB Atlas`,
        count: inserted.length,
        data: inserted,
      });
    }

    // Reset memory store
    memoryStore = sampleApplications.map((item, idx) => ({
      _id: `mem_${Date.now()}_${idx + 1}`,
      ...item,
      applicationDate: new Date(item.applicationDate),
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    return res.json({
      success: true,
      message: `Reset in-memory store with ${memoryStore.length} sample applications`,
      count: memoryStore.length,
      data: memoryStore,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getApplications,
  getApplicationStats,
  getApplicationById,
  createApplication,
  updateApplication,
  deleteApplication,
  seedApplications,
};
