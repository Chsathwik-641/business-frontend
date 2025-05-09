// export default function InvoiceCard({ invoice, onStatusToggle, onDownload }) {
//   // Check if 'invoice' is undefined or null, return a fallback UI
//   if (!invoice) {
//     return <div>Loading...</div>; // Show loading or fallback content if invoice is undefined
//   }

//   // Destructure the properties from 'invoice' safely after checking if it's defined
//   const {
//     _id,
//     amount,
//     status,
//     dueDate,
//     paidDate,
//     project: { title },
//   } = invoice;

//   return (
//     <div className="bg-white rounded-xl shadow p-4 flex flex-col sm:flex-row sm:items-center justify-between">
//       <div>
//         <h2 className="font-semibold text-lg">{title}</h2>
//         <p>Amount: ${amount}</p>
//         <p>Status: {status}</p>
//         <p>Due: {new Date(dueDate).toLocaleDateString()}</p>
//         {paidDate && <p>Paid: {new Date(paidDate).toLocaleDateString()}</p>}
//       </div>
//       <div className="mt-2 sm:mt-0 flex gap-2">
//         <button
//           className="bg-blue-500 text-white px-4 py-2 rounded"
//           onClick={() => onDownload(_id)}
//         >
//           Download
//         </button>
//         <button
//           className={`${
//             status === "paid" ? "bg-yellow-500" : "bg-green-500"
//           } text-white px-4 py-2 rounded`}
//           onClick={() => onStatusToggle(_id, status)}
//         >
//           Mark as {status === "paid" ? "Unpaid" : "Paid"}
//         </button>
//       </div>
//     </div>
//   );
// }
