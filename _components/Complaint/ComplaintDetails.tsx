import React, { useState } from "react";
import { IComplaint } from "@/app/_types/complaint";
import { ComplaintService } from "@/app/_services/complaintService";
import { toast } from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";

interface ComplaintDetailsProps {
  complaint: IComplaint;
  onUpdate?: () => void;
}

export default function ComplaintDetails({
  complaint,
  onUpdate,
}: ComplaintDetailsProps) {
  const [comment, setComment] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  const handleAddComment = async () => {
    if (!comment?.trim()) return;

    setIsSubmitting(true);
    try {
      await ComplaintService.addComment(complaint._id, comment);
      toast.success("Comment added successfully");
      setComment("");
      onUpdate?.();
    } catch (error) {
      toast.error("Failed to add comment");
      console.error("Error adding comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddFeedback = async () => {
    if (!feedback?.trim()) return;

    setIsSubmittingFeedback(true);
    try {
      await ComplaintService.addFeedback(complaint._id, feedback);
      toast.success("Feedback submitted successfully");
      setFeedback("");
      onUpdate?.();
    } catch (error) {
      toast.error("Failed to submit feedback");
      console.error("Error submitting feedback:", error);
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  return (
    <div className="bg-white relative rounded-lg max-h-[75vh] overflow-y-auto shadow-md">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 px-6 py-6 pb-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {complaint.title}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Submitted{" "}
              {formatDistanceToNow(complaint.dateSubmitted, {
                addSuffix: true,
              })}
            </p>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              complaint.priority === "Urgent"
                ? "bg-red-100 text-red-800"
                : complaint.priority === "High"
                  ? "bg-orange-100 text-orange-800"
                  : complaint.priority === "Medium"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-green-100 text-green-800"
            }`}
          >
            {complaint.priority}
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Details */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-2">Complaint Details</h2>
            <p className="text-gray-700 whitespace-pre-wrap">
              {complaint.complaintDetails}
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">
              Additional Information
            </h2>
            <dl className="space-y-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Type</dt>
                <dd className="text-sm text-gray-900">
                  {complaint.complaintType}
                </dd>
              </div>
              {complaint.ageinstEmployee && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Against Employee
                  </dt>
                  <dd className="text-sm text-gray-900">
                    {complaint.ageinstEmployee.firstName}{" "}
                    {complaint.ageinstEmployee.lastName}
                  </dd>
                </div>
              )}
              {complaint.ageinstDepartment && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Against Department
                  </dt>
                  <dd className="text-sm text-gray-900">
                    {complaint.ageinstDepartment}
                  </dd>
                </div>
              )}
              <div>
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="text-sm text-gray-900">
                  {complaint.complaintStatus}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Feedback Section - Only show when complaint is resolved */}
        {complaint.complaintStatus === "Resolved" && (
          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold mb-2">Feedback</h2>
            {complaint.feedback ? (
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700">{complaint.feedback}</p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Your complaint has been resolved. Please provide your feedback
                  on how it was handled.
                </p>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Share your feedback about how your complaint was handled..."
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
                <button
                  onClick={handleAddFeedback}
                  disabled={isSubmittingFeedback || !feedback?.trim()}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  {isSubmittingFeedback ? "Submitting..." : "Submit Feedback"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Attachments */}
        {complaint.attachments && complaint.attachments.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Attachments</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {complaint.attachments.map((url, index) => (
                <a
                  key={index}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-2">
                    <svg
                      className="w-6 h-6 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                      />
                    </svg>
                    <span className="text-sm text-gray-600">
                      Attachment {index + 1}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Comments */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Comments</h2>
          <div className="space-y-4">
            {complaint.comments?.map((comment) => (
              <div
                key={comment._id}
                className="bg-gray-50 rounded-lg p-4 space-y-2"
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-900">
                    {comment.employee
                      ? `${comment.employee.firstName} ${comment.employee.lastName}`
                      : "Anonymous"}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(comment.createdAt, {
                      addSuffix: true,
                    })}
                  </span>
                </div>
                <p className="text-gray-700">{comment.comment}</p>
              </div>
            ))}

            <div className="mt-4">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
              />
              <button
                onClick={handleAddComment}
                disabled={isSubmitting || !comment?.trim()}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? "Adding..." : "Add Comment"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
