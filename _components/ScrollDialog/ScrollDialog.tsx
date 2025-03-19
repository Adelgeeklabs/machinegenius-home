import { Fragment, useEffect, useRef, useState, ReactNode, memo } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
// import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CustomBtn from "../Button/CustomBtn";
import { Editor } from "primereact/editor";

interface ScrollDialogProps {
  trigger?: ReactNode; // Custom trigger element
  title?: string;
  contentId: string;
  fetchedContent?: string;
  fetchContent?: (id: string) => Promise<any> | undefined;
  buttonProps?: {
    word?: string;
    btnColor?: "black" | "white";
    paddingVal?: string;
    className?: string;
    width?: string;
  };
}

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className="size-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18 18 6M6 6l12 12"
    />
  </svg>
);

function ScrollDialog({
  trigger,
  title = "",
  contentId,
  fetchedContent,
  fetchContent,
  buttonProps = {
    word: "View",
    btnColor: "black",
    paddingVal: "py-[--6px] px-[--10px]",
    className: "videoStatusBtn",
    width: "w-fit",
  },
}: ScrollDialogProps) {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const handleOpen = async () => {
    setOpen(true);
    setIsLoading(true);
    const fetchedContentResult = fetchedContent
      ? fetchedContent
      : fetchContent && (await fetchContent(contentId));
    setContent(fetchedContentResult || "");
    setIsLoading(false);
  };

  const handleClose = () => {
    setOpen(false);
    setContent(null);
  };

  const descriptionElementRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  return (
    <Fragment>
      {trigger ? (
        <div onClick={handleOpen}>{trigger}</div>
      ) : (
        <CustomBtn
          onClick={handleOpen}
          className={buttonProps.className}
          width={buttonProps.width}
          word={buttonProps.word}
          btnColor={buttonProps.btnColor || "black"}
          paddingVal={buttonProps.paddingVal}
        />
      )}

      <Dialog
        open={open}
        onClose={handleClose}
        scroll={"paper"}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle
          id="scroll-dialog-title"
          className="flex justify-between items-center gap-[--15px]"
        >
          <span className="text-[--16px] font-bold flex-1">{title}</span>
          <span onClick={handleClose} className="cursor-pointer">
            <CloseIcon />
          </span>
        </DialogTitle>
        <DialogContent
          dividers={true}
          id="scroll-dialog-description"
          ref={descriptionElementRef}
          tabIndex={-1}
        >
          {/* <DialogContentText
          > */}
          {isLoading ? (
            <div className="flex justify-center items-center">
              <span className="custom-loader"></span>
            </div>
          ) : content ? (
            <Editor
              value={content}
              readOnly
              pt={{
                toolbar: {
                  style: { display: "none" },
                },
              }}
            />
          ) : (
            <div className="flex justify-center items-center">
              <div className="flex flex-col justify-center items-center gap-[--10px]">
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                  <polyline points="13 2 13 9 20 9" />
                </svg>
                <span className="text-lg font-medium text-gray-600">
                  No content available!
                </span>
              </div>
            </div>
          )}
          {/* </DialogContentText> */}
        </DialogContent>
      </Dialog>
    </Fragment>
  );
}

export default memo(ScrollDialog);
