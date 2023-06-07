import { useEffect, useState } from 'react';
import JobList from '../components/JobList';
import { getJobs } from '../lib/graphql/query.js';

// getJobs().then((jobs) => console.log())

function HomePage() {
  const [jobs, setJobs] = useState([]); 
  useEffect(() => {
    // getJobs().then((jobs) => setJobs(jobs))
    getJobs().then(setJobs)

  }, []);

  return (
    <div>
      <h1 className="title">
        Job Board
      </h1>
      <JobList jobs={jobs} />
    </div>
  );
}

export default HomePage;
