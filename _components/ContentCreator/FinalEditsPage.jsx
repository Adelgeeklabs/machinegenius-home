"use client";
import {
  useEffect,
  useRef,
  useState,
  useContext,
  useCallback,
  useMemo,
} from "react";
import LogoAndTitle from "@/app/_components/LogoAndTitle/LogoAndTitle";
import dynamic from "next/dynamic";
import CustomBtn from "@/app/_components/Button/CustomBtn";
import SpecificChecker from "@/app/_components/SpecificChecker/SpecificChecker";
import { useSelector, useDispatch } from "react-redux";
import { contentCreatorActions } from "@/app/_redux/contentCreator/contentCreatorSlice";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { globalContext } from "@/app/_context/store";
import { contentCreatorContext } from "@/app/_context/contentCreatorContext";
import debounce from "debounce";
import { formatHtml } from "@/app/_utils/htmlFormatter";
import { formatToText } from "@/app/_utils/contentFormatter";
// import { CKEditor } from "@ckeditor/ckeditor5-react";
const DynamicCKEditor = dynamic(
  () => import("@ckeditor/ckeditor5-react").then((mod) => mod.CKEditor),
  {
    ssr: false,
    loading: () => (
      <div className="flex flex-col justify-center items-center w-[50vw] mx-auto h-[75vh]">
        <p className="font-bold text-[--24px] p-[--20px]">
          Document is loading...
        </p>
      </div>
    ),
  }
);
import {
  DecoupledEditor,
  AccessibilityHelp,
  Alignment,
  Autoformat,
  AutoImage,
  AutoLink,
  Autosave,
  BalloonToolbar,
  Bold,
  CloudServices,
  Code,
  Essentials,
  FindAndReplace,
  FontBackgroundColor,
  FontColor,
  FontFamily,
  FontSize,
  Heading,
  Highlight,
  HorizontalLine,
  ImageBlock,
  ImageCaption,
  ImageInline,
  ImageInsertViaUrl,
  ImageResize,
  ImageStyle,
  ImageToolbar,
  ImageUpload,
  Indent,
  IndentBlock,
  Italic,
  Link,
  LinkImage,
  List,
  ListProperties,
  PageBreak,
  Paragraph,
  PasteFromOffice,
  RemoveFormat,
  SelectAll,
  SpecialCharacters,
  SpecialCharactersArrows,
  SpecialCharactersCurrency,
  SpecialCharactersEssentials,
  SpecialCharactersLatin,
  SpecialCharactersMathematical,
  SpecialCharactersText,
  Strikethrough,
  Subscript,
  Superscript,
  Table,
  TableCaption,
  TableCellProperties,
  TableColumnResize,
  TableProperties,
  TableToolbar,
  TextTransformation,
  TodoList,
  Underline,
  Undo,
} from "ckeditor5";
import "ckeditor5/ckeditor5.css";
import "./CKEDITOR.css";
import showErrorToast from "../VideoEditing/CustomToast/toastUtils";

export default function FinalEditsPage() {
  const finalArticle = useSelector(
    (state) => state.contentCreator.finalArticle
  );
  const { setCheckStatus } = useContext(contentCreatorContext);
  const dispatch = useDispatch();
  const router = useRouter();

  const [pageState, setPageState] = useState({
    wordCount: "Loading ...",
  });

  useEffect(() => {
    console.log("=====finalArticle=====:", finalArticle);
    // reset the checkStatus
    setCheckStatus({
      grammar: "waiting",
      plagiarism: "pass",
      ai: "waiting",
      isGrammerChecked: false,
    });
  }, []);

  useEffect(() => {
    if (!finalArticle) {
      toast.error(
        "No data is available. You will be redirected to refetch new data!"
      );
      setTimeout(() => {
        router.push("/content-creator/create/choose-brand");
      }, 1500);
    }
  }, []);

  const countWords = useCallback((text) => {
    if (text) {
      // Remove HTML tags and trim whitespace
      const plainText = text.replace(/<[^>]*>/g, " ")?.trim();
      // Split by whitespace and filter out empty strings
      const words = plainText?.split(/\s+/).filter((word) => word.length > 0);
      return words.length;
    } else {
      return 0;
    }
  }, []);

  const updateWordCount = useCallback(
    (editor) => {
      if (editor) {
        const data = editor.getData();
        setPageState((prevState) => ({
          ...prevState,
          wordCount: countWords(data),
        }));
      }
    },
    [countWords, setPageState]
  );

  const debouncedUpdateWordCount = useMemo(
    () => debounce(updateWordCount, 100),
    [updateWordCount]
  );

  const handleEditorOnChange = useCallback(
    (event, editor) => {
      const data = editor.getData();

      const updatedArticle = {
        ...finalArticle,
        articles: [
          {
            ...finalArticle.articles[0],
            content: data,
          },
        ],
      };
      dispatch(contentCreatorActions.setFinalArticle(updatedArticle));
      // updateWordCount(editor);
      debouncedUpdateWordCount(editor);
    },
    [finalArticle, dispatch, updateWordCount, debouncedUpdateWordCount]
  );

  // ========================
  const editorContainerRef = useRef(null);
  const editorMenuBarRef = useRef(null);
  const editorToolbarRef = useRef(null);
  const editorRef = useRef(null);
  const [isLayoutReady, setIsLayoutReady] = useState(false);

  useEffect(() => {
    setIsLayoutReady(true);

    return () => setIsLayoutReady(false);
  }, []);

  const editorConfig = {
    toolbar: {
      items: [
        "undo",
        "redo",
        "|",
        "heading",
        "|",
        "fontSize",
        "fontFamily",
        "fontColor",
        "fontBackgroundColor",
        "|",
        "bold",
        "italic",
        "underline",
        "|",
        "link",
        "insertTable",
        "highlight",
        "|",
        "alignment",
        "|",
        "bulletedList",
        "numberedList",
        "todoList",
        "outdent",
        "indent",
      ],
      shouldNotGroupWhenFull: false,
    },
    plugins: [
      AccessibilityHelp,
      Alignment,
      Autoformat,
      AutoImage,
      AutoLink,
      Autosave,
      BalloonToolbar,
      Bold,
      CloudServices,
      Code,
      Essentials,
      FindAndReplace,
      FontBackgroundColor,
      FontColor,
      FontFamily,
      FontSize,
      Heading,
      Highlight,
      HorizontalLine,
      ImageBlock,
      ImageCaption,
      ImageInline,
      ImageInsertViaUrl,
      ImageResize,
      ImageStyle,
      ImageToolbar,
      ImageUpload,
      Indent,
      IndentBlock,
      Italic,
      Link,
      LinkImage,
      List,
      ListProperties,
      PageBreak,
      Paragraph,
      PasteFromOffice,
      RemoveFormat,
      SelectAll,
      SpecialCharacters,
      SpecialCharactersArrows,
      SpecialCharactersCurrency,
      SpecialCharactersEssentials,
      SpecialCharactersLatin,
      SpecialCharactersMathematical,
      SpecialCharactersText,
      Strikethrough,
      Subscript,
      Superscript,
      Table,
      TableCaption,
      TableCellProperties,
      TableColumnResize,
      TableProperties,
      TableToolbar,
      TextTransformation,
      TodoList,
      Underline,
      Undo,
    ],
    balloonToolbar: [
      "bold",
      "italic",
      "|",
      "link",
      "|",
      "bulletedList",
      "numberedList",
    ],
    fontFamily: {
      supportAllValues: true,
    },
    fontSize: {
      options: [10, 12, 14, "default", 18, 20, 22],
      supportAllValues: true,
    },
    heading: {
      options: [
        {
          model: "paragraph",
          title: "Paragraph",
          class: "ck-heading_paragraph",
        },
        {
          model: "heading1",
          view: "h1",
          title: "Heading 1",
          class: "ck-heading_heading1",
        },
        {
          model: "heading2",
          view: "h2",
          title: "Heading 2",
          class: "ck-heading_heading2",
        },
        {
          model: "heading3",
          view: "h3",
          title: "Heading 3",
          class: "ck-heading_heading3",
        },
        {
          model: "heading4",
          view: "h4",
          title: "Heading 4",
          class: "ck-heading_heading4",
        },
        {
          model: "heading5",
          view: "h5",
          title: "Heading 5",
          class: "ck-heading_heading5",
        },
        {
          model: "heading6",
          view: "h6",
          title: "Heading 6",
          class: "ck-heading_heading6",
        },
      ],
    },
    image: {
      toolbar: [
        "toggleImageCaption",
        "imageTextAlternative",
        "|",
        "imageStyle:inline",
        "imageStyle:wrapText",
        "imageStyle:breakText",
        "|",
        "resizeImage",
      ],
    },
    initialData: `${finalArticle?.articles[0]?.content || ""}`,
    link: {
      addTargetToExternalLinks: true,
      defaultProtocol: "https://",
      decorators: {
        toggleDownloadable: {
          mode: "manual",
          label: "Downloadable",
          attributes: {
            download: "file",
          },
        },
      },
    },
    list: {
      properties: {
        styles: true,
        startIndex: true,
        reversed: true,
      },
    },
    menuBar: {
      isVisible: true,
    },
    placeholder: "Type or paste your content here!",
    table: {
      contentToolbar: [
        "tableColumn",
        "tableRow",
        "mergeTableCells",
        "tableProperties",
        "tableCellProperties",
      ],
    },
  };
  // ========================

  function handleValidateContent() {
    toast.remove();
    const content = formatToText(finalArticle?.articles[0]?.content);
    if (!content?.trim()) {
      toast.error("Please enter your content first!");
      return false;
    }

    // Matching
    const introMatch = content.match(/Intro([\s\S]*?)(?=Body|\s*$)/);
    const bodyMatch = content.match(/Body([\s\S]*)/);

    // Validate if intro or body sections are found
    if (!introMatch || !bodyMatch) {
      showErrorToast(
        `Please specify "Intro" and "Body" sections in your content to help video editors split the content!`
      );
      return false;
    }
    return true;
  }

  function handleNavigate() {
    const isValid = handleValidateContent();
    if (!isValid) {
      return;
    }
    router.push("/content-creator/create/generated-titles");
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-col mx-auto !h-[75vh] py-[1vw] w-11/12">
        {/* section to display article */}
        <div className="w-4/5 mx-auto !h-[70vh] ">
          <div>
            <div className="main-container">
              <div
                className="editor-container editor-container_document-editor"
                ref={editorContainerRef}
              >
                <div
                  className="editor-container__menu-bar"
                  ref={editorMenuBarRef}
                ></div>
                <div
                  className="editor-container__toolbar"
                  ref={editorToolbarRef}
                ></div>
                <div className="editor-container__editor-wrapper">
                  <div className="editor-container__editor">
                    <div ref={editorRef}>
                      {isLayoutReady && (
                        <>
                          <p className="ml-[72px] font-semibold !my-[--sy-5px]">
                            Word Count:
                            <span className="text-[--17px] ml-[3px]">
                              {pageState.wordCount}
                            </span>
                          </p>

                          <DynamicCKEditor
                            onReady={(editor) => {
                              editorToolbarRef.current.appendChild(
                                editor.ui.view.toolbar.element
                              );
                              editorMenuBarRef.current.appendChild(
                                editor.ui.view.menuBarView.element
                              );
                              updateWordCount(editor);
                            }}
                            onAfterDestroy={() => {
                              Array.from(
                                editorToolbarRef.current?.children || []
                              ).forEach((child) => child.remove());
                              Array.from(
                                editorMenuBarRef.current?.children || []
                              ).forEach((child) => child.remove());
                            }}
                            onChange={(event, editor) => {
                              handleEditorOnChange(event, editor);
                            }}
                            editor={DecoupledEditor}
                            config={editorConfig}
                          />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* buttons to move to last or next page */}
      <div className="flex justify-between items-center">
        <CustomBtn
          word={"Back"}
          btnColor="white"
          href="/content-creator/create/final-article"
        />

        <CustomBtn
          word={"Generate Titles"}
          btnColor="black"
          onClick={() => {
            handleNavigate();
          }}
        />
      </div>
    </div>
  );
}
