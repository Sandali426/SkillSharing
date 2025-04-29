import { useEffect, useState } from 'react';
     import { getLearningPlans, createLearningPlan, updateLearningPlan, deleteLearningPlan } from '../api/api';
     import { LearningPlan } from '../types/types';

     function LearningPlans() {
       const [learningPlans, setLearningPlans] = useState<LearningPlan[]>([]);
       const [newLearningPlan, setNewLearningPlan] = useState({ title: '', topics: [''], timeline: '' });
       const [editLearningPlanId, setEditLearningPlanId] = useState<string | null>(null);
       const [editLearningPlanForm, setEditLearningPlanForm] = useState({
         title: '',
         topics: [''],
         timeline: '',
       });
       const userId = localStorage.getItem('userId') || 'user1';

       useEffect(() => {
         const fetchPlans = async () => {
           try {
             const plansRes = await getLearningPlans();
             setLearningPlans(plansRes.data);
           } catch (error) {
             console.error('Fetch learning plans error:', error);
           }
         };
         fetchPlans();
       }, []);

       const handleCreateLearningPlan = async () => {
         try {
           await createLearningPlan({
             userId,
             title: newLearningPlan.title,
             topics: newLearningPlan.topics,
             timeline: newLearningPlan.timeline,
           });
           const plansRes = await getLearningPlans();
           setLearningPlans(plansRes.data);
           setNewLearningPlan({ title: '', topics: [''], timeline: '' });
         } catch (error) {
           console.error('Create learning plan error:', error);
         }
       };

       const handleEditLearningPlan = (plan: LearningPlan) => {
         setEditLearningPlanId(plan.id);
         setEditLearningPlanForm({ title: plan.title, topics: plan.topics, timeline: plan.timeline });
       };

       const handleUpdateLearningPlan = async () => {
         try {
           await updateLearningPlan(editLearningPlanId!, {
             title: editLearningPlanForm.title,
             topics: editLearningPlanForm.topics,
             timeline: editLearningPlanForm.timeline,
           });
           const plansRes = await getLearningPlans();
           setLearningPlans(plansRes.data);
           setEditLearningPlanId(null);
           setEditLearningPlanForm({ title: '', topics: [''], timeline: '' });
         } catch (error) {
           console.error('Update learning plan error:', error);
         }
       };

       const handleDeleteLearningPlan = async (id: string) => {
         try {
           await deleteLearningPlan(id);
           setLearningPlans(learningPlans.filter((plan) => plan.id !== id));
         } catch (error) {
           console.error('Delete learning plan error:', error);
         }
       };

       return (
         <div className="container">
           <h1 className="title">Learning Plans</h1>

           {/* Create Learning Plan */}
           <div className="card">
             <h2 className="section-title">Create Learning Plan</h2>
             <input
               type="text"
               placeholder="Title"
               value={newLearningPlan.title}
               onChange={(e) => setNewLearningPlan({ ...newLearningPlan, title: e.target.value })}
               className="input"
             />
             <input
               type="text"
               placeholder="Topic"
               value={newLearningPlan.topics[0]}
               onChange={(e) => setNewLearningPlan({ ...newLearningPlan, topics: [e.target.value] })}
               className="input"
             />
             <input
               type="text"
               placeholder="Timeline"
               value={newLearningPlan.timeline}
               onChange={(e) => setNewLearningPlan({ ...newLearningPlan, timeline: e.target.value })}
               className="input"
             />
             <button onClick={handleCreateLearningPlan} className="button">
               Create Plan
             </button>
           </div>

           {/* Learning Plans */}
           <h2 className="section-title">Your Learning Plans</h2>
           {learningPlans.map((plan) => (
             <div key={plan.id} className="card">
               {editLearningPlanId === plan.id ? (
                 <div>
                   <input
                     type="text"
                     placeholder="Title"
                     value={editLearningPlanForm.title}
                     onChange={(e) =>
                       setEditLearningPlanForm({ ...editLearningPlanForm, title: e.target.value })
                     }
                     className="input"
                   />
                   <input
                     type="text"
                     placeholder="Topic"
                     value={editLearningPlanForm.topics[0]}
                     onChange={(e) =>
                       setEditLearningPlanForm({ ...editLearningPlanForm, topics: [e.target.value] })
                     }
                     className="input"
                   />
                   <input
                     type="text"
                     placeholder="Timeline"
                     value={editLearningPlanForm.timeline}
                     onChange={(e) =>
                       setEditLearningPlanForm({ ...editLearningPlanForm, timeline: e.target.value })
                     }
                     className="input"
                   />
                   <button onClick={handleUpdateLearningPlan} className="button button-green">
                     Save
                   </button>
                   <button
                     onClick={() => setEditLearningPlanId(null)}
                     className="button button-gray"
                   >
                     Cancel
                   </button>
                 </div>
               ) : (
                 <>
                   <p className="plan-content">Title: {plan.title}</p>
                   <p className="meta">Topics: {plan.topics.join(', ')}</p>
                   <p className="meta">Timeline: {plan.timeline}</p>
                   {plan.userId === userId && (
                     <div>
                       <button
                         onClick={() => handleEditLearningPlan(plan)}
                         className="action-link action-link-yellow"
                       >
                         Edit
                       </button>
                       <button
                         onClick={() => handleDeleteLearningPlan(plan.id)}
                         className="action-link action-link-red"
                       >
                         Delete
                       </button>
                     </div>
                   )}
                 </>
               )}
             </div>
           ))}
         </div>
       );
     }

     export default LearningPlans;