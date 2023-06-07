import { useParams } from 'react-router';
// import { companies } from '../lib/fake-data';
import { useEffect, useState } from 'react';
import { getCompany } from '../lib/graphql/query';
import JobList from '../components/JobList';

function CompanyPage() {
  const { companyId } = useParams();

  const [company, setJob] = useState(); 
  useEffect(() => {
    getCompany(companyId).then(setJob)
  }, [companyId]);

  if(!company){
    return <div>Loading...</div>
  }

  // const company = companies.find((company) => company.id === companyId);
  return (
    <div>
      <h1 className="title">
        {company.name}
      </h1>
      <div className="box">
        {company.description}
      </div>
      <h2 >
        Job at {company.name}
      </h2>
      <JobList jobs={company.jobs}/>
    </div>
  );
}

export default CompanyPage;
