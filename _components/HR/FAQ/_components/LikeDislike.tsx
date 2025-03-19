import React, { useState, useContext } from "react";
import { globalContext } from "@/app/_context/store";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { IQuestion, ICategory } from "../FAQ";
import toast from "react-hot-toast";

interface ILikeUnLikeResponse {
  message: string;
  updatedCategory: ICategory;
  likerCount: number;
  dislikerCount: number;
}

interface LikeDislikeProps {
  categoryId: string;
  question: IQuestion;
  setCategories: any;
}

const LikeDislike = ({
  categoryId,
  question,
  setCategories,
}: LikeDislikeProps) => {
  const { handleSignOut, authState } = useContext(globalContext);
  const [isLoadingLikeQuestion, setIsLoadingLikeQuestion] = useState(false);
  const [isLoadingDislikeQuestion, setIsLoadingDislikeQuestion] =
    useState(false);
  const [optimisticLikes, setOptimisticLikes] = useState<{
    [key: string]: { liked: boolean; disliked: boolean };
  }>({});

  const isLiked = (question: IQuestion) => {
    if (optimisticLikes[question._id]?.liked) return true;
    return question.liker.includes(authState.decodedToken._id);
  };

  const isDisliked = (question: IQuestion) => {
    if (optimisticLikes[question._id]?.disliked) return true;
    return question.unLiker.includes(authState.decodedToken._id);
  };

  const likeQuestion = async (categoryId: string, questionId: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/faq/categories/${categoryId}/questions/like`,
        {
          method: "POST",
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
        throw new Error("Unauthorized");
        return;
      }

      // if (!res.ok && res.status !== 401) {
      //   throw new Error("Failed to like question");
      // }

      const data: ILikeUnLikeResponse = await res.json();

      if (!res.ok && res.status !== 401) {
        throw new Error(data?.message || "Failed to like question");
      }

      if (data && res.ok) {
        // refresh the data
        setCategories((prev: ICategory[]) => {
          const updatedCategories = prev.map((cat: ICategory) => {
            if (cat._id === categoryId) {
              return {
                ...cat,
                questions: data?.updatedCategory?.questions,
              };
            }
            return cat;
          });

          return updatedCategories;
        });

        // Clear the optimistic state for this question
        setOptimisticLikes((prev) => {
          const newState = { ...prev };
          delete newState[questionId];
          return newState;
        });

        return data;

        // toast.success("Question liked successfully");
      } else if (data?.message) {
        toast.error(data?.message);
      }
    } catch (error) {
      throw error;
    }
  };

  const dislikeQuestion = async (categoryId: string, questionId: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/faq/categories/${categoryId}/questions/unlike`,
        {
          method: "POST",
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
        throw new Error("Unauthorized");
        return;
      }
      // if (!res.ok && res.status !== 401) {
      //   throw new Error("Failed to dislike question");
      // }
      const data: ILikeUnLikeResponse = await res.json();

      if (!res.ok && res.status !== 401) {
        throw new Error(data?.message || "Failed to dislike question");
      }

      if (data && res.ok) {
        // refresh the data
        setCategories((prev: ICategory[]) => {
          const updatedCategories = prev.map((cat: ICategory) => {
            if (cat._id === categoryId) {
              return {
                ...cat,
                questions: data?.updatedCategory?.questions,
              };
            }
            return cat;
          });

          return updatedCategories;
        });

        // Clear the optimistic state for this question
        setOptimisticLikes((prev) => {
          const newState = { ...prev };
          delete newState[questionId];
          return newState;
        });

        return data;

        // toast.success("Question disliked successfully");
      } else if (data.message) {
        toast.error(data.message);
      }
    } catch (error) {
      throw error;
    }
  };

  const handleLike = async (
    categoryId: string,
    questionId: string,
    question: IQuestion
  ) => {
    if (isLoadingLikeQuestion || isLoadingDislikeQuestion) return;

    // Store the previous state for rollback
    const previousState = { ...optimisticLikes[questionId] };

    if (!question.liker.includes(authState.decodedToken._id)) {
      // Optimistically update UI
      setOptimisticLikes((prev) => ({
        ...prev,
        [questionId]: {
          liked: true,
          disliked: false,
        },
      }));
    }

    let data: ILikeUnLikeResponse | undefined;

    try {
      setIsLoadingLikeQuestion(true);
      data = await likeQuestion(categoryId, questionId);
    } catch (error) {
      console.error("Error liking question:", error);
      // Revert to previous state on error
      setOptimisticLikes((prev) => ({
        ...prev,
        [questionId]: previousState || { liked: false, disliked: false },
      }));
      toast.error(data?.message || "Failed to like question");
    } finally {
      setIsLoadingLikeQuestion(false);
    }
  };

  const handleDislike = async (
    categoryId: string,
    questionId: string,
    question: IQuestion
  ) => {
    if (isLoadingLikeQuestion || isLoadingDislikeQuestion) return;

    // Store the previous state for rollback
    const previousState = { ...optimisticLikes[questionId] };

    if (!question.unLiker.includes(authState.decodedToken._id)) {
      // Optimistically update UI
      setOptimisticLikes((prev) => ({
        ...prev,
        [questionId]: {
          liked: false,
          disliked: true,
        },
      }));
    }

    let data: ILikeUnLikeResponse | undefined;
    try {
      setIsLoadingDislikeQuestion(true);
      data = await dislikeQuestion(categoryId, questionId);
    } catch (error) {
      console.error("Error disliking question:", error);
      // Revert to previous state on error
      setOptimisticLikes((prev) => ({
        ...prev,
        [questionId]: previousState || { liked: false, disliked: false },
      }));
      toast.error(data?.message || "Failed to dislike question");
    } finally {
      setIsLoadingDislikeQuestion(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleLike(categoryId, question._id, question)}
        disabled={isLoadingLikeQuestion || isLoadingDislikeQuestion}
        className={`p-1 rounded transition-colors ${
          isLiked(question)
            ? "text-blue-600 bg-blue-50"
            : "text-gray-400 hover:bg-blue-50 hover:text-blue-500"
        }`}
      >
        <ThumbsUp size={16} />
      </button>

      <span className="text-sm font-medium text-gray-600">
        {question?.liker?.length +
          (optimisticLikes[question._id]?.liked ? 1 : 0) || 0}
      </span>

      <button
        onClick={() => handleDislike(categoryId, question._id, question)}
        disabled={isLoadingLikeQuestion || isLoadingDislikeQuestion}
        className={`p-1 rounded transition-colors ${
          isDisliked(question)
            ? "text-red-600 bg-red-50"
            : "text-gray-400 hover:bg-red-50 hover:text-red-500"
        }`}
      >
        <ThumbsDown size={16} />
      </button>
    </div>
  );
};

export default LikeDislike;
