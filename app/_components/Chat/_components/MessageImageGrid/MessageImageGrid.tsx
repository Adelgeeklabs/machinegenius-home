"use client";
import React, {
  useState,
  memo,
  // , useEffect
} from "react";
import { ChevronLeft, ChevronRight, Download, X } from "lucide-react";
import Image from "next/image";

interface IImage {
  url: string;
  name: string;
  type: string;
  loading: boolean;
}

// Image Previewer Modal Component
const ImagePreviewer = ({
  images,
  currentIndex,
  isOpen,
  onClose,
}: {
  images: IImage[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [activeIndex, setActiveIndex] = useState(currentIndex);

  if (!isOpen) return null;

  const handlePrevious = () => {
    setActiveIndex((prev: number) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setActiveIndex((prev: number) =>
      prev < images.length - 1 ? prev + 1 : prev
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") handlePrevious();
    if (e.key === "ArrowRight") handleNext();
    if (e.key === "Escape") onClose();
  };

  const handleDownload = async (image: IImage) => {
    const imageUrl = image.url;

    try {
      // Fetch the image as a Blob
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch the image");
      }
      const blob = await response.blob();

      // Create a URL for the Blob
      const blobUrl = URL.createObjectURL(blob);

      // Create an anchor element for downloading
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = image.name;
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Error downloading the image:", error);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
      onClick={onClose}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Add download button  */}
      <button
        className="absolute top-4 right-24 text-white hover:text-gray-300 z-50 flex items-center gap-[--10px]"
        onClick={() => handleDownload(images[activeIndex])}
      >
        <Download size={24} />
        Download
      </button>

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 z-50"
      >
        <X size={24} />
      </button>

      {/* Image counter */}
      <div className="absolute top-4 left-4 text-white">
        {activeIndex + 1} / {images.length}
      </div>

      {/* Main image */}
      <div
        className="relative w-full h-full flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* <img
          src={images[activeIndex].url}
          alt={`Preview ${activeIndex + 1}`}
          className="max-h-[90vh] max-w-[90vw] object-contain"
        /> */}

        <div className="relative h-[90vh] w-[90vw]">
          <Image
            src={images[activeIndex].url}
            alt={`Preview ${activeIndex + 1}`}
            fill
            priority
            className="object-contain"
            sizes="90vw"
            quality={100}
          />
        </div>

        {/* Navigation buttons */}
        {activeIndex > 0 && (
          <button
            onClick={handlePrevious}
            className="absolute left-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
        )}

        {activeIndex < images.length - 1 && (
          <button
            onClick={handleNext}
            className="absolute right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
          >
            <ChevronRight size={24} />
          </button>
        )}
      </div>
    </div>
  );
};

// Updated MessageImageGrid Component
const MessageImageGrid = ({
  images,
  // containerRef,
  // searchText,
}: {
  images: IImage[];
  // containerRef: React.RefObject<HTMLDivElement>;
  // searchText: string;
}) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  // const [changed, setChanged] = useState(false);
  // const [scrolled, setScrolled] = useState(
  //   localStorage?.getItem("scrolled") === "true"
  // );

  if (!images || images.length === 0) return null;

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setPreviewOpen(true);
  };

  const getImageStyle = (total: number, index: number) => {
    const baseStyles = "object-cover w-full h-full cursor-pointer";

    if (total === 1) {
      return `${baseStyles} rounded-lg max-h-80`;
    }

    if (total === 2) {
      return `${baseStyles} ${index === 0 ? "rounded-l-lg" : "rounded-r-lg"}`;
    }

    if (total === 3) {
      if (index === 0) {
        return `${baseStyles} rounded-l-lg`;
      }
      return `${baseStyles} ${index === 1 ? "rounded-tr-lg" : "rounded-br-lg"}`;
    }

    return `${baseStyles} ${
      index === 0
        ? "rounded-tl-lg"
        : index === 1
          ? "rounded-tr-lg"
          : index === 2
            ? "rounded-bl-lg"
            : "rounded-br-lg"
    }`;
  };

  const containerStyle = (count: number) => {
    switch (count) {
      case 1:
        return "grid grid-cols-1 gap-1";
      case 2:
        return "grid grid-cols-2 gap-1";
      case 3:
        return "grid grid-cols-2 gap-1";
      default:
        return "grid grid-cols-2 gap-1";
    }
  };

  const getImageContainerStyle = (total: number, index: number) => {
    if (total === 3 && index === 0) {
      return "row-span-2";
    }
    return "";
  };

  const visibleImages = images?.slice(0, 4);
  const remainingCount = images.length > 4 ? images.length - 3 : 0;

  // useEffect(() => {
  //   window.addEventListener("wheel", () => {
  //     // console.log("scrolled");

  //     setScrolled(true);
  //     localStorage.setItem("scrolled", "true");
  //   });

  //   // Attach the beforeunload event listener
  //   window.addEventListener("beforeunload", () => {
  //     localStorage.setItem("scrolled", "false");
  //   });

  //   // Cleanup the event listener on component unmount
  //   return () => {
  //     window.removeEventListener("beforeunload", () => {
  //       localStorage.setItem("scrolled", "false");
  //     });
  //   };
  // }, []);

  return (
    <>
      <div className="max-w-md w-full">
        <div className={`${containerStyle(images.length)}`}>
          {visibleImages.map((image: IImage, index: number) => (
            <div
              key={index}
              className={`relative overflow-clip ${getImageContainerStyle(
                images.length,
                index
              )}
              ${getImageStyle(images.length, index)}
              `}
              onClick={() => handleImageClick(index)}
            >
              <Image
                src={image.url}
                alt={`Image ${index + 1}`}
                className={getImageStyle(images.length, index)}
                width={500}
                height={500}
                quality={10}
                placeholder="blur"
                blurDataURL={
                  "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
                }
                // onLoad={() => {
                //   image.loading = false;
                //   if (containerRef.current) {
                //     if (!scrolled && !searchText) {
                //       containerRef.current.scrollIntoView({
                //         behavior: "smooth",
                //         block: "end",
                //       });
                //     }
                //   }

                //   // setChanged((prev) => !prev);
                // }}
              />

              {image.loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20">
                  <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              {index === 3 && remainingCount > 0 && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer">
                  <span className="text-white text-xl font-semibold">
                    +{remainingCount}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <ImagePreviewer
        images={images}
        currentIndex={selectedImageIndex}
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
      />
    </>
  );
};

export default memo(MessageImageGrid);
