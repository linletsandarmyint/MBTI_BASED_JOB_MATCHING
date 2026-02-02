 import React, { useEffect, useState } from "react";
 import axios from "axios";
 import { X, Briefcase, CheckCircle, Clock, Slash } from "lucide-react";

 export default function MyApplicationsPage() {
   const [applications, setApplications] = useState([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
     axios
       .get("/jobs/applications/me", {
         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
       })
       .then((res) => {
         setApplications(res.data);
         setLoading(false);
       })
       .catch((err) => {
         console.log(err);
         setLoading(false);
       });
   }, []);

   const getStatusBadge = (status) => {
     if (status === "accepted")
       return (
         <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center gap-1">
           <CheckCircle size={14} /> Accepted
         </span>
       );

     if (status === "rejected")
       return (
         <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full flex items-center gap-1">
           <Slash size={14} /> Rejected
         </span>
       );

     return (
       <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full flex items-center gap-1">
         <Clock size={14} /> Pending
       </span>
     );
   };

   if (loading) {
     return (
       <div className="min-h-screen flex items-center justify-center">
         <div className="text-xl font-semibold">Loading...</div>
       </div>
     );
   }

   return (
     <div className="min-h-screen bg-gray-50">
       <div className="bg-gradient-to-r from-teal-400 to-blue-500 text-white py-12">
         <div className="max-w-6xl mx-auto px-6">
           <h1 className="text-4xl font-bold text-center">My Applications</h1>
           <p className="text-center mt-3 text-lg">
             See all your applied jobs and status.
           </p>
         </div>
       </div>

       <div className="max-w-6xl mx-auto px-6 mt-8">
         {applications.length === 0 ? (
           <div className="bg-white rounded-2xl p-6 shadow">
             <h3 className="text-xl font-semibold">No applications yet</h3>
             <p className="text-gray-500 mt-2">Apply to a job first.</p>
           </div>
         ) : (
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {applications.map((app) => (
               <div
                 key={app._id}
                 className="bg-white rounded-2xl shadow p-5 border border-gray-100"
               >
                 <div className="flex justify-between items-start">
                   <div>
                     <h3 className="text-lg font-semibold">{app.job.title}</h3>
                     <p className="text-sm text-gray-500 mt-1">
                       {app.job.description.slice(0, 120)}...
                     </p>
                   </div>

                   <div>{getStatusBadge(app.status)}</div>
                 </div>

                 <div className="flex items-center justify-between mt-4">
                   <div className="text-sm text-gray-600">
                     <span className="mr-2">📍 {app.job.location}</span>
                     <span className="mr-2">• {app.job.jobType}</span>
                   </div>
                   <button className="flex items-center gap-2 bg-teal-500 text-white px-4 py-2 rounded-2xl hover:bg-teal-600">
                     <Briefcase size={18} />
                     View
                   </button>
                 </div>
               </div>
             ))}
           </div>
         )}
       </div>
     </div>
   );
 }
