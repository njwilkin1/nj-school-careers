type Job = {
  title: string;
  district: string;
  location?: string | null;
  position_type?: string | null;
  date_posted?: string | null;
  closing_date?: string | null;
  applyUrl: string;
  additional_information?: string | null;
};

export default function JobCard({ job }: { job: Job }) {
  return (
    <div className="border rounded-lg p-5 shadow-sm bg-white space-y-3">
      
      {/* TITLE */}
      <h2 className="text-xl font-semibold text-gray-900">
        {job.title}
      </h2>

      {/* DISTRICT */}
      <p className="text-sm text-gray-600">
        {job.district}
      </p>

      {/* META GRID */}
      <div className="grid grid-cols-2 gap-3 text-sm text-gray-700">
        {job.position_type && (
          <p><span className="font-semibold">Type:</span> {job.position_type}</p>
        )}
        {job.date_posted && (
          <p><span className="font-semibold">Posted:</span> {job.date_posted}</p>
        )}
        {job.location && (
          <p><span className="font-semibold">Location:</span> {job.location}</p>
        )}
        {job.closing_date && (
          <p><span className="font-semibold">Closes:</span> {job.closing_date}</p>
        )}
      </div>

      {/* APPLY BUTTON */}
      <div>
        <a
          href={job.applyUrl}
          target="_blank"
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Apply Now
        </a>
      </div>

      {/* ADDITIONAL INFO */}
      {job.additional_information && (
        <details className="mt-3">
          <summary className="cursor-pointer font-medium text-blue-600">
            View Details
          </summary>

          <div className="mt-2 whitespace-pre-line text-sm text-gray-700">
            {job.additional_information}
          </div>
        </details>
      )}
    </div>
  );
}