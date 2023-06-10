import { useParams } from 'react-router';
// import { companies } from '../lib/fake-data';
import { useEffect, useState } from 'react';
import { getCompany } from '../lib/graphql/query';
import JobList from '../components/JobList';

function CompanyPage() {
  const { companyId } = useParams();

  // const [company, setCompany] = useState(); 
  const [state, setState] = useState({
    company: null,
    loading: true,
    error: false
  });

  useEffect(() => {
    // getCompany(companyId).then(setCompany)
    (async ()=>{
      try {
        const company = await getCompany(companyId);
        setState({company, loading: false, error: false});
      } catch{
        setState({company: null, loading: false, error: true});
      }
    })();
  }, [companyId]);

  const {company, loading, error } = state;
  if(loading){
    return <div>Loading...</div>
  }
  if(error){
    return <div>Data Not Available</div>
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
