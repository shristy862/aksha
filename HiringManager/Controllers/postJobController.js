import Job from '../modals/jobModal.js';

export const postJob = async (req, res) => {
    const { title, description, location, requirements } = req.body;
    const { companyId } = req.params; 
    const hiringManagerId = req.user.id;

    try {
        const job = new Job({
            title,
            description,
            location,
            requirements,
            companyId,
            hiringManagerId,
        });

        await job.save();

        res.status(201).json({
            message: 'Job posted successfully',
            job: {
                id: job._id,
                title: job.title,
                description: job.description,
                location: job.location,
                requirements: job.requirements,
                createdAt: job.createdAt,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
