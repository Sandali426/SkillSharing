import { useEffect, useState } from 'react';
     import { getProgressUpdates, createProgressUpdate, deleteProgressUpdate } from '../api/api';
     import { ProgressUpdate } from '../types/types';

     function ProgressUpdates() {
       const [progressUpdates, setProgressUpdates] = useState<ProgressUpdate[]>([]);
       const [newProgressUpdate, setNewProgressUpdate] = useState({ template: 'Basic', content: '' });
       const userId = localStorage.getItem('userId') || 'user1';

       useEffect(() => {
         const fetchUpdates = async () => {
           try {
             const updatesRes = await getProgressUpdates();
             setProgressUpdates(updatesRes.data);
           } catch (error) {
             console.error('Fetch progress updates error:', error);
           }
         };
         fetchUpdates();
       }, []);

       const handleCreateProgressUpdate = async () => {
         try {
           await createProgressUpdate({
             userId,
             template: newProgressUpdate.template,
             content: newProgressUpdate.content,
           });
           const updatesRes = await getProgressUpdates();
           setProgressUpdates(updatesRes.data);
           setNewProgressUpdate({ template: 'Basic', content: '' });
         } catch (error) {
           console.error('Create progress update error:', error);
         }
       };

       const handleDeleteProgressUpdate = async (id: string) => {
         try {
           await deleteProgressUpdate(id);
           setProgressUpdates(progressUpdates.filter((update) => update.id !== id));
         } catch (error) {
           console.error('Delete progress update error:', error);
         }
       };

       return (
         <div className="container">
           <h1 className="title">Progress Updates</h1>

           {/* Create Progress Update */}
           <div className="card">
             <h2 className="section-title">Create Progress Update</h2>
             <select
               value={newProgressUpdate.template}
               onChange={(e) => setNewProgressUpdate({ ...newProgressUpdate, template: e.target.value })}
               className="select"
             >
               <option value="Basic">Basic</option>
               <option value="Detailed">Detailed</option>
             </select>
             <input
               type="text"
               placeholder="Content"
               value={newProgressUpdate.content}
               onChange={(e) => setNewProgressUpdate({ ...newProgressUpdate, content: e.target.value })}
               className="input"
             />
             <button onClick={handleCreateProgressUpdate} className="button">
               Post Update
             </button>
           </div>

           {/* Progress Updates */}
           <h2 className="section-title">Your Progress Updates</h2>
           {progressUpdates.map((update) => (
             <div key={update.id} className="card">
               <p className="meta">Template: {update.template}</p>
               <p className="post-content">{update.content}</p>
               {update.userId === userId && (
                 <button
                   onClick={() => handleDeleteProgressUpdate(update.id)}
                   className="action-link action-link-red"
                 >
                   Delete
                 </button>
               )}
             </div>
           ))}
         </div>
       );
     }

     export default ProgressUpdates;