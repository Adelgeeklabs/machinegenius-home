"use client";
import React, { useState, useContext, useEffect } from "react";
import { globalContext } from "@/app/_context/store";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  Search,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  X,
  Clock,
  MessageCircle,
  User,
  Tag,
} from "lucide-react";
import { backIcon, notFoundIcon } from "@/app/_utils/svgIcons";
import { truncateText } from "@/app/_utils/text";
import ViewQuestionModel from "@/app/(authPaths)/hr/faq/_components/ViewQuestionModel/ViewQuestionModel";
import TrendingQuestions from "@/app/(authPaths)/hr/faq/_components/TrendingQuestions/TrendingQuestions";
import LikeDislike from "./_components/LikeDislike";
import CustomBtn from "@/app/_components/Button/CustomBtn";

export interface IQuestion {
  _id: string;
  question: string;
  answer: string;
  likes: number;
  liker: string[];
  unLiker: string[];
  likerCount?: number;
  dislikerCount?: number;
}

interface ICategoryTag {
  _id: string;
  tag: string;
}

export interface ICategory {
  _id: string;
  name: string;
  questions: IQuestion[];
  categoryTag: ICategoryTag[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  description?: string;
}

interface IUserQuestion {
  _id: string;
  question: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  __v: number;
}

interface ModalProps {
  show: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ show, onClose, title, children }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-1/2">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

const FAQ = () => {
  const router = useRouter();
  const { handleSignOut, authState } = useContext(globalContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingGetUserQuestion, setIsLoadingGetUserQuestion] =
    useState(false);
  const [isLoadingDeleteUserQuestion, setIsLoadingDeleteUserQuestion] =
    useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [showNewQuestionModal, setShowNewQuestionModal] = useState(false);
  const [newQuestion, setNewQuestion] = useState<string>("");
  const [isLoadingAddNewQuestion, setIsLoadingAddNewQuestion] = useState(false);
  const [selectedUserQuestionId, setSelectedUserQuestionId] =
    useState<string>();
  const [userQuestions, setUserQuestions] = useState<IUserQuestion[]>([]);

  const [viewingQuestionId, setViewingQuestionId] = useState<string | null>(
    null
  );
  const [uniqueTags, setUniqueTags] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isLoadingTags, setIsLoadingTags] = useState(true);

  const extractUniqueTags = (categories: ICategory[]) => {
    const tagSet = new Set<string>();
    categories.forEach((category) => {
      category.categoryTag.forEach((tag) => {
        tagSet.add(tag.tag);
      });
    });
    return Array.from(tagSet);
  };

  const filteredCategories = categories.filter((category) => {
    const matchesSearch =
      category.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
      category.questions.some(
        (q) =>
          q.question?.toLowerCase().includes(searchQuery?.toLowerCase()) ||
          q.answer?.toLowerCase().includes(searchQuery?.toLowerCase())
      );

    if (!selectedTag) return matchesSearch;

    return (
      matchesSearch &&
      category.categoryTag.some((tag) => tag.tag === selectedTag)
    );
  });

  const toggleCategory = (categoryId: string) => {
    setActiveCategory(activeCategory === categoryId ? null : categoryId);
  };

  const handleAddQuestion = async () => {
    if (isLoadingAddNewQuestion) {
      return;
    }
    if (!newQuestion?.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }

    setIsLoadingAddNewQuestion(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/faq/question`,
        {
          method: "POST",
          body: JSON.stringify({
            question: newQuestion,
          }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${
              typeof window !== "undefined"
                ? localStorage.getItem("token")
                : authState.token
            }`,
          },
        }
      );
      if (res.status === 401) {
        handleSignOut();
      }
      //   const json = await res.json();
      if (res.ok) {
        toast.success("Question saved successfully!");
        setNewQuestion("");
        setShowNewQuestionModal(false);
      } else {
        toast.error("Failed to save question!");
      }
    } catch (error) {
      toast.error("Failed to save question!");
      console.error("Failed to save question!:", error);
    } finally {
      setIsLoadingAddNewQuestion(false);
    }
  };

  const getAllCategories = async () => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    setIsLoadingTags(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/faq/categories`,
        {
          headers: {
            Authorization: `bearer ${
              typeof window !== "undefined"
                ? localStorage.getItem("token")
                : authState.token
            }`,
          },
        }
      );
      if (res.status === 401) {
        handleSignOut();
        return;
      }
      if (!res.ok && res.status !== 401) {
        throw new Error("Failed to get categories");
      }
      const data: ICategory[] = await res.json();
      setCategories(data);
      // Extract and set unique tags
      const tags = extractUniqueTags(data);
      setUniqueTags(tags);
    } catch (error) {
      console.error("Failed to get categories:", error);
      toast.error("Failed to get categories");
    } finally {
      setIsLoading(false);
      setIsLoadingTags(false);
    }
  };

  const getAllUserQuestions = async () => {
    if (isLoadingGetUserQuestion) {
      return;
    }
    setIsLoadingGetUserQuestion(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/faq/question`,

        {
          headers: {
            Authorization: `bearer ${
              typeof window !== "undefined"
                ? localStorage.getItem("token")
                : authState.token
            }`,
          },
        }
      );
      if (res.status === 401) {
        handleSignOut();
        return;
      }
      if (!res.ok && res.status !== 401) {
        throw new Error("Failed to get user questions");
      }
      const data: IUserQuestion[] = await res.json();
      if (data) {
        setUserQuestions(data);
      }
    } catch (error) {
      console.error("Failed to get user questions:", error);
      toast.error("Failed to get user questions");
    } finally {
      setIsLoadingGetUserQuestion(false);
    }
  };

  const handleDeleteUserQuestion = async (questionId: string) => {
    !selectedUserQuestionId &&
      window.confirm("Are you sure you want to delete this question?");
    if (isLoadingDeleteUserQuestion) {
      return;
    }
    setIsLoadingDeleteUserQuestion(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/faq/question/${questionId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `bearer ${
              typeof window !== "undefined"
                ? localStorage.getItem("token")
                : authState.token
            }`,
          },
          body: JSON.stringify({ questionId }),
        }
      );
      if (res.status === 401) {
        handleSignOut();
        return;
      }
      if (!res.ok && res.status !== 401) {
        throw new Error("Failed to deleteQuestion");
      }
      const data = await res.json();
      if (data && res.ok) {
        // refresh the data
        setUserQuestions((prev) => prev.filter((q) => q._id !== questionId));
        !selectedUserQuestionId &&
          toast.success("Question deleted successfully");
        selectedUserQuestionId && setSelectedUserQuestionId("");
      }
    } catch (error) {
      console.error("Failed to delete user question:", error);
      toast.error("Failed to delete user question");
    } finally {
      setIsLoadingDeleteUserQuestion(false);
    }
  };

  useEffect(() => {
    getAllCategories();
    getAllUserQuestions();
  }, []);

  const renderTagFilter = () => (
    <div className="mb-3">
      <motion.div
        className="flex items-center gap-3 mb-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer select-none"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <div className="bg-blue-50 p-2 rounded-md">
          <Tag size={20} className="text-blue-600" />
        </div>
        <div className="flex flex-col">
          <h3 className="text-base font-semibold text-gray-800">
            Filter by Tag
          </h3>
          <p className="text-sm text-gray-500">Select tags to filter content</p>
        </div>
      </motion.div>
      <div className="flex flex-wrap gap-2 overflow-x-auto max-w-[100%]">
        {isLoadingTags ? (
          <div className="flex items-center gap-2">
            <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="h-6 w-24 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
        ) : uniqueTags.length > 0 ? (
          <>
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedTag === null
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              onClick={() => setSelectedTag(null)}
            >
              All
            </motion.button>
            {uniqueTags.map((tag) => (
              <motion.button
                key={tag}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedTag === tag
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                onClick={() => setSelectedTag(tag)}
              >
                {tag}
                {selectedTag === tag && (
                  <span
                    className="ml-2 hover:text-blue-900"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTag(null);
                    }}
                  >
                    ×
                  </span>
                )}
              </motion.button>
            ))}
          </>
        ) : (
          <span className="text-sm text-gray-500 italic">
            No tags available
          </span>
        )}
      </div>
      {selectedTag && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-gray-600"
        >
          Showing categories tagged with:{" "}
          <span className="font-medium">{selectedTag}</span>
        </motion.div>
      )}
    </div>
  );

  return (
    <>
      <section className="hr_faq flex justify-between gap-[2.5vw] pt-3">
        <div className="w-[68%]">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-[--10px] my-[0.8vw]">
              <span onClick={() => router.back()}>{backIcon}</span>
              <h1 className="text-3xl font-bold">FAQ</h1>
            </div>

            {!authState.decodedToken?.departments?.includes("hr") && (
              <button
                onClick={() => setShowNewQuestionModal(true)}
                disabled={isLoadingAddNewQuestion}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus size={20} /> Add Question
              </button>
            )}
          </div>

          {/* New Question Modal */}
          <Modal
            show={showNewQuestionModal}
            onClose={() => setShowNewQuestionModal(false)}
            title="Add New Question"
          >
            <div className="space-y-4">
              <textarea
                placeholder="Question"
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowNewQuestionModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                  disabled={isLoadingAddNewQuestion}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddQuestion}
                  disabled={isLoadingAddNewQuestion || !newQuestion?.trim()}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoadingAddNewQuestion ? "Adding..." : "Add"}
                </button>
              </div>
            </div>
          </Modal>

          <div className="relative">
            <input
              type="text"
              placeholder="Search FAQs..."
              className="w-full p-4 pr-12 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
          </div>

          {renderTagFilter()}

          <div className="space-y-4 h-[55vh] overflow-auto pr-2">
            {isLoading ? (
              <div className="flex items-center justify-center w-full h-full">
                <span className="custom-loader"></span>
              </div>
            ) : categories && categories.length > 0 ? (
              <>
                <TrendingQuestions
                  categories={categories}
                  isLoading={isLoading}
                  isHR={false}
                  setCategories={setCategories}
                />

                {filteredCategories.map((category) => (
                  <div
                    key={category._id}
                    className="border rounded-lg overflow-hidden"
                  >
                    <div className="w-full p-4 flex justify-between items-center bg-white hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4 flex-1">
                        <button onClick={() => toggleCategory(category._id)}>
                          {activeCategory === category._id ? (
                            <ChevronUp className="text-gray-600" size={20} />
                          ) : (
                            <ChevronDown className="text-gray-600" size={20} />
                          )}
                        </button>

                        <div className="space-y-2">
                          <span className="font-medium text-lg block">
                            {category.name}
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {category?.categoryTag &&
                            category?.categoryTag?.length > 0 ? (
                              category?.categoryTag.map((tag) => (
                                <motion.span
                                  key={tag._id}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.8 }}
                                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 group hover:bg-blue-200 transition-colors"
                                >
                                  {tag.tag}
                                </motion.span>
                              ))
                            ) : (
                              <span className="text-sm text-gray-400 italic">
                                No tags added
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">
                            {category?.questions?.length} Questions
                          </span>
                        </div>
                      </div>
                    </div>

                    {activeCategory === category._id && (
                      <div className="bg-gray-50 px-4 py-3">
                        {category?.questions?.length > 0 ? (
                          category?.questions?.map((item) => (
                            <div key={item._id} className="mb-4 last:mb-0">
                              <div className="group relative bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start gap-4">
                                  <div className="flex-1">
                                    <h3
                                      className="font-medium text-gray-900 mb-2 cursor-pointer hover:text-blue-600 transition-colors"
                                      onClick={() =>
                                        setViewingQuestionId(item._id)
                                      }
                                    >
                                      {`Q: ${item.question}`}
                                    </h3>

                                    <ViewQuestionModel
                                      isOpen={viewingQuestionId === item._id}
                                      onClose={() => setViewingQuestionId(null)}
                                      question={item}
                                    />
                                  </div>

                                  {/* Like Dislike */}
                                  <LikeDislike
                                    categoryId={category._id}
                                    question={item}
                                    setCategories={setCategories}
                                  />
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            No questions added to this category yet
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center w-full h-full gap-4">
                {notFoundIcon}
                <span className="text-lg font-semibold text-gray-500">
                  No Data Found!
                </span>
                <p className="text-gray-500 text-center max-w-xs">
                  Try adjusting your filters or create a new category to get
                  started.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* New User Questions Section */}
        <div className="w-[30%] border rounded-lg">
          <div className="bg-yellow-50 p-4 border-b">
            <h2 className="text-lg font-semibold text-yellow-800 flex items-center gap-2">
              <MessageCircle size={20} />
              User Questions ({userQuestions?.length || 0})
            </h2>
          </div>

          <div className="divide-y h-[75vh] overflow-auto">
            {userQuestions?.length > 0 ? (
              userQuestions.map((question) => (
                <div
                  key={question._id}
                  className="p-4 bg-white hover:bg-gray-50"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <p className="text-gray-900 mb-2">{question.question}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock size={14} />
                        <span>
                          {new Date(question.createdAt).toLocaleDateString()}
                        </span>
                        <User size={14} />
                        <span title={question?.createdBy || ""}>
                          {truncateText(question?.createdBy, 25) || "-"}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDeleteUserQuestion(question._id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded"
                        disabled={isLoadingDeleteUserQuestion}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                No pending user questions
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="flex justify-start items-center mt-[--sy-20px]">
        <CustomBtn
          onClick={() => router.back()}
          btnColor="black"
          word="Back"
        ></CustomBtn>
      </div>
    </>
  );
};

export default FAQ;
