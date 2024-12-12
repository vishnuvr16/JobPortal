const backendDomain = `${process.env.REACT_APP_API_URL}/api` || "http://localhost:8000/api";

const summaryApi = {
    register: {
        url: `${backendDomain}/auth/register`,
        method: "post"
    },
    login: {
        url: `${backendDomain}/auth/login`,
        method: "post"
    },
    logout: {
        url: `${backendDomain}/auth/logout`,
        method: "post"
    },
    addJob: {
        url: `${backendDomain}/jobs`,
        method: "post"
    },
    getJobs: {
        url: `${backendDomain}/jobs`,
        method: "get"
    },
    deleteJob: {
        url: `${backendDomain}/jobs`,
        method: "delete"
    },
    getJobById: {
        url : `${backendDomain}/jobs`,
        method: "get"
    },
    getProfile: {
        url: `${backendDomain}/auth/profile`,
        method: "get"
    },
    updateProfile: {
        url: `${backendDomain}/auth/profile`,
        method: "put"
    },
    getUserApplications: {
        url: `${backendDomain}/auth/applications`,
        method: "get"
    },
    submitJobApplication: {
        url: `${backendDomain}/jobs`,
        method: "post"
    },
    getFeaturedJobs: {
        url: `${backendDomain}/jobs/featured`,
        method: "get"
    },
    defaultUrl : backendDomain,

    
}

export default summaryApi;