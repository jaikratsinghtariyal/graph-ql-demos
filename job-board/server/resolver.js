import {getCompany } from './db/companies.js';
import { deleteJob } from './db/jobs.js';
import {getJobs, getJob, getJobsByCompany, createJob, updateJob} from './db/jobs.js'
import { GraphQLError } from 'graphql';
import { getUser } from './db/users.js';

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
        // company: (job) =>  getCompany(job.companyId),
        company: (job, _args, {companyLoader}) => companyLoader.load(job.companyId),
    },
    Mutation: {
        createJob: async (_root, { input: {title, description}}, {auth}) => {
            console.log("auth-" + auth);

            if (!auth){
                unauthorixedError("Missing Authentication");
            }
            const user = await getUser(auth.sub);
            // console.log("user===" + user.id)
            const companyId = user.companyId;

            return createJob({companyId, title, description})
        },
        deleteJob: async (_root, {id}, {auth}) => {
            if (!auth){
                unauthorixedError("Missing Authentication. Cant perform this operation.");
            }
            // const job = await getJob(id)
            const user = await getUser(auth.sub);

            // if (!(job.companyId == user.companyId)){
            //     unauthorixedError("Missing Authentication. No permission to delete this job");
            // }
            const job = await deleteJob(id, user.companyId);
            if (!job){
                unauthorixedError("Missing Authentication. Cant delete this job.");
            }

            return job;
        },
        updateJob: async (_root, { input: {id, title, description}, },{auth}) => {
            if (!auth){
                unauthorixedError("Missing Authentication. Cant perform this operation.");
            }
            const user = await getUser(auth.sub);
            const job = await updateJob({id, title, description, companyId: user.companyId});

            if (!job){
                unauthorixedError("Missing Authentication. Cant delete this job.");
            }

            return job;
        },
    },
};

function unauthorixedError (message){
    throw new GraphQLError(message, {
        extensions: {code: "UNAUTHORIZED"},
    });
}

function handleError (message){
    throw new GraphQLError(message, {
        extensions: {code: "NOT_FOUND"},
    });
}
