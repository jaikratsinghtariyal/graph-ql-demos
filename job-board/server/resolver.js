import { getCompany } from './db/companies.js';
import {getJobs, getJob, getJobsByCompany} from './db/jobs.js'

export const resolvers = {
    Query: {
        jobs:  () =>  getJobs(),
        job: (_root, {id}) => getJob(id),
        company: (_root, {id})  => getCompany(id),
    },

    Company: {
        jobs: (company) => getJobsByCompany(company.id),
    },
    Job: {
        date: (job) =>  job.createdAt.slice(0, 'yyyy-mm-dd'.length),
        company: (job) =>  getCompany(job.companyId),
    },
};

