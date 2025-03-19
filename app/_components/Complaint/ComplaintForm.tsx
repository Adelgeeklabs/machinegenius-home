import React, { useState, useEffect } from "react";
import {
  ComplaintTypeEnum,
  IComplaintRequest,
  PriorityTypeEnum,
} from "@/app/_types/complaint";
import { ComplaintService } from "@/app/_services/complaintService";
import { toast } from "react-hot-toast";
import { Upload } from "lucide-react";

export default function ComplaintForm() {
  const [formData, setFormData] = useState<IComplaintRequest>({
    complaintType: ComplaintTypeEnum.General,
    ageinstEmployee: null,
    ageinstDepartment: null,
    title: "",
    complaintDetails: "",
    confidential: false,
    priority: PriorityTypeEnum.Low,
    attachments: null,
  });

  const [employees, setEmployees] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const departments = [
    "hr",
    "content-creation",
    "social-media",
    "administrative",
    "accounting",
    "ceo",
    "video-editing",
    "customer-service",
    "development",
  ];

  // Add state for file upload handling
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    // Fetch employees list
    const fetchEmployees = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/employee/excluding-self?limit=1000`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();
        setEmployees(data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees();
  }, []);

  // Get presigned URL from backend
  async function getPresignedURL(contentType: string, extension: string) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/upload-media`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            files: [
              {
                contentType,
                extension,
              },
            ],
            folder: "Complaint",
          }),
        }
      );
      const json = await res.json();
      if (!json) {
        toast.error("Failed to get upload URL");
        return;
      }

      return json.preSignedURLs[0]; // Return first presigned URL since we're sending one file at a time
    } catch (error) {
      console.error("Error getPresignedURL:", error);
      toast.error("Something went wrong!");
    }
  }

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  // Remove selected file
  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Get file extension and mime type
  const getFileInfo = (filename: string) => {
    const extension = filename?.split(".").pop()?.toLowerCase() || "";
    const mimeTypes: { [key: string]: string } = {
      jpeg: "image/jpeg",
      jpg: "image/jpeg",
      png: "image/png",
      pdf: "application/pdf",
      doc: "application/msword",
      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      mp4: "video/mp4",
      // Add more mime types as needed
    };
    return {
      extension,
      mimeType: mimeTypes[extension] || "application/octet-stream",
    };
  };

  // Upload files using presigned URLs
  const uploadFiles = async () => {
    setIsUploading(true);
    const urls: string[] = [];
    const totalFiles = selectedFiles.length;
    let completedFiles = 0;

    try {
      await Promise.all(
        selectedFiles.map(async (file) => {
          const { extension, mimeType } = getFileInfo(file.name);
          const presignedData = await getPresignedURL(mimeType, extension);

          console.log("Presigned data:", presignedData);

          if (presignedData?.preSignedURL) {
            try {
              const uploadResponse = await fetch(presignedData.preSignedURL, {
                method: "PUT",
                headers: {
                  "Content-Type": mimeType,
                  "Cache-Control": "no-cache, no-store, must-revalidate",
                  "Content-Disposition": "inline",
                },
                body: file,
              });
              console.log("Upload response:", uploadResponse);

              if (uploadResponse.ok) {
                console.log("File uploaded successfully");
                console.log("File URL:", presignedData.mediaUrl);

                urls.push(presignedData.mediaUrl); // Use the URL from the response
                completedFiles++;
                setUploadProgress((completedFiles / totalFiles) * 100);
              } else {
                throw new Error("Upload failed");
              }
            } catch (error) {
              console.error("Error uploading file:", error);
              toast.error(`Failed to upload ${file.name}`);
            }
          }
        })
      );

      return urls;
    } catch (error) {
      console.error("Error in uploadFiles:", error);
      toast.error("Failed to upload files");
      throw error;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let attachmentUrls: string[] | null = null;
      if (selectedFiles.length > 0) {
        attachmentUrls = await uploadFiles();
      }

      await ComplaintService.createComplaint({
        ...formData,
        attachments: attachmentUrls,
      });

      toast.success("Complaint submitted successfully");
      // Reset form
      setFormData({
        complaintType: ComplaintTypeEnum.General,
        ageinstEmployee: null,
        ageinstDepartment: null,
        title: "",
        complaintDetails: "",
        confidential: false,
        priority: PriorityTypeEnum.Low,
        attachments: null,
      });
      setSelectedFiles([]);
    } catch (error) {
      toast.error("Failed to submit complaint");
      console.error("Error submitting complaint:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`space-y-6 max-w-7xl mx-auto max-h-[70vh] overflow-scroll bg-white rounded-lg shadow-md`}
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-10">
          {/* Left Column */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Complaint Type
              </label>
              <select
                value={formData.complaintType}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    complaintType: e.target.value as ComplaintTypeEnum,
                  })
                }
                className="w-full p-3 border bg-transparent border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                {Object.values(ComplaintTypeEnum).map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {formData.complaintType === ComplaintTypeEnum.Employee && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Against Employee
                </label>
                <select
                  value={formData.ageinstEmployee!}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      ageinstEmployee: e.target.value!,
                    })
                  }
                  className="w-full p-3 border bg-transparent border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Employee</option>
                  {employees.map((emp) => (
                    <option key={emp._id} value={emp._id}>
                      {emp.firstName} {emp.lastName}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {formData.complaintType === ComplaintTypeEnum.Department && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Against Department
                </label>
                <select
                  value={formData.ageinstDepartment!}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      ageinstDepartment: e.target.value,
                    })
                  }
                  className="w-full p-3 border bg-transparent border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept?.charAt(0)?.toUpperCase() +
                        dept?.slice(1).replace("-", " ")}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Priority Level
              </label>
              <select
                value={formData.priority}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    priority: e.target.value as PriorityTypeEnum,
                  })
                }
                className="w-full p-3 bg-transparent border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                {Object.values(PriorityTypeEnum).map((priority) => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Complaint Details
              </label>
              <textarea
                value={formData.complaintDetails}
                onChange={(e) =>
                  setFormData({ ...formData, complaintDetails: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={5}
                required
              />
            </div>
          </div>
        </div>

        {/* Add this before the submit button */}
        <div className="space-y-4 mx-auto max-w-2xl">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Attachments
          </label>
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-2 text-gray-500" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500">
                  Images, videos, or documents (Max 10MB each)
                </p>
              </div>
              <input
                id="dropzone-file"
                type="file"
                className="hidden"
                multiple
                onChange={handleFileChange}
                accept="image/*,video/*,.pdf,.doc,.docx"
              />
            </label>
          </div>

          {/* Selected Files List */}
          {selectedFiles.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                Selected Files:
              </h4>
              <ul className="space-y-2">
                {selectedFiles.map((file, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">
                        {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                      {isUploading && (
                        <div className="w-20 h-1 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600 transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-700"
                      disabled={isUploading}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.confidential}
            onChange={(e) =>
              setFormData({ ...formData, confidential: e.target.checked })
            }
            id="confidential"
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
          />
          <label
            className="text-sm font-semibold text-gray-700 cursor-pointer"
            htmlFor="confidential"
          >
            Keep Confidential (Don't send my information to HR)
          </label>
        </div>
        <div className="flex justify-end mt-6">
          <button
            type="submit"
            disabled={isLoading}
            className={`bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200`}
          >
            {isLoading ? (
              <span className="flex items-center space-x-2">
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Submitting...</span>
              </span>
            ) : (
              "Submit Complaint"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
