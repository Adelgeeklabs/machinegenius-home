//@ts-nocheck
"use client";
import React, { useState, useEffect, useCallback, useContext } from "react";
import { toast } from "react-hot-toast";
import CustomCheckBox from "@/app/_components/CustomCheckBox/CustomCheckBox";
import styles from "./AddGroupMembers.module.css";
import CustomBtn from "@/app/_components/Button/CustomBtn";
import { globalContext } from "@/app/_context/store";

export interface Member {
  _id: string;
  firstName: string;
  lastName: string;
  userId?: string;
  type?: string;
}

interface AddGroupMembersProps {
  isOpen: boolean;
  onClose: () => void;
  currentGroupId: string;
  currentMembers: Member[];
  onAddMembers: (members: Member[]) => void;
}

const AddGroupMembers = ({
  isOpen,
  onClose,
  currentGroupId,
  currentMembers,
  onAddMembers,
}: AddGroupMembersProps) => {
  const { handleSignOut } = useContext(globalContext);
  const [availableMembers, setAvailableMembers] = useState<Member[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<Member[]>([]);
  const [selectedMembersId, setSelectedMembersId] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAvailableMembers();
  }, [currentGroupId]);

  const fetchAvailableMembers = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/conversation/all-groups`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 401) {
        handleSignOut();
      }
      const data = await response.json();
      if (data.success) {
        // Filter out current members
        const currentMemberIds = currentMembers.map((member) => member._id);
        const filteredMembers = data.data
          .filter(
            (member: Member) =>
              !currentMemberIds.includes(member?.userId && member._id) &&
              member.type !== "group" &&
              member.firstName &&
              member.lastName
          )
          .map((member) => {
            return {
              _id: member.userId || member._id,
              firstName: member.firstName,
              lastName: member.lastName,
            };
          });
        setAvailableMembers(filteredMembers);
      }
    } catch (error) {
      console.error("Error fetching members:", error);
      toast.error("Failed to fetch available members");
    }
  };

  useEffect(() => console.log(selectedMembers), [selectedMembers]);
  useEffect(() => console.log(selectedMembersId), [selectedMembersId]);

  const handleMemberSelect = useCallback(
    (member: any) => {
      const isMemberIncluded = selectedMembersId.includes(
        member.userId || member._id
      );

      console.log(isMemberIncluded);
      setSelectedMembers((prev) => {
        if (isMemberIncluded) {
          return prev.filter(
            (mem: Member) => mem._id !== (member.userId || member._id)
          );
        }
        return [
          ...prev,
          {
            _id: member._id,
            firstName: member.firstName,
            lastName: member.lastName,
            theme: member?.theme,
            email: member.email,
          },
        ];
      });
      setSelectedMembersId((prev) => {
        if (isMemberIncluded) {
          return prev.filter((mem) => mem !== (member.userId || member._id));
        }
        return [...prev, member.userId || member._id];
      });
    },
    [selectedMembers, selectedMembersId]
  );

  const handleAddMembers = async () => {
    if (selectedMembers.length === 0) {
      toast.error("Please select members to add");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/conversation/update/add-members/${currentGroupId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            newMembers: selectedMembersId,
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        onAddMembers(selectedMembers);
        toast.success("Members added successfully");
        setSelectedMembersId([]);
        setSelectedMembers([]);
        onClose();
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Error adding members:", error);
      toast.error("Failed to add members");
    } finally {
      setLoading(false);
    }
  };

  const filteredMembers = availableMembers
    .filter((member) => !currentMembers.some((mem) => mem._id === member._id))
    .filter((member) =>
      `${member.firstName} ${member.lastName}`
        ?.toLowerCase()
        .includes(searchQuery?.toLowerCase())
    );

  console.log(filteredMembers);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>Add Group Members</h2>
          <button onClick={onClose} className={styles.closeButton}>
            ×
          </button>
        </div>

        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="Search members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.membersList}>
          {filteredMembers.map((member) => (
            <div
              key={member._id}
              className={styles.memberItem}
              onClick={() => handleMemberSelect(member)}
            >
              <CustomCheckBox
                checked={selectedMembersId.includes(member._id)}
              />
              <span className={styles.memberName}>
                {member.firstName} {member.lastName}
              </span>
            </div>
          ))}
        </div>

        <div className={styles.modalFooter}>
          <button onClick={onClose} className={styles.cancelButton}>
            Cancel
          </button>
          <CustomBtn
            width="w-fit"
            word={`Add Members (${selectedMembersId.length})`}
            className="cursor-pointer"
            onClick={handleAddMembers}
            disabled={selectedMembers.length === 0 || loading}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default AddGroupMembers;
