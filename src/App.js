import React, { useState } from 'react';
import useFetchJobs from './useFetchJobs';
import Job from './Job'
import { Container } from 'react-bootstrap';
import JobsPagination from './JobsPagination'
import SearchForm from './SearchForm';

function App() {

    //const [dataList, setDataList] = useState({})
    const [dataList, setDataList] = useState({description: '', location: '', full_time: false});
    const [page, setPage] = useState(1)
    const { jobs, loading, error, hasNextPage } = useFetchJobs(dataList, page)

    function handleDataListChange(e) {
        const params = e.target.name
        const value = e.target.value;

        setPage(1)
        setDataList(prevParam => {
            return { ...prevParam, [params]: value }
        })
    }


    return (
        <Container className='my-4'>
            <h1 className='mb-4'>Find Jobs Here</h1>
            <SearchForm dataList={dataList} onDataListChange={handleDataListChange} />
            <JobsPagination page={page} setPage={setPage} hasNextPage={hasNextPage} />
            {loading && <h1>Loading.....Please wait</h1>}
            {error && <h1>Error. Try Refreshing Again</h1>}
            {jobs.map(job => {
                return <Job key={job.id} job={job} />
            })}
            <JobsPagination page={page} setPage={setPage} hasNextPage={hasNextPage} />
        </Container>
    )
}

export default App;