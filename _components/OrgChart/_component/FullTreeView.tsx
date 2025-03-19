"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  useContext,
} from "react";
import { Tree, TreeNode } from "react-organizational-chart";
import { Card, CardContent } from "@/app/_components/ui/card";
import { Button } from "@/app/_components/ui/button";
import {
  ZoomIn,
  ZoomOut,
  Maximize,
  ChevronUp,
  ChevronDown,
  Info,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { globalContext } from "@/app/_context/store";

interface Employee {
  _id: string;
  firstName: string;
  lastName: string;
  theme: string;
  fullName: string;
  email: string;
  employeeID: string;
  personalEmail: string;
  phoneNumber: string;
  secondPhoneNumber?: string;
  department: string;
  role: string;
}

interface EmployeeNode {
  employee: Employee;
  children: EmployeeNode[];
}

interface EmployeeMapEntry {
  parent: EmployeeNode | null;
}

const InfoPanel: React.FC<{
  employee: Employee;
  isOpen: boolean;
  onClose: () => void;
  setShowInfo: (show: Employee | null) => void;
}> = ({ employee, isOpen, onClose, setShowInfo }) => (
  <>
    {/* Backdrop */}
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/20 z-40"
        />
      )}
    </AnimatePresence>
    <div
      className={`${isOpen ? "w-auto" : "w-0"} rounded-l-xl shrink z-50 h-[80vh] overflow-hidden [interpolate-size:allow-keywords] transition-all duration-200`}
    >
      {/* Panel */}
      <motion.aside
        initial={{ x: "100%" }}
        animate={{ x: isOpen ? "0%" : "100%" }}
        transition={{ ease: "easeInOut", duration: 0.3 }}
        className="w-[400px] h-full bg-white shadow-2xl z-50"
      >
        <div className="h-full overflow-y-auto">
          <div className="sticky top-0 bg-white z-10 p-6 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Employee Details</h2>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-[#E6F4FF] flex items-center justify-center text-3xl font-bold text-blue-600">
                {employee.firstName[0]}
              </div>
            </div>

            <div className="grid gap-6">
              <div className="space-y-1">
                <label className="text-sm text-gray-500">Full Name</label>
                <p className="text-lg font-semibold">{employee.fullName}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm text-gray-500">Employee ID</label>
                  <p className="font-medium">{employee.employeeID}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-gray-500">Department</label>
                  <p className="font-medium">{employee.department}</p>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm text-gray-500">Role</label>
                <p className="font-medium">{employee.role}</p>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">
                  Contact Information
                </h3>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-sm text-gray-500">Work Email</label>
                    <p className="font-medium">{employee.email}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm text-gray-500">
                      Personal Email
                    </label>
                    <p className="font-medium">{employee.personalEmail}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm text-gray-500">
                      Phone Number
                    </label>
                    <p className="font-medium">{employee.phoneNumber}</p>
                  </div>
                  {employee.secondPhoneNumber && (
                    <div className="space-y-1">
                      <label className="text-sm text-gray-500">
                        Secondary Phone
                      </label>
                      <p className="font-medium">
                        {employee.secondPhoneNumber}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.aside>
    </div>
  </>
);

const EmployeeCard: React.FC<{
  employee: Employee;
  childCount?: number;
  onSelectedEmployee: () => void;
  level: number;
  isSelected: boolean;
  setShowInfo: (show: Employee | null) => void;
}> = React.memo(
  ({
    employee,
    childCount = 0,
    onSelectedEmployee,
    level,
    isSelected,
    setShowInfo,
  }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative"
        >
          <Card
            className={`bg-white border-t-4 w-[200px] transition-all duration-300 ${
              isSelected ? "ring-4 ring-blue-400 shadow-lg" : ""
            }`}
            style={{ borderColor: employee.theme }}
          >
            <CardContent
              className="p-4 flex flex-col items-center cursor-pointer"
              onClick={onSelectedEmployee}
            >
              <div className="relative w-16 h-16 mb-2">
                {childCount > 0 && (
                  <motion.div
                    className="absolute right-0 top-0 bg-yellow-400 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold z-10"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      delay: 0.2,
                      type: "spring",
                      stiffness: 500,
                      damping: 15,
                    }}
                  >
                    {childCount}
                  </motion.div>
                )}
                <motion.div
                  className="w-16 h-16 rounded-full bg-[#E6F4FF] flex items-center justify-center overflow-hidden"
                  animate={{ rotate: isSelected ? 360 : 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="w-16 h-16 bg-blue-200 flex items-center justify-center text-blue-600 font-bold text-xl">
                    {employee.firstName[0]}
                  </div>
                </motion.div>
              </div>
              <h3 className="font-bold text-sm text-center mb-1">{`${employee.firstName} ${employee.lastName}`}</h3>
              <p className="text-xs text-gray-500">Team Member</p>
            </CardContent>
          </Card>

          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                className="absolute top-2 right-2"
              >
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6 rounded-full bg-white shadow-md"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowInfo(employee);
                  }}
                >
                  <Info className="h-3 w-3" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* <InfoPanel
          employee={employee}
          isOpen={showInfo}
          onClose={() => setShowInfo(false)}
        /> */}
      </>
    );
  }
);

EmployeeCard.displayName = "EmployeeCard";

const FullTreeView: React.FC<{ data: EmployeeNode }> = ({ data }) => {
  const { authState } = useContext(globalContext);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const treeRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showInfo, setShowInfo] = useState<Employee | null>(null);

  const [root, setRoot] = useState(data);
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
  const [zoomingEmployee, setZoomingEmployee] = useState<string | null>(null);

  const employeeMap = useMemo(() => {
    const map: Record<string, EmployeeMapEntry> = {};
    const queue: [EmployeeNode, EmployeeNode | null][] = [[data, null]];

    while (queue.length > 0) {
      const [node, parent] = queue.shift()!;
      if (node && node.employee) {
        map[node.employee._id] = { parent };
        node.children.forEach((child) => queue.push([child, node]));
      }
    }

    return map;
  }, [data]);

  useEffect(() => {
    const getEmployeeId = () => {
      if (typeof window !== "undefined") {
        const user = localStorage.getItem("decodedToken");
        return user ? JSON.parse(user)._id : null;
      } else {
        return authState?.decodedToken?._id || null;
      }
    };

    const getRole = () => {
      if (typeof window !== "undefined") {
        const user = localStorage.getItem("decodedToken");
        if (user) {
          const decodedToken = JSON.parse(user);
          return (
            decodedToken.department?.includes("hr") ||
            decodedToken.department?.includes("ceo")
          );
        }
      }
      return false;
    };

    if (getRole()) {
      return;
    }
    const employeeId = getEmployeeId();
    if (employeeId) {
      onSelectedEmployee(employeeId);
    }
  }, []);

  const renderTree = useCallback(
    (
      node: EmployeeNode,
      level: number,
      setShowInfo: (show: Employee | null) => void
    ): React.ReactNode => {
      if (!node || !node.employee) {
        return null;
      }

      const isSelected = currentEmployee?._id === node.employee._id;
      const isZooming = zoomingEmployee === node.employee._id;

      return (
        <TreeNode
          key={node.employee._id}
          label={
            <motion.div
              className="flex justify-center w-full px-4"
              initial={false}
              animate={
                isZooming ? { scale: 1.2, zIndex: 10 } : { scale: 1, zIndex: 1 }
              }
              transition={{ duration: 0.3 }}
            >
              <EmployeeCard
                employee={node.employee}
                childCount={node.children?.length || 0}
                onSelectedEmployee={() => onSelectedEmployee(node.employee)}
                level={level}
                isSelected={isSelected}
                setShowInfo={setShowInfo}
              />
            </motion.div>
          }
        >
          {currentEmployee &&
          level >= 1 &&
          currentEmployee._id !== node.employee._id ? null : node.children
              ?.length > 0 ? (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="grid auto-cols grid-flow-col w-full"
              >
                {node.children.map((child) =>
                  renderTree(child, level + 1, setShowInfo)
                )}
              </motion.div>
            </AnimatePresence>
          ) : null}
        </TreeNode>
      );
    },
    [currentEmployee, zoomingEmployee]
  );

  const fitToScreen = useCallback(() => {
    if (treeRef.current && containerRef.current) {
      const treeWidth = treeRef.current.scrollWidth;
      const treeHeight = treeRef.current.scrollHeight;
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;

      const scaleX = containerWidth / treeWidth;
      const scaleY = containerHeight / treeHeight;
      const newScale = Math.min(scaleX, scaleY, 1) * 0.9;

      setScale(newScale);
      setPosition({
        x: (containerWidth - treeWidth * newScale) / 2,
        y: 20,
      });
    }
  }, [root, currentEmployee]);

  useEffect(() => {
    fitToScreen();
    window.addEventListener("resize", fitToScreen);
    return () => {
      window.removeEventListener("resize", fitToScreen);
    };
  }, [fitToScreen]);

  const handleZoom = useCallback(
    (delta: number, clientX?: number, clientY?: number) => {
      setScale((prevScale) => {
        const newScale = Math.max(0.1, Math.min(prevScale + delta, 2));

        if (containerRef.current && treeRef.current) {
          const containerRect = containerRef.current.getBoundingClientRect();
          const mouseX =
            clientX !== undefined
              ? clientX - containerRect.left
              : containerRect.width / 2;
          const mouseY =
            clientY !== undefined
              ? clientY - containerRect.top
              : containerRect.height / 2;

          const scaleChange = newScale / prevScale;
          const newPositionX = mouseX - (mouseX - position.x) * scaleChange;
          const newPositionY = mouseY - (mouseY - position.y) * scaleChange;

          setPosition({ x: newPositionX, y: newPositionY });
        }

        return newScale;
      });
    },
    [position]
  );

  const handleWheel = useCallback(
    (event: React.WheelEvent) => {
      event.preventDefault();
      const delta = event.deltaY * -0.001;
      handleZoom(delta, event.clientX, event.clientY);
    },
    [handleZoom]
  );

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (event.buttons === 1) {
      setPosition((prev) => ({
        x: prev.x + event.movementX,
        y: prev.y + event.movementY,
      }));
    }
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [handleMouseMove]);

  const onSelectedEmployee = useCallback(
    (employee: Employee) => {
      setZoomingEmployee(employee._id);
      setTimeout(() => {
        const selectedEmployee = employeeMap[employee._id];
        if (selectedEmployee && selectedEmployee.parent) {
          setRoot(selectedEmployee.parent);
        }
        setCurrentEmployee(employee);
        setZoomingEmployee(null);
      }, 300);
    },
    [employeeMap]
  );

  const viewFull = useCallback(() => {
    setRoot(data);
    setCurrentEmployee(null);
    // setShowInfo(false);
  }, [data]);

  if (!root || !root.employee) {
    return (
      <div className="flex justify-center items-center h-screen">
        No data available for tree view
      </div>
    );
  }

  // const isRoorSelected = currentEmployee?._id === root.employee._id;
  const isRootZooming = zoomingEmployee === root.employee._id;

  return (
    <div className="w-full h-[80vh] mt-[--20px] flex gap-3">
      <div
        ref={containerRef}
        className="h-[80vh] rounded-xl flex-1 [interpolate-size:allow-keywords] transition-all duration-200 overflow-hidden bg-gray-50 border border-gray-300 relative"
        onWheel={handleWheel}
      >
        <motion.div
          className="absolute top-4 right-4 z-10 flex space-x-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button onClick={() => handleZoom(0.1)} size="icon">
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button onClick={() => handleZoom(-0.1)} size="icon">
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button onClick={fitToScreen} size="icon">
            <Maximize className="h-4 w-4" />
          </Button>
        </motion.div>
        <motion.div
          className="absolute top-4 left-4 z-20"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button onClick={viewFull} className="mr-2">
            Full Tree View
          </Button>
        </motion.div>
        <motion.div
          ref={treeRef}
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: "0 0",
            transition: "none",
            cursor: "grab",
            padding: "20px",
            marginTop: "40px",
            width: "max-content",
            minWidth: "100%",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Tree
            lineWidth="1px"
            lineColor="#bbb"
            lineBorderRadius="5px"
            nodePadding="4px"
            label={
              <div className="flex flex-col items-center">
                {currentEmployee &&
                currentEmployee._id !== root.employee._id ? (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-2"
                  >
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onSelectedEmployee(root.employee)}
                      className="rounded-full"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                  </motion.div>
                ) : null}
                <motion.div
                  className="flex justify-center w-full px-4"
                  initial={false}
                  animate={
                    isRootZooming
                      ? { scale: 1.2, zIndex: 10 }
                      : { scale: 1, zIndex: 1 }
                  }
                  transition={{ duration: 0.3 }}
                >
                  <EmployeeCard
                    employee={root.employee}
                    childCount={root.children?.length || 0}
                    onSelectedEmployee={() => onSelectedEmployee(root.employee)}
                    level={0}
                    isSelected={currentEmployee?._id === root.employee._id}
                    setShowInfo={setShowInfo}
                  />
                </motion.div>
              </div>
            }
          >
            {root.children?.length > 0 ? (
              <div className="grid auto-cols grid-flow-col w-full">
                {root.children.map((item) => renderTree(item, 1, setShowInfo))}
              </div>
            ) : null}
          </Tree>
        </motion.div>
      </div>
      {showInfo && (
        <InfoPanel
          employee={showInfo}
          isOpen={showInfo !== null}
          onClose={() => setShowInfo(null)}
          setShowInfo={setShowInfo}
        />
      )}
    </div>
  );
};

export default FullTreeView;
