import { getCompany } from './db/companies.js';
import {getJobs, getJob, getJobsByCompany} from './db/jobs.js'
import { GraphQLError } from 'graphql';

export const resolvers = {
    Query: {
        jobs:  () =>  getJobs(),
        job: async (_root, {id}) => {
            const job = await getJob(id);
            if(!job){
                 handleError('No Job Found: - ' + id);
            }
            return job
        },
        company: async (_root, {id})  => {
            const company = await getCompany(id)
            if(!company){
                 handleError('No Company Found: - ' + id);
            }
            return company;
        },
    },

    Company: {
        jobs: (company) => getJobsByCompany(company.id),
    },
    Job: {
        date: (job) =>  job.createdAt.slice(0, 'yyyy-mm-dd'.length),
        company: (job) =>  getCompany(job.companyId),
    },
};

function handleError (message){
    throw new GraphQLError(message, {
        extensions: {code: "NOT_FOUND"},
    });
}
